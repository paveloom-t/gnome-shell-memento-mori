### Description

Make every second of your life count. Literally!

This extension adds a counter to the panel which counts down the time you have left based on your birthday and life
expectancy.

**Notice**: the extension is in the maintenance mode. Only new [translations](#translations) will be accepted.

#### Git mirrors

- [Codeberg](https://codeberg.org/paveloom-t/gnome-shell-memento-mori)
- [GitHub](https://github.com/paveloom-t/gnome-shell-memento-mori)
- [GitLab](https://gitlab.com/paveloom-g/typescript/gnome-shell-memento-mori)

#### Build

Create an extension bundle by running

```bash
./scripts/build.bash
```

This will create the `memento-mori@paveloom.zip` file. You can install the bundle by running

```bash
gnome-extensions install --force memento-mori@paveloom.zip
```

See also:

- [Debugging](https://gjs.guide/extensions/development/debugging.html)

#### Translations

To add a translation, contribute a `.po` file. See [`resources/po`](resources/po) for examples:

- [Dutch](resources/po/nl.po)
    - Heimen Stoffels <vistausss@fastmail.com>
- [English](resources/po/en.po)
    - Pavel Sobolev <contact@paveloom.dev>
- [French](resources/po/fr.po)
    - Simon Elst <kirmaha@duck.com>
- [Italian](resources/po/it_IT.po)
    - Jibus <jibus@tutanota.com>
- [Russian](resources/po/ru.po)
    - Pavel Sobolev <contact@paveloom.dev>
