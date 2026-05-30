"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
// With output: standalone, Next.js generates a self-contained server.
// We must use it directly — `next start` and the custom HTTP wrapper do not
// work with standalone mode and will trigger a WASM OOM or a warning.
// NODE_PATH is fixed above before this require runs.
// Use __dirname so the path is absolute regardless of cwd when Passenger starts us.
// eslint-disable-next-line @typescript-eslint/no-require-imports
require(path_1.default.join(__dirname, '.next', 'standalone', 'server.js'));
