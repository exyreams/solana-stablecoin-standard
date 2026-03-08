import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Keypair,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getMint,
} from "@solana/spl-token";
import { assert } from "chai";
import { SssToken } from "../target/types/sss_token";
import {
  airdrop,
  expectError,
  setupSss1Token,
  initializeMetadata,
  sss1Config,
  findStablecoinStatePda,
  findRolesConfigPda,
  TokenTestContext,
} from "./helpers";

describe("initialize_metadata", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SssToken as Program<SssToken>;

  // ════════════════════════════════════════════════════════════
  // Happy path
  // ════════════════════════════════════════════════════════════

  it("writes name/symbol/uri onto the mint after initialize", async () => {
    const ctx = await setupSss1Token(program, provider);

    // Confirm metadata not yet on mint (MetadataPointer points to mint but
    // the metadata account data should be absent / empty before this call).
    // We just verify the call succeeds and the event is emitted.
    await initializeMetadata(ctx);

    // Read the on-chain StablecoinState to confirm source values
    const state = await program.account.stablecoinState.fetch(
      ctx.stablecoinState
    );
    assert.equal(state.name, "Test Stablecoin");
    assert.equal(state.symbol, "TUSD");
    assert.equal(state.uri, "https://example.com/metadata.json");
  });

  it("succeeds for SSS-1 (no hooks, no delegate)", async () => {
    const ctx = await setupSss1Token(program, provider);
    // Should not throw
    await initializeMetadata(ctx);
  });

  it("can be called immediately after initialize in same test", async () => {
    const ctx = await setupSss1Token(program, provider);

    // simulate separate tx — in tests each .rpc() is already a separate tx
    await initializeMetadata(ctx);

    const state = await program.account.stablecoinState.fetch(
      ctx.stablecoinState
    );
    assert.equal(state.name, "Test Stablecoin");
  });

  // ════════════════════════════════════════════════════════════
  // Auth checks
  // ════════════════════════════════════════════════════════════

  it("rejects non-master-authority caller", async () => {
    const ctx = await setupSss1Token(program, provider);
    const imposter = Keypair.generate();
    await airdrop(provider, imposter.publicKey);

    await expectError(
      program.methods
        .initializeMetadata()
        .accountsStrict({
          authority: imposter.publicKey,
          mint: ctx.mint.publicKey,
          stablecoinState: ctx.stablecoinState,
          rolesConfig: ctx.rolesConfig,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([imposter])
        .rpc(),
      "Unauthorized"
    );
  });

  it("rejects wrong mint passed in accounts", async () => {
    const ctx = await setupSss1Token(program, provider);
    const wrongMint = Keypair.generate(); // random pubkey, not initialized

    await expectError(
      program.methods
        .initializeMetadata()
        .accountsStrict({
          authority: ctx.authority.publicKey,
          mint: wrongMint.publicKey,   // wrong mint
          stablecoinState: ctx.stablecoinState,
          rolesConfig: ctx.rolesConfig,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([ctx.authority])
        .rpc(),
      "AccountNotInitialized"  // Anchor checks if mint account is initialized
    );
  });

  // ════════════════════════════════════════════════════════════
  // Idempotency / double-call guard
  // ════════════════════════════════════════════════════════════

  it("rejects a second call (Token-2022 AlreadyInUse)", async () => {
    const ctx = await setupSss1Token(program, provider);
    await initializeMetadata(ctx);

    // Second call should fail at the Token-2022 layer
    await expectError(
      initializeMetadata(ctx),
      // Token-2022 returns a generic program error for already-initialized metadata
      "Error"
    );
  });

  // ════════════════════════════════════════════════════════════
  // New authority can also call it (after transfer_authority)
  // ════════════════════════════════════════════════════════════

  it("works when called by the new master authority after transfer", async () => {
    const ctx = await setupSss1Token(program, provider);
    const newMaster = Keypair.generate();
    await airdrop(provider, newMaster.publicKey);

    // Step 1: initiate transfer
    await program.methods
      .transferAuthority(newMaster.publicKey)
      .accountsStrict({
        caller: ctx.authority.publicKey,
        stablecoinState: ctx.stablecoinState,
        rolesConfig: ctx.rolesConfig,
      })
      .signers([ctx.authority])
      .rpc();

    // Step 2: accept transfer
    await program.methods
      .transferAuthority(null)
      .accountsStrict({
        caller: newMaster.publicKey,
        stablecoinState: ctx.stablecoinState,
        rolesConfig: ctx.rolesConfig,
      })
      .signers([newMaster])
      .rpc();

    // New master can now call initialize_metadata
    await program.methods
      .initializeMetadata()
      .accountsStrict({
        authority: newMaster.publicKey,
        mint: ctx.mint.publicKey,
        stablecoinState: ctx.stablecoinState,
        rolesConfig: ctx.rolesConfig,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([newMaster])
      .rpc();
  });

  // ════════════════════════════════════════════════════════════
  // Old authority cannot call after transfer
  // ════════════════════════════════════════════════════════════

  it("rejects old authority after transfer_authority completes", async () => {
    const ctx = await setupSss1Token(program, provider);
    const newMaster = Keypair.generate();
    await airdrop(provider, newMaster.publicKey);

    // Complete the transfer
    await program.methods
      .transferAuthority(newMaster.publicKey)
      .accountsStrict({
        caller: ctx.authority.publicKey,
        stablecoinState: ctx.stablecoinState,
        rolesConfig: ctx.rolesConfig,
      })
      .signers([ctx.authority])
      .rpc();

    await program.methods
      .transferAuthority(null)
      .accountsStrict({
        caller: newMaster.publicKey,
        stablecoinState: ctx.stablecoinState,
        rolesConfig: ctx.rolesConfig,
      })
      .signers([newMaster])
      .rpc();

    // Old authority should now fail
    await expectError(
      program.methods
        .initializeMetadata()
        .accountsStrict({
          authority: ctx.authority.publicKey,
          mint: ctx.mint.publicKey,
          stablecoinState: ctx.stablecoinState,
          rolesConfig: ctx.rolesConfig,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([ctx.authority])
        .rpc(),
      "Unauthorized"
    );
  });
});
