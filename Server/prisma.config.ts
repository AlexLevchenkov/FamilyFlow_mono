import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const dbUrl =
  env("NODE_ENV") === "test" ? env("TEST_DATABASE_URL") : env("DATABASE_URL");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations_pg",
  },
  datasource: {
    url: dbUrl,
  },
});
