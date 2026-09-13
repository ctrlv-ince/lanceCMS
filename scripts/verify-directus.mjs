import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { parseEnv } from "node:util";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = parseEnv(fs.readFileSync(path.join(root, "cms/.env"), "utf8"));
const reader = parseEnv(
  fs.readFileSync(path.join(root, "backend/.env"), "utf8"),
);
const cms = "http://127.0.0.1:8055";
const api = "http://127.0.0.1:3030/api";
const frontend = "http://127.0.0.1:4200";
async function json(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(10000),
  });
  assert.ok(response.ok, `${url} returned ${response.status}`);
  return response.status === 204 ? undefined : response.json();
}
const health = await json(api + "/health");
assert.equal(health.status, "ok");
assert.equal(health.backend, "Feathers Core");
assert.equal(health.database, "PostgreSQL");
assert.equal(health.databaseName, "directus_learning");
assert.equal(health.directus, "connected");
console.log("PASS: Feathers, PostgreSQL, and Directus are connected.");
const page = await fetch(frontend);
assert.ok(page.ok);
assert.match(await page.text(), /<app-root/);
const courses = await json(frontend + "/api/courses");
assert.ok(courses.length >= 3);
for (const slug of ["microprocessor-history", "sap-1", "sap-2"]) {
  const course = await json(frontend + "/api/courses/" + slug);
  assert.equal(course.slug, slug);
  assert.ok(course.body.length > 100);
}
console.log(
  "PASS: Angular serves the app and proxies all three courses through Feathers.",
);
const presentations = JSON.parse(
  fs.readFileSync(
    path.join(root, "scripts/data/directus-presentations.json"),
    "utf8",
  ),
).presentations;
for (const presentation of presentations) {
  const course = await json(frontend + "/api/courses/" + presentation.slug);
  assert.equal(course.presentation_title, presentation.title);
  assert.equal(course.presentation_drive_id, presentation.driveId);
}
console.log(
  "PASS: All three PowerPoint files are mapped to the correct topic frames.",
);
const login = await json(cms + "/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
  }),
});
const headers = {
  Authorization: "Bearer " + login.data.access_token,
  "Content-Type": "application/json",
};
const require = createRequire(path.join(root, "cms/package.json"));
const { Client } = require("pg");
const db = new Client({
  host: reader.DB_HOST,
  port: Number(reader.DB_PORT),
  database: reader.DB_DATABASE,
  user: reader.DB_USER,
  password: reader.DB_PASSWORD,
});
await db.connect();
const slug = "stack-verification-" + crypto.randomBytes(6).toString("hex");
let created;
try {
  created = (
    await json(cms + "/items/courses", {
      method: "POST",
      headers,
      body: JSON.stringify({
        slug,
        title: "Temporary integration verification",
        description: "Removed automatically after verification.",
        body: "Verified Directus → PostgreSQL → Feathers → Angular.",
        published: false,
        sort: 999,
      }),
    })
  ).data;
  assert.equal((await fetch(api + "/courses/" + slug)).status, 404);
  assert.ok(!(await json(api + "/courses")).some((c) => c.slug === slug));
  await json(cms + "/items/courses/" + created.id, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      published: true,
      title: "Verified shared database",
    }),
  });
  const published = await json(frontend + "/api/courses/" + slug);
  const stored = (
    await db.query("SELECT title FROM courses WHERE id=$1", [created.id])
  ).rows[0];
  assert.equal(published.title, "Verified shared database");
  assert.equal(stored.title, published.title);
  console.log(
    "PASS: A Directus publish is stored in PostgreSQL and immediately visible through the Angular API proxy.",
  );
  await json(cms + "/items/courses/" + created.id, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ published: false }),
  });
  assert.equal((await fetch(frontend + "/api/courses/" + slug)).status, 404);
  await assert.rejects(
    db.query("SELECT id FROM directus_users LIMIT 1"),
    (e) => e.code === "42501",
  );
  await assert.rejects(
    db.query("UPDATE courses SET title=title WHERE false"),
    (e) => e.code === "42501",
  );
  assert.equal(
    (
      await fetch(api + "/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      })
    ).status,
    405,
  );
  console.log(
    "PASS: Draft courses stay hidden; the Feathers database role cannot read admin users or edit content.",
  );
} finally {
  if (created)
    await json(cms + "/items/courses/" + created.id, {
      method: "DELETE",
      headers,
    });
  await db.end();
}
assert.equal((await fetch(api + "/courses/" + slug)).status, 404);
console.log(
  "PASS: Temporary verification content removed. All integration checks passed.",
);
