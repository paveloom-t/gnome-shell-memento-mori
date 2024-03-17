#!/usr/bin/env bash

set -e

cd "$(dirname "$(dirname "$(readlink -f "$0")")")"

UUID="memento-mori@paveloom"

rm -rf "$UUID.shell-extension.zip" "$UUID.zip"

if [ "$1" == "-t" ]; then
    rm -rf types/generated
fi

if [ ! -d types/generated ]; then
    echo "Generating declaration files from GIRs..."

    # shellcheck disable=2086
    npx ts-for-gir generate -g $GIR_DIRECTORIES
fi

echo "Transpiling TypeScript to JavaScript..."

sed -i 's#^$#// EMPTY LINE#' src/*.ts

npx tsc

sed -i 's#\s*// EMPTY LINE##' src/*.ts src/*.js

echo "Formatting the transpiled code..."

sed -i '\#^/\*#d' src/*.js

npx eslint src/*.js --fix

echo "Packing the extension..."

gnome-extensions pack src \
    --extra-source "../resources/metadata.json" \
    --extra-source "../LICENSE.md" \
    --podir "../resources/po" \
    --schema "../resources/schemas/org.gnome.shell.extensions.memento-mori.gschema.xml"

mv "$UUID.shell-extension.zip" "$UUID.zip"
