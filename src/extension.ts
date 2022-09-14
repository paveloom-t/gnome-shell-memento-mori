/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import GObject from "@gi-types/gobject2";
import { Icon } from "@gi-types/st1";

const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const { Button } = imports.ui.panelMenu;
const { PopupMenuItem } = imports.ui.popupMenu;

const Indicator = GObject.registerClass(
    class Indicator extends Button {
        _init() {
            super._init(0.0, "Momento Mori Extension");

            this.add_child(
                new Icon({
                    icon_name: "face-smile-symbolic",
                    style_class: "system-status-icon",
                }),
            );

            const item = new PopupMenuItem("Greet!");
            item.connect("activate", () => {
                Main.notify("Hello there!");
            });
            this.menu.addMenuItem(item);
        }
    },
);

class Extension {
    private indicator: any;
    // Enable the extension
    enable() {
        this.indicator = new Indicator();
        const uuid = ExtensionUtils.getCurrentExtension().metadata.uuid;
        Main.panel.addToStatusArea(uuid, this.indicator);
    }
    // Disable the extension
    disable() {
        if (this.indicator) {
            this.indicator.destroy();
            this.indicator = null;
        }
    }
}

export default function (): Extension {
    return new Extension();
}
