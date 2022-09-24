/* eslint-disable @typescript-eslint/no-explicit-any */

import("@gi-types/glib2").Mainloop;

declare const imports: {
    mainloop: Mainloop;
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
            panel: {
                addToStatusArea: (
                    role,
                    indicator,
                    position: number,
                    box: "left" | "center" | "right",
                ) => indicator;
            };
        };
        panelMenu: any;
    };
};

declare const _: (arg: string) => string;
