import eslint from "@eslint/js";
import pluginTypeScript from "typescript-eslint";
import pluginPrettier from "eslint-plugin-prettier/recommended";

const sources = {
  files: ["**/*.js", "**/*.ts", "**/*.d.ts"],
  ignores: ["node_modules/*", "types/generated/*.d.ts"],
};

export default [
  ...pluginTypeScript.config(
    {
      ...sources,
      extends: [
        eslint.configs.recommended,
        ...pluginTypeScript.configs.strictTypeChecked,
        ...pluginTypeScript.configs.stylisticTypeChecked,
      ],
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/restrict-template-expressions": ["error", { allowBoolean: true }],
      },
      languageOptions: {
        parserOptions: {
          project: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
    {
      files: ["**/*.js"],
      ...pluginTypeScript.configs.disableTypeChecked,
    },
  ),
  {
    ...sources,
    ...pluginPrettier,
    rules: {
      "prettier/prettier": ["error", { printWidth: 120, tabWidth: 2 }],
    },
  },
];
