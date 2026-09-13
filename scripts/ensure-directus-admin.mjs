import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseEnv } from "node:util";
import { createRequire } from "node:module";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = parseEnv(fs.readFileSync(path.join(root, "cms/.env"), "utf8"));
const require = createRequire(path.join(root, "cms/package.json"));
const { Client } = require("pg");
const db = new Client({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  database: env.DB_DATABASE,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
});
await db.connect();
let role;
try {
  if ((await db.query("SELECT 1 FROM directus_users LIMIT 1")).rowCount) {
    console.log("Existing Directus users preserved.");
    await db.end();
    process.exit(0);
  }
  role = (
    await db.query(
      "SELECT a.role FROM directus_access a JOIN directus_policies p ON p.id=a.policy WHERE p.admin_access=true AND a.role IS NOT NULL LIMIT 1",
    )
  ).rows[0]?.role;
} finally {
  await db.end();
}
if (!role)
  throw Error(
    "No administrator role exists. Complete Directus bootstrap first.",
  );
process.chdir(path.join(root, "cms"));
// Use Directus itself to validate and hash the initial account; never write password hashes manually.
const { default: createUser } = await import(
  pathToFileURL(
    path.join(
      root,
      "cms/node_modules/@directus/api/dist/cli/commands/users/create.js",
    ),
  ).href
);
await createUser({
  email: env.ADMIN_EMAIL,
  password: env.ADMIN_PASSWORD,
  role,
});
