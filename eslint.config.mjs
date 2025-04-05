import typescriptEslint from "@typescript-eslint/eslint-plugin"
import prettier from "eslint-plugin-prettier"
import tsParser from "@typescript-eslint/parser"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  {
    ignores: [
      "**/dist",
      "**/infra",
      "**/.devcontainer-profile",
      "**/.github",
      "**/.vscode",
      "**/bundle",
      "**/bundle-local",
      "**/docs",
      "**/node_modules"
    ]
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier"
  ),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      prettier
    },

    languageOptions: {
      parser: tsParser
    },

    rules: {
      "no-empty-function": "off",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "none"
        }
      ],

      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/dist/"],
              caseSensitive: false,
              message: "DO NOT import from private package folder '/dist'."
            }
          ]
        }
      ]
    }
  }
]
