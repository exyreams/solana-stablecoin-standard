import { Command } from 'commander';
import { Connection, PublicKey } from '@solana/web3.js';
import { SolanaStablecoin } from 'sss-token-sdk';
import { loadKeypair } from '../../utils/keypair';
import { error } from '../../utils/display';

export function tuiCommand(): Command {
  const cmd = new Command('tui');
  cmd
    .description('Launch interactive Terminal UI for real-time monitoring')
    .action(async (opts, cmd) => {
      const globals = cmd.parent!.opts();
      try {
        // Check if blessed is installed
        let blessed: any;
        let contrib: any;
        try {
          blessed = require('blessed');
          contrib = require('blessed-contrib');
        } catch (err) {
          error('TUI requires blessed and blessed-contrib packages.');
          error('Install them with: pnpm add blessed blessed-contrib @types/blessed');
          process.exit(1);
        }

        const authority = loadKeypair(globals.keypair);
        const connection = new Connection(globals.url, 'confirmed');
        const stable = await SolanaStablecoin.load(
          connection,
          new PublicKey(globals.mint),
          authority,
        );

        // Launch TUI
        await launchTUI(stable, connection, blessed, contrib);
      } catch (err: any) {
        error(`TUI launch failed: ${err.message}`);
        process.exit(1);
      }
    });
  return cmd;
}

