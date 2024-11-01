import { mergeConfig } from "vitest/config";

import { baseConfig } from "./vitest.config";

export default mergeConfig(baseConfig, {
  test: {
    files: ["tests/integration/**/*.test.ts"],
  },
});
