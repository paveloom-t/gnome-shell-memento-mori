declare module "resource://*";

// Use the older declaration files for not-yet-available libraries

declare module "gi://Clutter?version=13" {
    import Clutter from "gi://Clutter?version=12";
    export default Clutter;
}

declare module "gi://St?version=13" {
    import St from "gi://St?version=12";
    export default St;
}