async function launchTUI(stable: SolanaStablecoin, connection: Connection, blessed: any, contrib: any) {
  // Create screen
  const screen = blessed.screen({
    smartCSR: true,
    title: 'SSS Token Monitor',
  });

  // Create grid layout
  const grid = new contrib.grid({ rows: 12, cols: 12, screen });

  // ── Header box ───────────────────────────────────────────────────────────
  const headerBox = grid.set(0, 0, 2, 12, blessed.box, {
    label: ' Solana Stablecoin Standard — Real-Time Monitor ',
    tags: true,
    border: { type: 'line' },
    style: {
      fg: 'white',
      border: { fg: 'cyan' },
      label: { fg: 'cyan', bold: true },
    },
  });

  // ── Token Info ───────────────────────────────────────────────────────────
  const tokenInfoBox = grid.set(2, 0, 4, 6, blessed.box, {
    label: ' Token Info ',
    tags: true,
    border: { type: 'line' },
    style: {
      fg: 'white',
      border: { fg: 'green' },
    },
    scrollable: true,
    alwaysScroll: true,
    keys: true,
    vi: true,
  });

  // ── Roles ────────────────────────────────────────────────────────────────
  const rolesBox = grid.set(2, 6, 4, 6, blessed.box, {
    label: ' Roles ',
    tags: true,
    border: { type: 'line' },
    style: {
      fg: 'white',
      border: { fg: 'yellow' },
    },
    scrollable: true,
    alwaysScroll: true,
    keys: true,
    vi: true,
  });

  // ── Minters ──────────────────────────────────────────────────────────────
  const mintersTable = grid.set(6, 0, 3, 12, contrib.table, {
    label: ' Minters ',
    keys: true,
    vi: true,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'blue',
    interactive: false,
    columnSpacing: 2,
    columnWidth: [44, 10, 20, 20],
  });

  // ── Supply Chart ─────────────────────────────────────────────────────────
  const supplyLine = grid.set(9, 0, 3, 6, contrib.line, {
    label: ' Supply History ',
    showLegend: true,
    legend: { width: 12 },
    style: {
      line: 'yellow',
      text: 'green',
      baseline: 'white',
    },
  });

  // ── Activity Log ─────────────────────────────────────────────────────────
  const activityLog = grid.set(9, 6, 3, 6, blessed.log, {
    label: ' Activity Log ',
    tags: true,
    border: { type: 'line' },
    style: {
      fg: 'white',
      border: { fg: 'magenta' },
    },
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
      ch: ' ',
      track: { bg: 'cyan' },
      style: { inverse: true },
    },
  });

  // ── Status bar ───────────────────────────────────────────────────────────
  const statusBar = blessed.box({
    bottom: 0,
    left: 0,
    width: '100%',
    height: 1,
    tags: true,
    style: {
      fg: 'white',
      bg: 'blue',
    },
  });
  screen.append(statusBar);

  // Data storage
  const supplyHistory: { x: string[]; y: number[] } = { x: [], y: [] };
  let updateCount = 0;

  // ── Update function ──────────────────────────────────────────────────────
  async function updateData() {
    try {
      updateCount++;
      const timestamp = new Date().toLocaleTimeString();

      // Fetch all data
      const [status, supply, roles, minters] = await Promise.all([
        stable.getStatus(),
        stable.getTotalSupply(),
        stable.getRoles(),
        stable.getMinters(),
      ]);

      const humanSupply = (Number(supply) / 10 ** status.decimals).toLocaleString();

      // Update header
      headerBox.setContent(
        `{center}{bold}${status.name} (${status.symbol}){/bold}\n` +
        `Mint: ${status.mint.toBase58()}\n` +
        `Last Update: ${timestamp} | Refresh: ${updateCount}{/center}`,
      );

      // Update token info
      let preset = 'SSS-1 (Minimal)';
      if (
        status.enablePermanentDelegate &&
        status.enableTransferHook &&
        status.enableConfidentialTransfers
      ) {
        preset = 'SSS-2 + SSS-3 (Hybrid)';
      } else if (status.enablePermanentDelegate && status.enableTransferHook) {
        preset = 'SSS-2 (Compliant)';
      } else if (status.enableConfidentialTransfers) {
        preset = 'SSS-3 (Private)';
      }

      tokenInfoBox.setContent(
        `{bold}Preset:{/bold} ${preset}\n` +
        `{bold}Supply:{/bold} ${humanSupply} ${status.symbol}\n` +
        `{bold}Decimals:{/bold} ${status.decimals}\n` +
        `{bold}Version:{/bold} ${status.version}\n` +
        `{bold}Paused:{/bold} ${status.paused ? '{red-fg}YES{/red-fg}' : '{green-fg}NO{/green-fg}'}\n\n` +
        `{bold}Extensions:{/bold}\n` +
        `  Permanent Delegate: ${status.enablePermanentDelegate ? '✓' : '✗'}\n` +
        `  Transfer Hook: ${status.enableTransferHook ? '✓' : '✗'}\n` +
        `  Default Frozen: ${status.defaultAccountFrozen ? '✓' : '✗'}\n` +
        `  Confidential: ${status.enableConfidentialTransfers ? '✓' : '✗'}`,
      );

      // Update roles
      rolesBox.setContent(
        `{bold}Master:{/bold}\n${roles.masterAuthority.toBase58().slice(0, 32)}...\n\n` +
        `{bold}Pending:{/bold}\n${roles.pendingMaster ? roles.pendingMaster.toBase58().slice(0, 32) + '...' : '(none)'}\n\n` +
        `{bold}Burner:{/bold}\n${roles.burner.toBase58().slice(0, 32)}...\n\n` +
        `{bold}Pauser:{/bold}\n${roles.pauser.toBase58().slice(0, 32)}...\n\n` +
        `{bold}Blacklister:{/bold}\n${roles.blacklister.toBase58().slice(0, 32)}...\n\n` +
        `{bold}Seizer:{/bold}\n${roles.seizer.toBase58().slice(0, 32)}...`,
      );

      // Update minters table
      const minterRows = minters.map((m: any) => {
        const quotaHuman =
          m.quota === 0n ? 'Unlimited' : (Number(m.quota) / 10 ** status.decimals).toLocaleString();
        const mintedHuman = (Number(m.minted) / 10 ** status.decimals).toLocaleString();
        return [
          m.minter.toBase58().slice(0, 42) + '...',
          m.active ? '🟢 Active' : '🔴 Inactive',
          quotaHuman,
          mintedHuman,
        ];
      });

      mintersTable.setData({
        headers: ['Minter', 'Status', 'Quota', 'Minted'],
        data: minterRows.length > 0 ? minterRows : [['(no minters)', '', '', '']],
      });

      // Update supply chart
      supplyHistory.x.push(timestamp);
      supplyHistory.y.push(Number(supply) / 10 ** status.decimals);
      if (supplyHistory.x.length > 20) {
        supplyHistory.x.shift();
        supplyHistory.y.shift();
      }

      supplyLine.setData([
        {
          title: status.symbol,
          x: supplyHistory.x,
          y: supplyHistory.y,
          style: { line: 'yellow' },
        },
      ]);

      // Log activity
      activityLog.log(`[${timestamp}] Supply: ${humanSupply} ${status.symbol}`);
      if (status.paused) {
        activityLog.log(`{red-fg}[${timestamp}] ⚠ PAUSED{/red-fg}`);
      }

      // Update status bar
      statusBar.setContent(
        ` {bold}SSS Token Monitor{/bold} | ` +
        `Cluster: ${connection.rpcEndpoint.includes('devnet') ? 'Devnet' : connection.rpcEndpoint.includes('mainnet') ? 'Mainnet' : 'Localnet'} | ` +
        `Press 'q' to quit | Press 'r' to refresh now`,
      );

      screen.render();
    } catch (err: any) {
      activityLog.log(`{red-fg}[ERROR] ${err.message}{/red-fg}`);
      screen.render();
    }
  }

  // ── Key bindings ─────────────────────────────────────────────────────────
  screen.key(['q', 'C-c'], () => {
    return process.exit(0);
  });

  screen.key(['r'], () => {
    activityLog.log('{cyan-fg}[MANUAL REFRESH]{/cyan-fg}');
    updateData();
  });

  // ── Initial load and auto-refresh ────────────────────────────────────────
  activityLog.log('{green-fg}[STARTED] TUI Monitor initialized{/green-fg}');
  await updateData();

  // Auto-refresh every 5 seconds
  setInterval(updateData, 5000);

  screen.render();
}
