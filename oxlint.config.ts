import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "error",
  },
  "options": {
    "typeAware": true,
    "typeCheck": true,
  },
  plugins: ["react", "react-perf", "eslint", "typescript", "import"],
  jsPlugins: ["@stylistic/eslint-plugin"],
  rules: {
    "@stylistic/indent": ["error", 2],
    "@stylistic/semi": ["error", "always"],
    "@stylistic/space-before-blocks": ["error", "always"],

    "no-unused-expressions": ["error", {
      allowShortCircuit: true,
    }],
    "react/no-children-prop": "off",
    "typescript/no-floating-promises": "error",
    "typescript/no-misused-promises": "error",
  },
  ignorePatterns: [
    "eslint.config.js",
  ]
});
