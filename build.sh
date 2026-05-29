#!/bin/bash
# Build script for cPanel - forces webpack instead of turbopack
export NEXT_PRIVATE_TURBOPACK=0
npm run build
