import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import { feathers } from "@feathersjs/feathers";
import express, {
  rest,
  json,
  errorHandler,
  notFound,
} from "@feathersjs/express";
import { BadRequest, NotFound } from "@feathersjs/errors";
import pg from "pg";

loadEnvFile(fileURLToPath(new URL("../.env", import.meta.url)));
const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 5,
  connectionTimeoutMillis: 4000,
  idleTimeoutMillis: 30000,
});
const app = express(feathers());
app.disable("x-powered-by");
app.use(json({ limit: "16kb" }));
app.configure(rest());
app.use(
  "/api/health",
  {
    async find() {
      const result = await pool.query(
        "SELECT current_database() AS name, version() AS version",
      );
      let directus = "unavailable";
      try {
        const response = await fetch(
          `${process.env.DIRECTUS_URL}/server/ping`,
          { signal: AbortSignal.timeout(3000) },
        );
        if (response.ok && (await response.text()).includes("pong"))
          directus = "connected";
      } catch {
        /* Report the disconnected component without hiding the database result. */
      }
      return {
        status: directus === "connected" ? "ok" : "degraded",
        application: "directus-learning",
        backend: "Feathers Core",
        database: "PostgreSQL",
        databaseName: result.rows[0].name,
        databaseVersion: result.rows[0].version
          .split(" ")
          .slice(0, 2)
          .join(" "),
        directus,
      };
    },
  },
  { methods: ["find"] },
);
const fields =
  "id, slug, title, category, level, description, body, objectives, sort, presentation_title, presentation_drive_id, to_jsonb(courses)->>'thumbnail' AS thumbnail, to_jsonb(courses)->>'thumbnail_alt' AS thumbnail_alt, to_jsonb(courses)->>'date_created' AS date_created, to_jsonb(courses)->>'date_updated' AS date_updated";
// Optional CMS metadata remains null until these fields are added in Directus.
// Only public image URLs are returned; credentials never leave the backend.
function withThumbnail(row) {
  const { thumbnail, ...course } = row;
  const validId = typeof thumbnail === "string" && /^[a-f0-9-]{36}$/i.test(thumbnail);
  return { ...course, thumbnail_url: validId ? `${process.env.DIRECTUS_URL}/assets/${encodeURIComponent(thumbnail)}?width=800&height=500&fit=cover` : null };
}
app.use(
  "/api/courses",
  {
    async find(params) {
      const search = params.query?.q ?? "";
      if (typeof search !== "string" || search.length > 200)
        throw new BadRequest("Search must be a string of up to 200 characters");
      const result = await pool.query(
        `SELECT ${fields} FROM courses WHERE published = true AND (title ILIKE $1 OR description ILIKE $1 OR presentation_title ILIKE $1) ORDER BY sort, id LIMIT 100`,
        [`%${search}%`],
      );
      return result.rows.map(withThumbnail);
    },
    async get(slug) {
      if (typeof slug !== "string" || !/^[a-z0-9-]{1,120}$/.test(slug))
        throw new BadRequest("Invalid course slug");
      const result = await pool.query(
        `SELECT ${fields} FROM courses WHERE slug = $1 AND published = true`,
        [slug],
      );
      if (!result.rows[0])
        throw new NotFound(
          "This course is unavailable or has not been published",
        );
      return withThumbnail(result.rows[0]);
    },
  },
  { methods: ["find", "get"] },
);
app.use(notFound());
app.use(
  errorHandler({ logger: { error: (err) => console.error(err.message) } }),
);
await pool.query("SELECT 1");
const server = await app.listen(Number(process.env.PORT || 3030), "127.0.0.1");
console.log("Feathers Core listening on http://127.0.0.1:3030");
async function shutdown() {
  server.close();
  await pool.end();
  process.exit(0);
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
