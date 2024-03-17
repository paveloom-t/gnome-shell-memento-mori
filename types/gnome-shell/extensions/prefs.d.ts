import type Adw from "gi://Adw";

import { ExtensionBase } from "resource:///org/gnome/shell/extensions/sharedInternals.js";

export declare class ExtensionPreferences extends ExtensionBase {
  fillPreferencesWindow(window: Adw.PreferencesWindow): void;
}

export { gettext } from "resource:///org/gnome/shell/extensions/extension.js";
