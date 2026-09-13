import fs from "node:fs";
import path from "node:path";
import net from "node:net";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { createRequire } from "node:module";
import { spawn, execFileSync } from "node:child_process";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const runtime = path.join(root, ".directus-local");
const pgBin = process.env.PG_BIN || "C:/Program Files/PostgreSQL/18/bin";
const cluster = path.join(runtime, "postgres");
const statePath = path.join(runtime, "processes.json");
fs.mkdirSync(runtime, { recursive: true });
const readEnv = (p) => parseEnv(fs.readFileSync(p, "utf8"));
const random = () => crypto.randomBytes(24).toString("hex");
const saveEnv = (p, values) =>
  fs.writeFileSync(
    p,
    Object.entries(values)
      .map(([k, v]) => k + "=" + JSON.stringify(String(v)))
      .join("\n") + "\n",
    { mode: 0o600 },
  );
const run = (file, args, cwd = root, env = process.env) =>
  execFileSync(file, args, { cwd, env, stdio: "inherit", windowsHide: true });
const pgExe = (name) =>
  path.join(pgBin, name + (process.platform === "win32" ? ".exe" : ""));
function configure() {
  const envPath = path.join(root, "cms/.env");
  if (!fs.existsSync(path.join(runtime, ".env"))) {
    if (fs.existsSync(envPath))
      throw Error(
        "cms/.env already exists. Refusing to overwrite existing configuration.",
      );
    saveEnv(path.join(runtime, ".env"), {
      PG_ADMIN_PASSWORD: random(),
      DB_PASSWORD: random(),
      API_DB_PASSWORD: random(),
      ADMIN_PASSWORD: random(),
      SECRET: random(),
    });
  }
  const local = readEnv(path.join(runtime, ".env"));
  if (!fs.existsSync(envPath))
    saveEnv(envPath, {
      HOST: "127.0.0.1",
      PORT: 8055,
      PUBLIC_URL: "http://127.0.0.1:8055",
      SECRET: local.SECRET,
      DB_CLIENT: "pg",
      DB_HOST: "127.0.0.1",
      DB_PORT: 5433,
      DB_DATABASE: "directus_learning",
      DB_USER: "directus_app",
      DB_PASSWORD: local.DB_PASSWORD,
      ADMIN_EMAIL: "admin@example.com",
      ADMIN_PASSWORD: local.ADMIN_PASSWORD,
      PROJECT_NAME: "Directus Learn",
      TELEMETRY: false,
      CORS_ENABLED: true,
      CORS_ORIGIN: "http://127.0.0.1:4200,http://localhost:4200",
      WEBSOCKETS_ENABLED: true,
    });
  if (!fs.existsSync(path.join(root, "backend/.env")))
    saveEnv(path.join(root, "backend/.env"), {
      PORT: 3030,
      DB_HOST: "127.0.0.1",
      DB_PORT: 5433,
      DB_DATABASE: "directus_learning",
      DB_USER: "learning_reader",
      DB_PASSWORD: local.API_DB_PASSWORD,
      DIRECTUS_URL: "http://127.0.0.1:8055",
    });
  return local;
}
function portFree(port) {
  return new Promise((resolve) => {
    const s = net.createServer();
    s.once("error", () => resolve(false));
    s.listen(port, "127.0.0.1", () => s.close(() => resolve(true)));
  });
}
async function database(local) {
  if (!fs.existsSync(pgExe("initdb")))
    throw Error(
      "PostgreSQL binaries not found. Set PG_BIN to the PostgreSQL bin directory.",
    );
  if (!fs.existsSync(path.join(cluster, "PG_VERSION"))) {
    const pw = path.join(runtime, "init-password.tmp");
    fs.writeFileSync(pw, local.PG_ADMIN_PASSWORD, { mode: 0o600 });
    try {
      run(pgExe("initdb"), [
        "-D",
        cluster,
        "-U",
        "directus_cluster",
        "--pwfile=" + pw,
        "--auth=scram-sha-256",
        "--encoding=UTF8",
        "--locale=C",
      ]);
    } finally {
      fs.unlinkSync(pw);
    }
    fs.appendFileSync(
      path.join(cluster, "postgresql.conf"),
      "\nlisten_addresses = '127.0.0.1'\nport = 5433\n",
    );
  }
  let running = false;
  try {
    execFileSync(pgExe("pg_ctl"), ["-D", cluster, "status"], {
      stdio: "ignore",
      windowsHide: true,
    });
    running = true;
  } catch {}
  if (!running) {
    if (!(await portFree(5433)))
      throw Error("Port 5433 is occupied by a different server.");
    run(pgExe("pg_ctl"), [
      "-D",
      cluster,
      "-l",
      path.join(runtime, "postgres.log"),
      "-w",
      "start",
    ]);
  }
  const require = createRequire(path.join(root, "cms/package.json"));
  const { Client } = require("pg");
  const connection = {
    host: "127.0.0.1",
    port: 5433,
    user: "directus_cluster",
    password: local.PG_ADMIN_PASSWORD,
    database: "postgres",
  };
  const admin = new Client(connection);
  await admin.connect();
  const literal = (s) => "'" + s.replaceAll("'", "''") + "'";
  try {
    for (const [name, password] of [
      ["directus_app", local.DB_PASSWORD],
      ["learning_reader", local.API_DB_PASSWORD],
    ]) {
      if (
        !(await admin.query("SELECT 1 FROM pg_roles WHERE rolname=$1", [name]))
          .rowCount
      )
        await admin.query(
          "CREATE ROLE " + name + " LOGIN PASSWORD " + literal(password),
        );
    }
    if (
      !(
        await admin.query(
          "SELECT 1 FROM pg_database WHERE datname='directus_learning'",
        )
      ).rowCount
    )
      await admin.query("CREATE DATABASE directus_learning OWNER directus_app");
  } finally {
    await admin.end();
  }
  const db = new Client({ ...connection, database: "directus_learning" });
  await db.connect();
  try {
    await db.query(
      "GRANT CONNECT ON DATABASE directus_learning TO learning_reader",
    );
    await db.query("GRANT USAGE ON SCHEMA public TO learning_reader");
  } finally {
    await db.end();
  }
}
function state() {
  try {
    return JSON.parse(fs.readFileSync(statePath, "utf8"));
  } catch {
    return {};
  }
}
async function waitFor(url, seconds = 90) {
  const until = Date.now() + seconds * 1000;
  while (Date.now() < until) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(2500) });
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 750));
  }
  throw Error("Timed out waiting for " + url + ". Check .directus-local logs.");
}
async function startService(name, port, entry, args, cwd, url) {
  const current = state();
  if (current[name]) {
    try {
      process.kill(current[name].pid, 0);
      await waitFor(url, 4);
      console.log(name + " is already running.");
      return;
    } catch {}
  }
  if (!(await portFree(port)))
    throw Error(
      "Port " + port + " is occupied. Refusing to replace another process.",
    );
  const out = fs.openSync(path.join(runtime, name + ".log"), "a");
  const child = spawn(process.execPath, [entry, ...args], {
    cwd,
    detached: true,
    windowsHide: true,
    stdio: ["ignore", out, out],
    env: { ...process.env, NG_CLI_ANALYTICS: "false" },
  });
  child.unref();
  fs.closeSync(out);
  current[name] = { pid: child.pid, entry };
  fs.writeFileSync(statePath, JSON.stringify(current, null, 2));
  console.log("Starting " + name + "...");
  await waitFor(url);
}
async function stop(
  names = ["angular", "feathers", "directus"],
  stopDatabase = true,
) {
  const current = state();
  for (const name of names) {
    const item = current[name];
    if (!item) continue;
    try {
      if (process.platform === "win32") {
        const raw = execFileSync(
          "powershell.exe",
          [
            "-NoProfile",
            "-Command",
            '(Get-CimInstance Win32_Process -Filter "ProcessId = ' +
              Number(item.pid) +
              '").CommandLine',
          ],
          { encoding: "utf8", windowsHide: true },
        );
        if (!raw.includes(item.entry))
          throw Error("Process identity changed; leaving it alone.");
        execFileSync("taskkill.exe", ["/PID", String(item.pid), "/T", "/F"], {
          stdio: "ignore",
          windowsHide: true,
        });
      } else {
        process.kill(item.pid, "SIGTERM");
      }
      console.log("Stopped " + name);
    } catch (e) {
      console.log(name + ": already stopped or not owned by this project.");
    }
    delete current[name];
  }
  fs.writeFileSync(statePath, JSON.stringify(current, null, 2));
  if (stopDatabase && fs.existsSync(path.join(cluster, "postmaster.pid")))
    run(pgExe("pg_ctl"), ["-D", cluster, "-m", "fast", "-w", "stop"]);
}
async function start() {
  const local = configure();
  console.log("Preparing the dedicated PostgreSQL database...");
  await database(local);
  const cli = path.join(root, "cms/node_modules/directus/cli.js");
  run(process.execPath, [cli, "bootstrap"], path.join(root, "cms"));
  run(
    process.execPath,
    [path.join(root, "scripts/ensure-directus-admin.mjs")],
    path.join(root, "cms"),
  );
  await startService(
    "directus",
    8055,
    cli,
    ["start"],
    path.join(root, "cms"),
    "http://127.0.0.1:8055/server/ping",
  );
  run(process.execPath, [path.join(root, "scripts/seed-directus.mjs")]);
  await startService(
    "feathers",
    3030,
    path.join(root, "backend/src/server.mjs"),
    [],
    path.join(root, "backend"),
    "http://127.0.0.1:3030/api/health",
  );
  await startService(
    "angular",
    4200,
    path.join(root, "frontend/node_modules/@angular/cli/bin/ng.js"),
    ["serve", "--host", "127.0.0.1", "--port", "4200"],
    path.join(root, "frontend"),
    "http://127.0.0.1:4200",
  );
  console.log(
    "\nLearning platform: http://127.0.0.1:4200\nDirectus admin: http://127.0.0.1:8055\nFeathers health: http://127.0.0.1:3030/api/health\nAdmin email: admin@example.com\nAdmin password: ADMIN_PASSWORD in cms/.env (not printed to logs).",
  );
}
const command = process.argv[2] || "start";
try {
  if (command === "stop") await stop();
  else if (command === "restart-api") {
    await stop(["feathers"], false);
    await startService(
      "feathers",
      3030,
      path.join(root, "backend/src/server.mjs"),
      [],
      path.join(root, "backend"),
      "http://127.0.0.1:3030/api/health",
    );
  } else if (command === "restart-ui") {
    await stop(["angular"], false);
    await startService(
      "angular",
      4200,
      path.join(root, "frontend/node_modules/@angular/cli/bin/ng.js"),
      ["serve", "--host", "127.0.0.1", "--port", "4200"],
      path.join(root, "frontend"),
      "http://127.0.0.1:4200",
    );
  } else if (command === "status") {
    for (const [name, url] of Object.entries({
      angular: "http://127.0.0.1:4200",
      feathers: "http://127.0.0.1:3030/api/health",
      directus: "http://127.0.0.1:8055/server/ping",
    })) {
      try {
        const r = await fetch(url, { signal: AbortSignal.timeout(3000) });
        console.log(name + ": " + r.status);
        if (name === "feathers") console.log(await r.json());
      } catch {
        console.log(name + ": offline");
      }
    }
  } else if (command === "start" || command === "setup") await start();
  else
    throw Error(
      "Usage: node scripts/directus-stack.mjs setup|start|stop|status|restart-api|restart-ui",
    );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
