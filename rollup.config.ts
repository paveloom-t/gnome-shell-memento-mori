import cleanup from "rollup-plugin-cleanup";
import copy from "rollup-plugin-copy";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const buildPath = "dist";

const globals = {
    "@gi-types/adw1": "imports.gi.Adw",
    "@gi-types/clutter10": "imports.gi.Clutter",
    "@gi-types/gio2": "imports.gi.Gio",
    "@gi-types/glib2": "imports.gi.GLib",
    "@gi-types/gobject2": "imports.gi.GObject",
    "@gi-types/gtk4": "imports.gi.Gtk",
    "@gi-types/st1": "imports.gi.St",
};

const external = Object.keys(globals);

const prefsFooter = [
    "var init = prefs.init;",
    "var fillPreferencesWindow = prefs.fillPreferencesWindow;",
].join("\n");

export default [
    {
        input: "src/extension.ts",
        treeshake: {
            moduleSideEffects: "no-external",
        },
        output: {
            file: `${buildPath}/extension.js`,
            name: "init",
            format: "iife",
            exports: "default",
            globals,
            assetFileNames: "[name][extname]",
        },
        external,
        plugins: [
            nodeResolve({
                preferBuiltins: false,
            }),
            typescript({
                tsconfig: "./tsconfig.json",
            }),
            copy({
                targets: [
                    { src: "./resources/metadata.json", dest: `${buildPath}` },
                    { src: "./resources/schemas", dest: `${buildPath}` },
                ],
            }),
            cleanup({
                comments: "none",
            }),
        ],
    },
    {
        input: "src/prefs.ts",
        treeshake: {
            moduleSideEffects: "no-external",
        },
        output: {
            file: `${buildPath}/prefs.js`,
            name: "prefs",
            format: "iife",
            exports: "default",
            footer: prefsFooter,
            globals,
        },
        external,
        plugins: [
            nodeResolve({
                preferBuiltins: false,
            }),
            typescript({
                tsconfig: "./tsconfig.json",
            }),
            cleanup({
                comments: "none",
            }),
        ],
    },
];
