#!/usr/bin/env bash
set -euo pipefail

if [ -z "${NPM_TOKEN:-}" ]; then
  echo "NPM_TOKEN is required to install @ROTA-TCC/types from GitHub Packages." >&2
  exit 1
fi

printf '//npm.pkg.github.com/:_authToken=%s\n' "$NPM_TOKEN" >> "$HOME/.npmrc"

cat > .npmrc <<EOF
registry=https://registry.npmjs.org/
@ROTA-TCC:registry=https://npm.pkg.github.com/
strict-dep-builds=false
EOF
