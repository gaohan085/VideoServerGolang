import { defineConfig } from "oxfmt";

export default defineConfig({
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  sortImports: { newlinesBetween: false },
  ignorePatterns: ["web_src/routeTree.gen.ts"],
});
