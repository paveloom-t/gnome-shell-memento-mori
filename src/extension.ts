/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import GLib from "@gi-types/glib2";
import GObject from "@gi-types/gobject2";
import type Gio from "@gi-types/gio2";
import { ActorAlign } from "@gi-types/clutter10";
import { Label } from "@gi-types/st1";
import {
    add,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInMonths,
    differenceInSeconds,
    differenceInWeeks,
    differenceInYears,
} from "date-fns";

import { unpackSettings, SettingsValues } from "utils";

const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const { Button } = imports.ui.panelMenu;
const { getSettings, initTranslations } = imports.misc.extensionUtils;
const _ = imports.misc.extensionUtils.gettext;

// Indicator
const Indicator = GObject.registerClass(
    class Indicator extends Button {
        // Settings
        #settings: Gio.Settings;
        // The date of passing away
        #end: Date;
        // Label
        #label: Label;
        // Construct the indicator
        constructor() {
            // Initialize the button
            super(
                // Menu alignment
                0,
                // Name of the button
                _("Memento Mori Extension"),
                // Don't create the menu?
                true,
            );
            // Obtain and unpack the settings
            this.#settings = getSettings();
            const settingsValues = unpackSettings(this.#settings);
            // Save the end date
            this.#end = Indicator.getEndDate(settingsValues);
            // Add the label
            this.#label = new Label({
                text: Indicator.getText(settingsValues, this.#end),
                yAlign: ActorAlign.CENTER,
            });
            this.add_child(this.#label);
        }
        // Update the indicator
        update() {
            // Unpack the settings
            const settingsValues = unpackSettings(this.#settings);
            // Update the fields
            this.#end = Indicator.getEndDate(settingsValues);
            this.#label.text = Indicator.getText(settingsValues, this.#end);
        }
        // Get the text for the label
        static getText(settingsValues: SettingsValues, end: Date): string {
            // Get the current date
            const start = new Date();
            // Get each part of the time stamp
            const years = Math.max(0, differenceInYears(end, start));
            const months = Math.max(0, differenceInMonths(end, start));
            const weeks = Math.max(0, differenceInWeeks(end, start));
            const days = Math.max(0, differenceInDays(end, start));
            const hours = Math.max(0, differenceInHours(end, start));
            const minutes = Math.max(0, differenceInMinutes(end, start));
            const seconds = Math.max(0, differenceInSeconds(end, start));
            // Return the formatted string
            return settingsValues.formatString
                .replace("${y}", `${years}`)
                .replace("${M}", `${months}`)
                .replace("${w}", `${weeks}`)
                .replace("${d}", `${days}`)
                .replace("${h}", `${hours}`)
                .replace("${m}", `${minutes}`)
                .replace("${s}", `${seconds}`);
        }
        // Get the date of expected passing away
        static getEndDate(settingsValues: SettingsValues): Date {
            // Construct and return the date
            return add(
                new Date(
                    settingsValues.birthYear,
                    settingsValues.birthMonth - 1,
                    settingsValues.birthDay,
                ),
                {
                    years: settingsValues.lifeExpectancy,
                },
            );
        }
    },
);

// Extension
class Extension {
    // UUID of the extension
    readonly #uuid: string;
    // Settings
    #settings: Gio.Settings | null = null;
    // Signals
    #signals: number[] = [];
    // Extension position
    #extensionPosition: "left" | "center" | "right" | null = null;
    // Extension index
    #extensionIndex: number | null = null;
    // Indicator
    #indicator: any;
    // Timeout source
    #timeout: number | null = null;
    // Construct the extension
    constructor(uuid: string) {
        this.#uuid = uuid;
    }
    // Enable the extension
    enable() {
        // Try to obtain the settings
        this.#settings = getSettings();
        // If that's successful
        if (this.#settings) {
            // Get the extensions position
            this.#extensionPosition = Extension.getExtensionPosition(
                this.#settings,
            );
            // Get the extension index
            this.#extensionIndex = this.#settings.get_int("extension-index");
            // Add the indicator
            this.addIndicator();
            // Update the indicator on any change to counter settings
            for (const key of [
                "format-string",
                "birth-year",
                "birth-month",
                "birth-day",
                "life-expectancy",
            ]) {
                const handlerId = this.#settings.connect(
                    `changed::${key}`,
                    () => {
                        this.#indicator.update();
                    },
                );
                this.#signals.push(handlerId);
            }
            // Recreate the indicator in case the extension position is changed
            {
                const handlerId = this.#settings.connect(
                    "changed::extension-position",
                    () => {
                        if (this.#settings) {
                            this.#extensionPosition =
                                Extension.getExtensionPosition(this.#settings);
                            this.removeIndicator();
                            this.addIndicator();
                        }
                    },
                );
                this.#signals.push(handlerId);
            }
            // Recreate the indicator in case the extension index is changed
            {
                const handlerId = this.#settings.connect(
                    "changed::extension-index",
                    () => {
                        if (this.#settings) {
                            this.#extensionIndex =
                                this.#settings.get_int("extension-index");
                            this.removeIndicator();
                            this.addIndicator();
                        }
                    },
                );
                this.#signals.push(handlerId);
            }
        }
    }
    // Add the indicator to the panel
    addIndicator() {
        // Initialize a new indicator
        this.#indicator = new Indicator();
        // If the extension index and extension position are defined
        if (this.#extensionIndex != null && this.#extensionPosition) {
            // Add the indicator to the panel
            Main.panel.addToStatusArea(
                // Role
                this.#uuid,
                // Indicator
                this.#indicator,
                // Index
                this.#extensionIndex,
                // Position
                this.#extensionPosition,
            );
        }
        // Update the indicator every second
        this.#timeout = Mainloop.timeout_add_seconds(1, () => {
            // Update the indicator
            this.#indicator.update();
            // Leave the source in the main loop
            return GLib.SOURCE_CONTINUE;
        });
    }
    // Remove the indicator from the panel
    removeIndicator() {
        // If the timeout is set
        if (this.#timeout) {
            // Remove the timeout
            Mainloop.source_remove(this.#timeout);
            this.#timeout = null;
        }
        // If the indicator exists
        if (this.#indicator) {
            // Free the GObject
            this.#indicator.destroy();
            // Stop tracing it
            this.#indicator = null;
        }
    }
    // Disable the extension
    disable() {
        // Reset the default values of some fields
        this.#extensionPosition = null;
        this.#extensionIndex = null;
        // If there are connected signals, disconnect them
        if (this.#settings) {
            for (const handlerId of this.#signals) {
                this.#settings.disconnect(handlerId);
            }
            this.#settings = null;
        }
        this.#signals = [];
        // Remove the indicator
        this.removeIndicator();
    }
    // Get the extension position from the settings
    static getExtensionPosition(settings: Gio.Settings) {
        switch (settings.get_enum("extension-position")) {
            case 0:
                return "left";
            case 1:
                return "center";
            case 2:
                return "right";
            default:
                return "right";
        }
    }
}

// Initialize the extension
export default function init(meta: { uuid: string }): Extension {
    // Initialize translations
    initTranslations(meta.uuid);
    // Construct and return the extension
    return new Extension(meta.uuid);
}
