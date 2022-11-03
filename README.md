### Description

Make every second of your life count. Literally!

This extension adds a counter to the panel which counts down the time you have left based on your birthday and life expectancy.

#### Git mirrors

- [Codeberg](https://codeberg.org/paveloom-t/gnome-shell-memento-mori)
- [GitHub](https://github.com/paveloom-t/gnome-shell-memento-mori)
- [GitLab](https://gitlab.com/paveloom-g/typescript/gnome-shell-memento-mori)

#### Build

Make sure you have the correct version of Node installed. Here's an example using [`fnm`](https://github.com/Schniz/fnm):

```
fnm use
```

Make sure you have [Bun](https://bun.sh) installed. Then, run

```bash
bun install
bun run build
ln -s "$PWD/dist" "$HOME/.local/share/gnome-shell/extensions/memento-mori@paveloom"
```

To archive the result after the build, run `bun run build:package` instead of `bun run build`.

#### Develop

You can lint the code with `bun run lint`.

You can run `bun run watch` to keep the bundle updated with changes.

On Wayland, test the extension by running

```bash
env MUTTER_DEBUG_DUMMY_MODE_SPECS=1280x720 \
  dbus-run-session -- gnome-shell --nested --wayland
```

#### Translations

To add a translation, contribute a `.po` file. See [`resources/po`](resources/po) for examples.

- [Dutch](resources/po/nl.po)
  - Heimen Stoffels <vistausss@fastmail.com>
- [English](resources/po/en.po)
  - Pavel Sobolev <paveloom@riseup.net>
- [French](resources/po/fr.po)
  - Simon Elst <kirmaha@duck.com>
- [Italian](resources/po/it_IT.po)
  - Jibus <jibus@tutanota.com>
- [Russian](resources/po/ru.po)
  - Pavel Sobolev <paveloom@riseup.net>
