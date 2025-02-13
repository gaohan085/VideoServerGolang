//eslint.config.js
import react from "eslint-plugin-react";
import eslintjs from "@eslint/js";
const { configs } = eslintjs;
import importPlugin from "eslint-plugin-import";
import tsParser from "@typescript-eslint/parser";
import { configs as _configs } from "typescript-eslint";
import globals from "globals";
const { browser } = globals;

import stylistic from "@stylistic/eslint-plugin";
import { cwd } from "process";
import reactRefresh from "eslint-plugin-react-refresh";


export default [
  eslintjs.configs.recommended,
  configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  ..._configs.recommendedTypeChecked,
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
      "webpack.config.js",
      "vite.config.js",
      "prettier.config.js",
      "eslint.config.js"
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    plugins: {
      react: react,
      "react-refresh": reactRefresh,
    },
    ignores: ["eslint.config.js"],
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
        ...browser,
      },
    },
    rules: {
      "complexity": ["error", 10],
      'no-unused-vars': 'warn',
      "import/default": 0,
      "import/no-default-export": 0,
      'import/no-dynamic-require': 'warn',
      'import/no-nodejs-modules': 'warn',
      'import/prefer-default-export': "warn",
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
];