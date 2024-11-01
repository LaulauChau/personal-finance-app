import { resolve } from "node:path";
import { configDefaults, defineConfig, mergeConfig } from "vitest/config";

export const baseConfig = defineConfig({
  resolve: {
    alias: [{ find: "~", replacement: resolve(__dirname, "src") }],
  },
  test: {
    exclude: [...configDefaults.exclude],
    globals: true,
    passWithNoTests: true,
  },
});

export default mergeConfig(baseConfig, {
  test: {
    files: ["tests/unit/**/*.test.ts"],
  },
});
