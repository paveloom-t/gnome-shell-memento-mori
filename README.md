### Description

Make every second of your life count. Literally!

This extension adds a counter to the panel which counts down the time you have left based on your birthday and life expectancy.

#### Git mirrors

- [Codeberg](https://codeberg.org/paveloom-t/gnome-shell-memento-mori)
- [GitHub](https://github.com/paveloom-t/gnome-shell-memento-mori)
- [GitLab](https://gitlab.com/paveloom-g/typescript/gnome-shell-memento-mori)

#### Build

Make sure you have [Nix](https://nixos.org) installed. Then, run

```bash
nix build
ln -s "$PWD/result" "$HOME/.local/share/gnome-shell/extensions/memento-mori@paveloom"
```

To get an archive, run `nix build .#zip` instead.

#### Develop

You can lint the code with `npm run lint`.

You can run `npm run watch` to keep the bundle updated with changes.

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
