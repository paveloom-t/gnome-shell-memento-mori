#!/usr/bin/env bash

set -e

cd "$(dirname "$(dirname "$(readlink -f "$0")")")"

POT="resources/po/template.pot"

rm -f "$POT"

xgettext src/*.ts \
    --from-code=UTF-8 \
    --language=JavaScript \
    --omit-header \
    --output="$POT"

xgettext resources/schemas/org.gnome.shell.extensions.memento-mori.gschema.xml \
    --its="resources/po/gschema.its" \
    --join-existing \
    --omit-header \
    --output="$POT"

for po in resources/po/*.po; do
    msgmerge \
        --backup=none \
        --no-fuzzy-matching \
        --quiet \
        --update \
        "$po" "$POT"
done
