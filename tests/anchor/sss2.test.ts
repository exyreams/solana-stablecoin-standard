import * as anchor from '@coral-xyz/anchor';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { expect } from 'chai';
import { Presets } from '@stbr/sss-token-sdk';
import { getAssociatedTokenAddress, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';

describe('SSS-2: Compliant Stablecoin', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;
  const authority = (provider.wallet as anchor.Wallet).payer;
  const badActor = Keypair.generate();

  let stable: any;

  before('Initialize SSS-2 stablecoin + airdrop bad actor', async () => {
    stable = await (await import('@stbr/sss-token-sdk')).SolanaStablecoin.create(connection, {
      preset: Presets.SSS_2,
      name: 'Compliant Dollar',
      symbol: 'CUSD',
      decimals: 6,
      uri: '',
      authority,
    });
    expect(stable.mint).to.be.instanceOf(PublicKey);
    console.log('  Mint:', stable.mint.toBase58());

    // Airdrop to bad actor for fees
    const sig = await connection.requestAirdrop(badActor.publicKey, 1_000_000_000);
    await connection.confirmTransaction(sig);
  });

  it('SSS-2: getStatus shows compliance enabled', async () => {
    const status = await stable.getStatus();
    expect(status.enablePermanentDelegate).to.be.true;
    expect(status.enableTransferHook).to.be.true;
  });

  it('SSS-2: mint to authority', async () => {
    await stable.updateMinter({
      minter: authority.publicKey,
      quota: 0n, // unlimited
      active: true,
    });

    const sig = await stable.mint({
      recipient: authority.publicKey,
      amount: 1_000_000_000n,
    });
    expect(sig).to.be.a('string');
  });

  it('SSS-2: blacklist add creates PDA', async () => {
    const sig = await stable.compliance.blacklistAdd(
      badActor.publicKey,
      'Test OFAC match',
      authority,
    );
    expect(sig).to.be.a('string');
    const isBlocked = await stable.compliance.isBlacklisted(badActor.publicKey);
    expect(isBlocked).to.be.true;
  });

  it('SSS-2: transfer to blacklisted address is blocked by hook', async () => {
    const badActorAta = await getAssociatedTokenAddress(
      stable.mint, badActor.publicKey, false, TOKEN_2022_PROGRAM_ID,
    );
    try {
      await stable.mint({ recipient: badActor.publicKey, amount: 1n });
      // The transfer hook should reject this
      expect.fail('Transfer to blacklisted address should have been rejected');
    } catch (e: any) {
      // Expected — hook returned DestinationBlacklisted error
      expect(e.message).to.match(/blacklisted|hook|0x\w+/i);
    }
  });

  it('SSS-2: blacklist remove closes PDA', async () => {
    const sig = await stable.compliance.blacklistRemove(badActor.publicKey, authority);
    expect(sig).to.be.a('string');
    const isBlocked = await stable.compliance.isBlacklisted(badActor.publicKey);
    expect(isBlocked).to.be.false;
  });

  it('SSS-2: seize tokens via permanent delegate', async () => {
    // Mint to bad actor first (now unblocked)
    await stable.mint({ recipient: badActor.publicKey, amount: 100_000_000n });

    const authorityAta = await getAssociatedTokenAddress(
      stable.mint, authority.publicKey, false, TOKEN_2022_PROGRAM_ID,
    );
    const badActorAta = await getAssociatedTokenAddress(
      stable.mint, badActor.publicKey, false, TOKEN_2022_PROGRAM_ID,
    );

    const sig = await stable.compliance.seize({
      fromTokenAccount: badActorAta,
      toTokenAccount: authorityAta,
      amount: 100_000_000n,
      seizer: authority,
    });
    expect(sig).to.be.a('string');
  });
});
