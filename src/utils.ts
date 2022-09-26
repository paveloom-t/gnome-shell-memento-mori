import type Gio from "@gi-types/gio2";

export interface SettingsValues {
    formatString: string;
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    lifeExpectancy: number;
    extensionPosition: number;
    extensionIndex: number;
}

// Unpack the settings
export function unpackSettings(settings: Gio.Settings): SettingsValues {
    return {
        formatString: settings.get_string("format-string"),
        birthYear: settings.get_int("birth-year"),
        birthMonth: settings.get_int("birth-month"),
        birthDay: settings.get_int("birth-day"),
        lifeExpectancy: settings.get_int("life-expectancy"),
        extensionPosition: settings.get_enum("extension-position"),
        extensionIndex: settings.get_int("extension-index"),
    };
}

// Format the birthday as a string
export function formatBirthday(
    year: number,
    month: number,
    day: number,
): string {
    // Convert the month and the day to strings
    const monthString = month < 10 ? `0${month}` : `${month}`;
    const dayString = day < 10 ? `0${day}` : `${day}`;
    // Return the formatted date
    return `${year}/${monthString}/${dayString}`;
}
