#!/bin/bash
# Build script for cPanel - handles nodevenv symlinked node_modules

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

# Limit Turbopack/Tokio thread count to stay within cPanel's OS thread limits
export TOKIO_WORKER_THREADS=2
export RAYON_NUM_THREADS=2

npm run build
