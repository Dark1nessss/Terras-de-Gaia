import { lstatSync, realpathSync } from 'fs';
import path from 'path';
import Module from 'module';

// Fix module resolution for cPanel nodevenv symlinked node_modules.
// Must run BEFORE loading Next.js so the native @next/swc binding is found.
// Without this, Next.js falls back to a WASM binary that OOMs on shared hosting.
const _nmPath = path.join(process.cwd(), 'node_modules');
try {
  if (lstatSync(_nmPath).isSymbolicLink()) {
    const realNm = realpathSync(_nmPath);
    process.env.NODE_PATH = process.env.NODE_PATH
      ? `${process.env.NODE_PATH}:${realNm}`
      : realNm;
    (Module as any)._initPaths();
    console.log(`[server] Symlinked node_modules → ${realNm} (NODE_PATH updated)`);
  }
} catch { /* not a symlink, skip */ }

// With output: standalone, Next.js generates a self-contained server.
// We must use it directly — `next start` and the custom HTTP wrapper do not
// work with standalone mode and will trigger a WASM OOM or a warning.
// NODE_PATH is fixed above before this require runs.
// Use __dirname so the path is absolute regardless of cwd when Passenger starts us.
// eslint-disable-next-line @typescript-eslint/no-require-imports
require(path.join(__dirname, '.next', 'standalone', 'server.js'));
