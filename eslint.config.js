//eslint.config.js
import react from "eslint-plugin-react";
import eslintjs from "@eslint/js";
const { configs } = eslintjs;
import { flatConfigs } from "eslint-plugin-import-x";
import tsParser from "@typescript-eslint/parser";
import { configs as _configs } from "typescript-eslint";
import globals from "globals";
const { browser } = globals;

import stylistic from "@stylistic/eslint-plugin";
import { cwd } from "process";


export default [
  configs.recommended,
  flatConfigs.recommended,
  flatConfigs.typescript,
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
      "quotes": [
        "warn",
        "double"
      ],

      "no-unused-vars": "warn",
      "no-unused-expressions": "off",
      "no-case-declarations": "off",

      "import-x/no-dynamic-require": "warn",
      "import-x/no-nodejs-modules": "warn",
      "import-x/no-default-export": 1,
      "import-x/default": 0,
      "import-x/order": [
        "error",
        {
          "groups": [
            "builtin",
            "external",
            "parent",
            "sibling",
            "index",
            "object",
            "type"
          ],
          "newlines-between": "never"
        }
      ],
      "import-x/no-cycle": [
        0,
        {
          "ignoreExternal": true
        }
      ],
      "import-x/default": 0,
      "import-x/no-default-export": 0,

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