/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as fillPotPo from "fill-pot-po";
import fs from "fs";
import gettextParser from "gettext-parser";
import glob from "glob";
import path from "path";
import type { Element } from "gettext-extractor/dist/html/parser";
import { ElementSelectorSet } from "gettext-extractor/dist/html/selector";
import { GettextExtractor, JsExtractors } from "gettext-extractor";
import { HtmlUtils } from "gettext-extractor/dist/html/utils";

// Define the path to the directory with resources
const RESOURCES_DIR = path.resolve(__dirname, "..", "resources");

// UUID of the extension
const UUID: string = JSON.parse(
    fs.readFileSync(path.resolve(RESOURCES_DIR, "metadata.json")).toString(),
).uuid;

// Path to the directory with the `.po` and `.pot` files
const PO_DIR = path.resolve(RESOURCES_DIR, "po");

// Path to the `.pot` file
const POT_FILE = path.resolve(PO_DIR, `${UUID}.pot`);

// Path to the directory with generated locales
const LOCALE_DIR = path.resolve(__dirname, "..", "dist", "locale");

// Extract translatable strings from the code to a `.pot` file
function extractStrings() {
    // Make sure the output directory exists
    fs.mkdirSync(PO_DIR, { recursive: true });
    // Initialize an extractor
    const extractor = new GettextExtractor();
    // Parse the source files
    extractor
        .createJsParser([
            JsExtractors.callExpression("_", {
                arguments: {
                    text: 0,
                    context: 1,
                },
            }),
            JsExtractors.callExpression("ngettext", {
                arguments: {
                    text: 1,
                    textPlural: 2,
                    context: 3,
                },
            }),
        ])
        .parseFilesGlob("./src/**/*.@(ts|js|tsx|jsx)");
    // Parse the schema file
    extractor
        .createHtmlParser([
            (node, _fileName, addMessage) => {
                const selectors = new ElementSelectorSet("default[l10n]");
                if (typeof (node as Element).tagName !== "string") {
                    return;
                }
                const element = node as Element;
                if (selectors.anyMatch(element)) {
                    const text = HtmlUtils.getElementContent(element, {
                        trimWhiteSpace: true,
                        preserveIndentation: false,
                        replaceNewLines: false,
                    });

                    if (typeof text === "string") {
                        addMessage({ text });
                    }
                }
            },
        ])
        .parseFilesGlob("./resources/schemas/*.gschema.xml");
    // Save the `.pot` file
    extractor.savePotFile(POT_FILE);
    // Print statistics
    extractor.printStats();
}

// Recreate `.po` files for a new `.pot` file,
// preserving already translated strings
function mergeStrings() {
    fillPotPo.sync({
        destDir: PO_DIR,
        logResults: true,
        poSources: [`${PO_DIR}/*.po`],
        potSources: [POT_FILE],
        writeFiles: true,
    });
}

// Compile the `.po` files to `.mo` files
function compileStrings() {
    // Make sure the output directory exists
    fs.mkdirSync(LOCALE_DIR, { recursive: true });
    // Create a glob for `.po` files
    const poFiles = glob.sync(`${PO_DIR}/*.po`);
    // For each `.po` file
    poFiles.forEach((po) => {
        // Get the name of the file
        const locale = path.parse(po).name;
        // Define the path to the locale directory
        const locale_path = `${LOCALE_DIR}/${locale}/LC_MESSAGES`;
        // Get the contents of the file
        const input = fs.readFileSync(po);
        // Parse the contents of the file
        const parsed = gettextParser.po.parse(input);
        // Compile the file to a `.mo` file
        const mo = gettextParser.mo.compile(parsed);
        // Create a locale directory in the output directory
        fs.mkdirSync(locale_path, { recursive: true });
        // Write the `.mo` file
        fs.writeFileSync(`${locale_path}/${UUID}.mo`, mo);
    });
}

// Do all these operations to (re)generate new locales
extractStrings();
mergeStrings();
compileStrings();
