"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const url_1 = require("url");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const module_1 = __importDefault(require("module"));
// Fix module resolution for cPanel nodevenv symlinked node_modules.
// Must run BEFORE loading Next.js so the native @next/swc binding is found.
// Without this, Next.js falls back to a WASM binary that OOMs on shared hosting.
const _nmPath = path_1.default.join(process.cwd(), 'node_modules');
try {
    if ((0, fs_1.lstatSync)(_nmPath).isSymbolicLink()) {
        const realNm = (0, fs_1.realpathSync)(_nmPath);
        process.env.NODE_PATH = process.env.NODE_PATH
            ? `${process.env.NODE_PATH}:${realNm}`
            : realNm;
        module_1.default._initPaths();
        console.log(`[server] Symlinked node_modules → ${realNm} (NODE_PATH updated)`);
    }
}
catch { /* not a symlink, skip */ }
// Load Next.js AFTER NODE_PATH fix (inline require preserves execution order;
// a top-level import would be hoisted before our fix code runs).
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
const _nextPkg = require('next');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const next = (_a = _nextPkg.default) !== null && _a !== void 0 ? _a : _nextPkg;
const dev = process.env.NODE_ENV !== 'production';
const hostname = (_b = process.env.HOST) !== null && _b !== void 0 ? _b : 'localhost';
const port = parseInt((_c = process.env.PORT) !== null && _c !== void 0 ? _c : '3000', 10);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    (0, http_1.createServer)(async (req, res) => {
        var _a;
        try {
            const parsedUrl = (0, url_1.parse)((_a = req.url) !== null && _a !== void 0 ? _a : '/', true);
            await handle(req, res, parsedUrl);
        }
        catch (err) {
            console.error('Error handling', req.url, err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
    })
        .once('error', (err) => {
        console.error(err);
        process.exit(1);
    })
        .listen(port, () => {
        console.log(`> Next.js ready on http://${hostname}:${port} [${dev ? 'dev' : 'prod'}]`);
    });
});
