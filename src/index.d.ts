declare module "resource://*";

// Note that the older declaration files
// are used for not-yet-available libraries

declare module "gi://Adw" {
    import Adw from "gi://Adw?version=1";
    export default Adw;
}

declare module "gi://Clutter" {
    import Clutter from "gi://Clutter?version=12";
    export default Clutter;
}

declare module "gi://GLib" {
    import GLib from "gi://GLib?version=2.0";
    export default GLib;
}

declare module "gi://GObject" {
    import GObject from "gi://GObject?version=2.0";
    export default GObject;
}

declare module "gi://Gio" {
    import Gio from "gi://Gio?version=2.0";
    export default Gio;
}

declare module "gi://Gtk" {
    import Gtk from "gi://Gtk?version=4.0";
    export default Gtk;
}

declare module "gi://St" {
    import St from "gi://St?version=12";
    export default St;
}
