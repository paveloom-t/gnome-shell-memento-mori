import { ExtensionBase } from "resource:///org/gnome/shell/extensions/sharedInternals";

export declare function gettext(str: string): string;

export declare class Extension extends ExtensionBase {
  enable(): void;
  disable(): void;
}
