import type { Config } from "drizzle-kit";

import { env } from "~/config/env";

const config: Config = {
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: "postgresql",
  out: "./migrations",
  schema: "./src/infrastructure/persistence/drizzle/schemas.ts",
};

export default config;
