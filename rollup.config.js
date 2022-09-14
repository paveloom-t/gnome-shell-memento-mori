import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import cleanup from "rollup-plugin-cleanup";

const buildPath = "dist";

const globals = {
    "@gi-types/gobject2": "imports.gi.GObject",
    "@gi-types/st1": "imports.gi.St",
};

const external = Object.keys(globals);

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
            commonjs(),
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
];
