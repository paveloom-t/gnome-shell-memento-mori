import Clutter from "gi://Clutter";
import Gio from "gi://Gio";
import GLib from "gi://GLib";
import GObject from "gi://GObject";
import St from "gi://St";

import { Extension, gettext as _ } from "resource:///org/gnome/shell/extensions/extension.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { Button } from "resource:///org/gnome/shell/ui/panelMenu.js";

class MementoMoriIndicator extends Button {
  readonly #settings: Gio.Settings;
  readonly #label: St.Label;

  static {
    GObject.registerClass(
      {
        GTypeName: "MementoMoriIndicator",
      },
      this,
    );
  }

  constructor(settings: Gio.Settings) {
    super(
      // Menu alignment
      0,
      // Name of the button
      _("Memento Mori Extension"),
      // Don't create the menu?
      true,
    );

    this.#settings = settings;

    this.#label = St.Label.new(this.getText());
    this.#label.get_clutter_text().set_y_align(Clutter.ActorAlign.CENTER);

    this.add_child(this.#label);
  }

  update() {
    this.#label.text = this.getText();
  }

  private getText(): string {
    const nowDate = GLib.DateTime.new_now_local();
    const passingAwayDate = this.getPassingAwayDate();

    const microseconds = passingAwayDate.difference(nowDate);

    const seconds = Math.floor(microseconds / 1e6);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.436875);
    const years = Math.floor(days / 365.2425);

    const formatString = this.#settings.get_string("format-string")!;

    return formatString
      .replace("${s}", seconds.toFixed())
      .replace("${m}", minutes.toFixed())
      .replace("${h}", hours.toFixed())
      .replace("${d}", days.toFixed())
      .replace("${w}", weeks.toFixed())
      .replace("${M}", months.toFixed())
      .replace("${y}", years.toFixed());
  }

  private getPassingAwayDate(): GLib.DateTime {
    const birthdayDate = GLib.DateTime.new_local(
      this.#settings.get_int("birth-year"),
      this.#settings.get_int("birth-month"),
      this.#settings.get_int("birth-day"),
      0,
      0,
      0,
    );
    return birthdayDate.add_years(this.#settings.get_int("life-expectancy"))!;
  }
}

export default class MementoMoriExtension extends Extension {
  #settings: Gio.Settings | null = null;
  #indicator: MementoMoriIndicator | null = null;
  #signalHandler: number | null = null;
  #timeout: number | null = null;

  override enable() {
    this.#settings = this.getSettings();

    this.addIndicator();

    this.#signalHandler = this.#settings.connect("changed", (_: Gio.Settings, key: string) => {
      switch (key) {
        case "format-string":
        case "birth-year":
        case "birth-month":
        case "birth-day":
        case "life-expectancy":
          this.#indicator?.update();
          break;
        case "extension-position":
        case "extension-index":
          this.removeIndicator();
          this.addIndicator();
          break;
      }
    });
  }

  override disable() {
    if (this.#settings !== null && this.#signalHandler !== null) {
      this.#settings.disconnect(this.#signalHandler);
    }
    this.#signalHandler = null;
    this.#settings = null;
    this.removeIndicator();
  }

  private addIndicator() {
    if (this.#settings === null) {
      return;
    }

    this.#indicator = new MementoMoriIndicator(this.#settings);

    Main.panel.addToStatusArea(
      this.uuid,
      this.#indicator,
      this.#settings.get_int("extension-index"),
      this.#settings.get_string("extension-position")!,
    );

    this.#timeout = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
      this.#indicator?.update();
      return GLib.SOURCE_CONTINUE;
    });
  }

  private removeIndicator() {
    if (this.#timeout !== null) {
      GLib.source_remove(this.#timeout);
    }
    this.#timeout = null;
    this.#indicator?.destroy();
    this.#indicator = null;
  }
}
