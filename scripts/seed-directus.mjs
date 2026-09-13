import fs from "node:fs";
import path from "node:path";
import { parseEnv } from "node:util";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = parseEnv(fs.readFileSync(path.join(root, "cms/.env"), "utf8"));
const base = "http://127.0.0.1:8055";
const login = await fetch(base + "/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
  }),
});
if (!login.ok) throw Error("Directus admin sign-in failed during setup.");
const token = (await login.json()).data.access_token;
async function api(url, method = "GET", body) {
  const response = await fetch(base + url, {
    method,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok)
    throw Error(
      "Directus " +
        method +
        " " +
        url +
        " failed (" +
        response.status +
        "): " +
        (await response.text()).slice(0, 400),
    );
  return response.status === 204 ? undefined : (await response.json()).data;
}
const collections = await api("/collections");
if (!collections.some((c) => c.collection === "courses")) {
  const field = (name, type, ui = "input", extra = {}) => ({
    field: name,
    type,
    meta: { interface: ui, ...extra },
    schema: { is_nullable: true },
  });
  await api("/collections", "POST", {
    collection: "courses",
    meta: {
      icon: "school",
      note: "Courses served by the Feathers API to the Angular learning platform.",
      display_template: "{{title}}",
      sort_field: "sort",
    },
    schema: {},
    fields: [
      {
        field: "id",
        type: "integer",
        meta: { hidden: true, readonly: true, interface: "input" },
        schema: {
          is_primary_key: true,
          has_auto_increment: true,
          is_nullable: false,
        },
      },
      {
        ...field("slug", "string"),
        schema: { is_nullable: false, is_unique: true },
      },
      { ...field("title", "string"), schema: { is_nullable: false } },
      field("category", "string"),
      field("level", "string", "select-dropdown", {
        options: {
          choices: [
            { text: "Beginner", value: "Beginner" },
            { text: "Intermediate", value: "Intermediate" },
            { text: "Advanced", value: "Advanced" },
          ],
        },
      }),
      field("description", "text", "input-multiline"),
      field("body", "text", "input-multiline", {
        note: "Plain-text course content. Separate paragraphs with blank lines.",
      }),
      field("objectives", "json", "list", {
        options: {
          fields: [
            {
              field: "text",
              name: "Learning objective",
              type: "string",
              meta: { interface: "input" },
            },
          ],
        },
      }),
      {
        field: "published",
        type: "boolean",
        meta: {
          interface: "boolean",
          note: "Only published courses are visible in the Angular app.",
        },
        schema: { default_value: false, is_nullable: false },
      },
      {
        field: "sort",
        type: "integer",
        meta: { interface: "input" },
        schema: { default_value: 0, is_nullable: false },
      },
    ],
  });
}
const starter = [
  {
    slug: "microprocessor-history",
    title: "Microprocessor History",
    category: "Computer architecture",
    level: "Beginner",
    description:
      "Explore how the CPU evolved from early integrated circuits into the processors that power modern computers.",
    sort: 1,
    published: true,
    objectives: [
      { text: "Explain what a microprocessor does" },
      {
        text: "Recognize the shift from discrete components to integrated CPUs",
      },
      { text: "Connect processor design to embedded applications" },
    ],
    body: "A microprocessor implements the central processing unit of a computer on an integrated circuit. It fetches instructions, interprets them, performs arithmetic or logic, and coordinates the movement of data.\n\nEarly computers used many separate components to perform these tasks. Integrating more functions into semiconductor chips made smaller and more affordable computer systems possible. Later designs expanded word sizes, addressable memory, and the range of instructions.\n\nMicroprocessors and microcontrollers serve different system designs. A microprocessor typically relies on external memory and peripherals, while a microcontroller integrates a processor, memory, and common peripherals for dedicated control tasks.\n\nPractice: choose one desktop computer and one embedded device. Identify the role of the processor, the memory it uses, and the input and output devices it controls.",
  },
  {
    slug: "sap-1",
    title: "SAP 1 · The Building Blocks",
    category: "Digital systems",
    level: "Beginner",
    description:
      "Understand a simple computer through its registers, shared bus, arithmetic unit, and instruction cycle.",
    sort: 2,
    published: true,
    objectives: [
      { text: "Identify the datapath and control unit" },
      { text: "Trace data between registers and memory" },
      { text: "Describe fetch, decode, and execute" },
    ],
    body: "A simple educational computer makes the relationship between data and control visible. Registers hold values, a bus moves them between components, and control signals decide when each transfer takes place.\n\nThe program counter identifies the next instruction. The instruction register stores the current instruction. An accumulator holds an operand or a result, while the arithmetic unit performs supported operations. Memory stores the program and its data.\n\nDuring fetch, the computer reads an instruction from memory. During decode, the control unit determines the necessary actions. During execution, it activates the appropriate register transfers and arithmetic operations.\n\nPractice: draw a block diagram showing a program counter, memory, instruction register, accumulator, arithmetic unit, and output register. Trace the movement of data for a load followed by an addition.",
  },
  {
    slug: "sap-2",
    title: "SAP 2 · Beyond the Basics",
    category: "Digital systems",
    level: "Intermediate",
    description:
      "Extend your understanding of a simple computer with richer control flow and more flexible operations.",
    sort: 3,
    published: true,
    objectives: [
      { text: "Explain why richer instruction sets are useful" },
      { text: "Trace conditional program flow" },
      { text: "Relate flags and control signals to program behavior" },
    ],
    body: "More capable educational computer designs extend a basic datapath with additional instructions and control mechanisms. These extensions allow programs to do more than follow a fixed sequence of arithmetic operations.\n\nConditional branches allow a processor to select a different next instruction based on a condition. Status information, such as whether an arithmetic result is zero, can influence the choice. Additional registers and transfer operations give programs more ways to manage intermediate values.\n\nA useful way to study any design is to trace one instruction at a time. Record the program counter, affected registers, memory operations, and relevant status flags after each step. Use your lecture reference for the exact instruction set and register names.\n\nPractice: describe a short loop in pseudocode that repeatedly subtracts one from a value until it reaches zero. Identify the arithmetic operation, the condition, and the branch needed to implement it.",
  },
];
for (const course of starter) {
  const found = await api(
    "/items/courses?filter[slug][_eq]=" + encodeURIComponent(course.slug),
  );
  if (!found.length) await api("/items/courses", "POST", course);
}
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
try {
  await db.query("GRANT SELECT ON courses TO learning_reader");
} finally {
  await db.end();
}
console.log(
  "Directus course collection is ready. Existing content was preserved.",
);
await import("./import-directus-presentations.mjs");
