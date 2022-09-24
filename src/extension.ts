/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import GLib from "@gi-types/glib2";
import GObject from "@gi-types/gobject2";
import { ActorAlign } from "@gi-types/clutter10";
import { Label } from "@gi-types/st1";
import {
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInMonths,
    differenceInSeconds,
    differenceInWeeks,
    differenceInYears,
} from "date-fns";

const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const { Button } = imports.ui.panelMenu;

// Indicator
const Indicator = GObject.registerClass(
    class Indicator extends Button {
        // Label
        #label: Label;
        // Construct the indicator
        constructor() {
            // Initialize the button
            super(
                // Menu alignment
                0,
                // Name of the button
                "Momento Mori Extension",
                // Don't create the menu?
                true,
            );
            // Add the label
            this.#label = new Label({
                text: Indicator.getText(),
                yAlign: ActorAlign.CENTER,
            });
            this.add_child(this.#label);
        }
        // Update the indicator
        update() {
            this.#label.text = Indicator.getText();
        }
        // Get the text for the label
        static getText(): string {
            // Define the format string
            const format = "${w} full weeks left";
            // Get the start date
            const start = new Date();
            // Get the end date
            const end = new Date(1992 + 80, 0, 1);
            // Get each part of the time stamp
            const years = differenceInYears(end, start);
            const months = differenceInMonths(end, start);
            const weeks = differenceInWeeks(end, start);
            const days = differenceInDays(end, start);
            const hours = differenceInHours(end, start);
            const minutes = differenceInMinutes(end, start);
            const seconds = differenceInSeconds(end, start);
            // Return the formatted string
            return format
                .replace("${y}", `${years}`)
                .replace("${M}", `${months}`)
                .replace("${w}", `${weeks}`)
                .replace("${d}", `${days}`)
                .replace("${h}", `${hours}`)
                .replace("${m}", `${minutes}`)
                .replace("${s}", `${seconds}`);
        }
    },
);

// Extension
class Extension {
    // UUID of the extension
    readonly #uuid: string;
    // Indicator
    #indicator: any;
    // Timeout source
    #timeout = 0;
    // Construct the extension
    constructor(uuid: string) {
        this.#uuid = uuid;
    }
    // Enable the extension
    enable() {
        // Initialize a new indicator
        this.#indicator = new Indicator();
        // Add the indicator to the panel
        Main.panel.addToStatusArea(
            // Role
            this.#uuid,
            // Indicator
            this.#indicator,
            // Index
            0,
            // Position
            "left",
        );
        // Update the indicator every second
        this.#timeout = Mainloop.timeout_add_seconds(1, () => {
            // Update the indicator
            this.#indicator.update();
            // Leave the source in the main loop
            return GLib.SOURCE_CONTINUE;
        });
    }
    // Disable the extension
    disable() {
        // If the timeout is set
        if (this.#timeout) {
            // Remove the timeout
            Mainloop.source_remove(this.#timeout);
        }
        // If the indicator exists
        if (this.#indicator) {
            // Free the GObject
            this.#indicator.destroy();
            // Stop tracing it
            this.#indicator = null;
        }
    }
}

// Initialize the extension
export default function init(meta: { uuid: string }): Extension {
    // Construct and return the extension
    return new Extension(meta.uuid);
}
