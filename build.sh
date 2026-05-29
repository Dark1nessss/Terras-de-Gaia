#!/bin/bash
# Build script for cPanel - handles symlinked node_modules from nodevenv

# If node_modules is a symlink (nodevenv setup), expose the real path via NODE_PATH
# so Turbopack's PostCSS subprocess can resolve devDependency plugins like @tailwindcss/postcss
if [ -L "node_modules" ]; then
  REAL_NM=$(readlink -f node_modules)
  export NODE_PATH="$REAL_NM"
  echo "Detected symlinked node_modules → $REAL_NM"
  echo "Set NODE_PATH=$REAL_NM"
fi

npm run build
