import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import reactRefresh from "eslint-plugin-react-refresh"
import reactHooks from "eslint-plugin-react-hooks"
import { cwd } from "process";
import tsParser from "@typescript-eslint/parser";
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from "eslint-plugin-import";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  reactRefresh.configs.recommended,
  reactHooks.configs['recommended-latest'],
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: cwd(),
      },
    },
  },
  {
    ignores: [
      "**/dist/**",
      ".next",
      "**/__test__/**",
      "**/test/**",
      "/coverage/",
      "/coverage-ts/",
      "**/stress-test/**",
      "eslint.config.js",
      "rsbuild.config.ts"
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    plugins: {
      pluginReact,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "complexity": ["error", 10],
      'no-unused-vars': 'warn',
      "import/default": 0,
      "import/no-default-export": 0,
      'import/no-dynamic-require': 'warn',
      'import/no-nodejs-modules': 'warn',
      'import/prefer-default-export': "off",
      'import/default': 0,
      'import/order': [
        "error",
        {
          "groups": [
            "type",
            ["sibling", "parent"],
            "external",
            "index",
            "object",
          ],
          "newlines-between": "never",
        },
      ],
      'import/order': [
        "error",
        {
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": true,
          }
        }
      ],
      "@typescript-eslint/no-unsafe-assignment": "off",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "quotes": [
        "warn",
        "double"
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "vars": "all",
          "args": "after-used",
          "ignoreRestSiblings": false
        }
      ],
      "import/no-cycle": [
        0,
        {
          "ignoreExternal": true
        }
      ],
      'react/react-in-jsx-scope': 0,
      "react/prop-types": 0,
      "react/jsx-no-leaked-render": [
        1,
        {
          "validStrategies": [
            "ternary",
            "coerce"
          ]
        }
      ],
      "react/destructuring-assignment": [
        1,
        "always",
        {
          "ignoreClassFields": false,
          "destructureInSignature": "ignore"
        }
      ],
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "vars": "all",
          "args": "after-used",
          "ignoreRestSiblings": false
        }
      ],

      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          "checksVoidReturn": false
        }
      ],
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'inline-type-imports',
        },
      ],
      "react-refresh/only-export-components": "error",
      "react-refresh/only-export-components": [
        "error",
        { "allowConstantExport": true }
      ],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    plugins: { "@stylistic": stylistic },
    rules: {
      "@stylistic/indent": ["error", 2],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/space-before-blocks": ["error", "always"]
    }
  },
  {
    settings: {
      react: {
        version: "detect"
      }
    }
  }
]);
