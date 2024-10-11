//eslint.config.js
const react = require("eslint-plugin-react")
const js = require("@eslint/js")
const eslintPluginImportX = require("eslint-plugin-import-x")
const tsParser = require("@typescript-eslint/parser")
const tseslint = require("typescript-eslint")
const globals = require('globals');
const stylistic = require("@stylistic/eslint-plugin")


module.exports = [
  js.configs.recommended,
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
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
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    plugins: {
      react: react,
    },
    ignores: ['eslint.config.js'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
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
      'no-unused-vars': 'warn',
      'import-x/no-dynamic-require': 'warn',
      'import-x/no-nodejs-modules': 'warn',
      'import-x/no-default-export': 1,
      'import-x/default': 0,
      'import-x/order': [
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
          "newlines-between": "always"
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
      "no-case-declarations": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "import-x/no-cycle": [
        0,
        {
          "ignoreExternal": true
        }
      ],
      "import-x/default": 0,
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
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          "checksVoidReturn": false
        }
      ],
      "@typescript-eslint/no-unsafe-member-access": "warn"
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    plugins:{"@stylistic": stylistic},
    rules:{
      "@stylistic/indent":['error', 2],
      "@stylistic/semi":['error', "always"],
      "@stylistic/space-before-blocks":['error', "always"]
    }
  },
  {
    settings: {
      react: {
        version: "detect"
      }
    }
  }
]