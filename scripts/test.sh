#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"

cd "$SCRIPT_DIR/.." || exit

functions=(receptionist last-received-person)

for fn in "${functions[@]}"; do
    pushd "$fn"
        npm install
        npm run test
    popd
done
