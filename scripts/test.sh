#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"

cd "$SCRIPT_DIR/.." || exit

functions=(hello-world receptionist last-received-person)

for fn in "${functions[@]}"; do
    pushd "$fn"
        npm run test
    popd
done
