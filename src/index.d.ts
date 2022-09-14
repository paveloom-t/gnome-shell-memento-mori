/* eslint-disable @typescript-eslint/no-explicit-any */

declare const imports: {
    lang: unknown;
    misc: {
        extensionUtils: {
            initTranslations: (domain: string) => void;
            getCurrentExtension: () => any;
            openPrefs: () => void;
            getSettings: () => any;
        };
        config: any;
    };
    ui: {
        main: {
            notify: (arg: string) => void;
            panel: any;
        };
        panelMenu: any;
        popupMenu: any;
    };
};
