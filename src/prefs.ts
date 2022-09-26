/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Adw from "@gi-types/adw1";
import GLib from "@gi-types/glib2";
import Gio from "@gi-types/gio2";
import Gtk from "@gi-types/gtk4";
import dedent from "ts-dedent";

import { unpackSettings, formatBirthday } from "utils";

const { getSettings } = imports.misc.extensionUtils;

function fillPreferencesWindow(window: Adw.PreferencesWindow) {
    // Unpack the settings
    const settings: Gio.Settings = getSettings();
    const settingsValues = unpackSettings(settings);
    // Add the page to the window
    const preferencesPage = new Adw.PreferencesPage();
    window.add(preferencesPage);
    // Add the counter group of preferences to the page
    const counterGroup = new Adw.PreferencesGroup({
        title: "Counter",
    });
    preferencesPage.add(counterGroup);
    // Add an action row for the format string
    const formatStringActionRow = new Adw.ActionRow({
        title: "Format string",
        subtitle: "Hover over the entry to get more info",
    });
    counterGroup.add(formatStringActionRow);
    // Prepare an entry buffer for the next entry
    const formatStringEntryBuffer = new Gtk.EntryBuffer();
    // Connect the entry buffer with the settings
    settings.bind(
        "format-string",
        formatStringEntryBuffer,
        "text",
        Gio.SettingsBindFlags.DEFAULT,
    );
    // Add an entry for the last action row
    const formatStringEntry = new Gtk.Entry({
        buffer: formatStringEntryBuffer,
        margin_top: 10,
        margin_bottom: 10,
        placeholder_text: "${w} weeks remaining",
        tooltip_text: dedent`
        Available modifiers for representing
        total number of <blank> remaining:
          - \${y}: Years
          - \${M}: Months
          - \${w}: Weeks
          - \${d}: Days
          - \${h}: Hours
          - \${m}: Minutes
          - \${s}: Seconds
        `,
    });
    formatStringActionRow.add_suffix(formatStringEntry);
    formatStringActionRow.set_activatable_widget(formatStringEntry);
    // Add an action row for the birthday
    const birthdayActionRow = new Adw.ActionRow({
        title: "Birthday",
        subtitle: "Your birthday in the form YYYY/MM/DD",
    });
    counterGroup.add(birthdayActionRow);
    // Add a menu button to the last action row
    const birthdayButton = new Gtk.MenuButton({
        label: formatBirthday(
            settingsValues.birthYear,
            settingsValues.birthMonth,
            settingsValues.birthDay,
        ),
        margin_top: 10,
        margin_bottom: 10,
    });
    birthdayActionRow.add_suffix(birthdayButton);
    birthdayActionRow.set_activatable_widget(birthdayButton);
    // Add a popover menu for the last button
    const birthdayPopover = new Gtk.Popover();
    birthdayButton.set_popover(birthdayPopover);
    // Add a calendar to the popover menu
    const birthdayCalendar = new Gtk.Calendar();
    birthdayCalendar.select_day(
        GLib.DateTime.new_local(
            settingsValues.birthYear,
            settingsValues.birthMonth,
            settingsValues.birthDay,
            0,
            0,
            0,
        ),
    );
    birthdayPopover.set_child(birthdayCalendar);
    // Synchronise the settings with the calendar
    function syncSettings(calendar: Gtk.Calendar) {
        // Unpack the values from the calendar
        const year = calendar.year;
        const month = calendar.month + 1;
        const day = calendar.day;
        // Update the label of the menu button
        birthdayButton.set_label(formatBirthday(year, month, day));
        // Update the settings
        settings.set_int("birth-year", year);
        settings.set_int("birth-month", month);
        settings.set_int("birth-day", day);
    }
    birthdayCalendar.connect("day-selected", (c) => syncSettings(c));
    birthdayCalendar.connect("prev-year", (c) => syncSettings(c));
    birthdayCalendar.connect("next-year", (c) => syncSettings(c));
    birthdayCalendar.connect("prev-month", (c) => syncSettings(c));
    birthdayCalendar.connect("next-month", (c) => syncSettings(c));
    // Add an action row for the life expectancy
    const lifeExpectancyActionRow = new Adw.ActionRow({
        title: "Life expectancy",
        subtitle: "Number of years you expect to live through",
    });
    counterGroup.add(lifeExpectancyActionRow);
    // Add a spin button to the last action row
    const lifeExpectancySpinButton = new Gtk.SpinButton({
        adjustment: new Gtk.Adjustment({
            lower: 0,
            upper: 200,
            step_increment: 1,
        }),
        numeric: true,
        margin_top: 10,
        margin_bottom: 10,
    });
    lifeExpectancyActionRow.add_suffix(lifeExpectancySpinButton);
    lifeExpectancyActionRow.set_activatable_widget(lifeExpectancySpinButton);
    // Connect the spin button with the settings
    settings.bind(
        "life-expectancy",
        lifeExpectancySpinButton,
        "value",
        Gio.SettingsBindFlags.DEFAULT,
    );
    // Add the appearance group of preferences to the page
    const appearanceGroup = new Adw.PreferencesGroup({
        title: "Appearance",
    });
    preferencesPage.add(appearanceGroup);
    // Prepare a string list for the next combo row
    const extensionPositionOptions = new Gtk.StringList();
    extensionPositionOptions.append("Left");
    extensionPositionOptions.append("Center");
    extensionPositionOptions.append("Right");
    // Add a combo row for the extension position
    const extensionPositionComboRow = new Adw.ComboRow({
        title: "Extension position",
        subtitle: "Position of the extension in the panel",
        model: extensionPositionOptions,
        selected: settingsValues.extensionPosition,
    });
    // Connect the combo row with the settings
    extensionPositionComboRow.connect(
        "notify::selected",
        (cr: Adw.ComboRow) => {
            settings.set_enum("extension-position", cr.selected);
        },
    );
    appearanceGroup.add(extensionPositionComboRow);
    // Add an action row for the extension index
    const extensionIndexActionRow = new Adw.ActionRow({
        title: "Extension index",
        subtitle: "Index of the extension in the panel",
    });
    appearanceGroup.add(extensionIndexActionRow);
    // Add a spin button to the last action row
    const extensionIndexSpinButton = new Gtk.SpinButton({
        adjustment: new Gtk.Adjustment({
            lower: 0,
            upper: 10,
            step_increment: 1,
        }),
        numeric: true,
        margin_top: 10,
        margin_bottom: 10,
    });
    extensionIndexActionRow.add_suffix(extensionIndexSpinButton);
    extensionIndexActionRow.set_activatable_widget(extensionIndexSpinButton);
    // Connect the spin button with the settings
    settings.bind(
        "extension-index",
        extensionIndexSpinButton,
        "value",
        Gio.SettingsBindFlags.DEFAULT,
    );
}

// Initialize the preferences
function init() {
    // The localization initialization will go here
}

export default { init, fillPreferencesWindow };
