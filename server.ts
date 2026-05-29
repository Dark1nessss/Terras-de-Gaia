import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
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

// Load Next.js AFTER NODE_PATH fix (inline require preserves execution order;
// a top-level import would be hoisted before our fix code runs).
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
const _nextPkg: any = require('next');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const next: (opts: any) => any = _nextPkg.default ?? _nextPkg;

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST ?? 'localhost';
const port = parseInt(process.env.PORT ?? '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const parsedUrl = parse(req.url ?? '/', true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err: Error) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Next.js ready on http://${hostname}:${port} [${dev ? 'dev' : 'prod'}]`);
    });
});
