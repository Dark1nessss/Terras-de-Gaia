#!/bin/bash
# Build script for cPanel - handles nodevenv symlinked node_modules
set -e

# Clean previous build artifacts to prevent hash mismatches between
# server.js and static files when rebuilding without restarting.
echo "Cleaning previous build..."
rm -rf .next

# cPanel sets NODE_ENV=production which skips devDependencies.
# Force a full install so build tools (tailwindcss, typescript, etc.) are present.
npm install --include=dev

# If node_modules is a symlink (nodevenv), expose the real path via NODE_PATH
# so Turbopack's PostCSS subprocess can resolve plugins like @tailwindcss/postcss.
if [ -L "node_modules" ]; then
  REAL_NM=$(readlink -f node_modules)
  export NODE_PATH="$REAL_NM"
  echo "Detected symlinked node_modules → $REAL_NM (NODE_PATH set)"
fi

# Limit worker threads to stay within cPanel's OS limits
export TOKIO_WORKER_THREADS=2
export RAYON_NUM_THREADS=2
export NODE_OPTIONS="--max-old-space-size=1536"

npm run build -- --webpack

# Copy public assets into standalone output (required for the standalone server to serve them)
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
echo "Static assets copied to standalone"

# Compile server.ts → server.js (fixes NODE_PATH then delegates to .next/standalone/server.js)
npx tsc --outDir . --module commonjs --target es2019 --esModuleInterop --skipLibCheck server.ts
echo "server.js compiled successfully"
