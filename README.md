### Description

Make every second of your life count. Literally!

This extension adds a counter to the panel which counts down the time you have left based on your birthday and life expectancy.

#### Git mirrors

- [Codeberg](https://codeberg.org/paveloom-t/gnome-shell-memento-mori)
- [GitHub](https://github.com/paveloom-t/gnome-shell-memento-mori)
- [GitLab](https://gitlab.com/paveloom-g/typescript/gnome-shell-memento-mori)

#### Build

```bash
yarn
yarn build
ln -s "$PWD/dist" "$HOME/.local/share/gnome-shell/extensions/memento-mori@paveloom"
```

To archive the result after the build, run `yarn build:package` instead of `yarn build`.

#### Develop

You can lint the code with `yarn lint`.

You can run `yarn watch` to keep the bundle updated with changes.

On Wayland, test the extension by running

```bash
env MUTTER_DEBUG_DUMMY_MODE_SPECS=1280x720 \
  dbus-run-session -- gnome-shell --nested --wayland
```

To add a translation, contribute a `.po` file. See [`resources/po`](resources/po) for examples.
