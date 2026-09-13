import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = parseEnv(fs.readFileSync(path.join(root, "cms/.env"), "utf8"));
const catalog = JSON.parse(
  fs.readFileSync(
    path.join(root, "scripts/data/directus-presentations.json"),
    "utf8",
  ),
);
const base = "http://127.0.0.1:8055";
const response = await fetch(base + "/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
  }),
});
if (!response.ok)
  throw Error("Could not sign in to Directus to import presentations.");
const token = (await response.json()).data.access_token;
async function api(route, method = "GET", body) {
  const result = await fetch(base + route, {
    method,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!result.ok)
    throw Error(
      `Directus ${method} ${route}: ${result.status} ${(await result.text()).slice(0, 300)}`,
    );
  return result.status === 204 ? undefined : (await result.json()).data;
}
const fields = await api("/fields/courses");
for (const field of [
  {
    field: "presentation_title",
    type: "string",
    meta: {
      interface: "input",
      note: "Original PowerPoint filename shown on the topic card and viewer.",
    },
    schema: { is_nullable: true },
  },
  {
    field: "presentation_drive_id",
    type: "string",
    meta: {
      interface: "input",
      note: "Google Drive file ID only, between /d/ and /view in the shared file link. The file must be shared with your students.",
    },
    schema: { is_nullable: true },
  },
]) {
  if (!fields.some((f) => f.field === field.field))
    await api("/fields/courses", "POST", field);
}
for (const item of catalog.presentations) {
  if (!/^[A-Za-z0-9_-]{10,200}$/.test(item.driveId))
    throw Error("Invalid Drive file ID in catalog.");
  const matches = await api(
    "/items/courses?filter[slug][_eq]=" + encodeURIComponent(item.slug),
  );
  if (matches.length !== 1)
    throw Error("Expected exactly one topic for " + item.slug);
  const course = matches[0];
  // Normal startup fills missing links but preserves later edits made in Directus.
  if (course.presentation_drive_id && !process.argv.includes("--overwrite")) {
    console.log("Preserved presentation for " + course.title);
    continue;
  }
  await api("/items/courses/" + course.id, "PATCH", {
    presentation_title: item.title,
    presentation_drive_id: item.driveId,
  });
  console.log(course.title + " -> " + item.title);
}
