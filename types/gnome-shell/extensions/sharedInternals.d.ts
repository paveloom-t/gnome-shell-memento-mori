import Gio from "gi://Gio";

export declare interface ExtensionMetadata {
  readonly uuid: string;
  readonly name: string;
  readonly description: string;
  readonly "version-name": string;
  readonly "shell-version": readonly string[];
  readonly dir: Gio.File;
  readonly path: string;
  readonly url: string;
}

declare class ExtensionBase {
  constructor(metadata: ExtensionMetadata);
  get uuid(): ExtensionMetadata["uuid"];
  getSettings(schema?: string): Gio.Settings;
}
