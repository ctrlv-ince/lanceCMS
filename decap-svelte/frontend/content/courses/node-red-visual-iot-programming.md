---
title: "Node-RED: Visual IoT Programming on Raspberry Pi"
slug: "node-red-visual-iot-programming"
instructor: "Borja, V. · Cipriano, Y.A. · Duque, R.J. · Ego, I.R. · Monforte, A.R. · Vila, L.C."
level: "intermediate"
description: "Learn Node-RED — a flow-based programming tool that makes connecting IoT devices, APIs, and services as simple as dragging and dropping nodes. Covers installation on Raspberry Pi, MQTT integration, dashboard UI, and building a complete data flow for live sensor monitoring."
published: true
body: |
  ## What is Node-RED?

  Node-RED is an open-source, flow-based programming tool developed by IBM and contributed to the OpenJS Foundation. It provides a browser-based editor for visually wiring together devices, APIs, and services — making IoT programming accessible without writing extensive code.

  > "Node-RED lets you wire together hardware devices, APIs and online services in new and interesting ways." — Node-RED Documentation

  ---

  ## Key Concepts

  ### Nodes
  The building blocks of Node-RED flows. Each node performs a specific function:
  - **Input nodes** — trigger flows (MQTT in, HTTP request, timer)
  - **Function nodes** — process data with JavaScript
  - **Output nodes** — deliver results (MQTT out, HTTP response, debug)

  ### Flows
  A flow is a collection of connected nodes. Data (called **messages**) passes through the network of nodes from left to right.

  ### Messages
  Messages are JavaScript objects with a `msg.payload` property containing the actual data:
  ```json
  {
    "topic": "sensor/climate",
    "payload": {
      "temperature": 27.5,
      "humidity": 63.2
    }
  }
  ```

  ---

  ## Installation on Raspberry Pi

  ### Prerequisites
  ```bash
  sudo apt update && sudo apt upgrade -y
  sudo apt install nodejs npm -y
  ```

  ### Install Node-RED
  ```bash
  bash <(curl -sL https://raw.githubusercontent.com/node-red/linux-installers/master/deb/update-nodejs-and-nodered)
  ```

  ### Enable Auto-Start on Boot
  ```bash
  sudo systemctl enable nodered.service
  sudo systemctl start nodered.service
  ```

  ### Access the Editor
  Open a browser and navigate to:
  ```
  http://<raspberry-pi-ip>:1880
  ```

  ---

  ## Core Node Types

  | Node | Category | Purpose |
  |------|----------|---------|
  | `inject` | Input | Trigger a flow manually or on a schedule |
  | `debug` | Output | Print msg.payload to the debug sidebar |
  | `function` | Function | Write custom JavaScript to transform messages |
  | `mqtt in` | Network | Subscribe to MQTT topic |
  | `mqtt out` | Network | Publish to MQTT topic |
  | `http in` | Network | Create an HTTP endpoint |
  | `http response` | Network | Send HTTP response |
  | `switch` | Function | Route messages based on conditions |
  | `change` | Function | Modify message properties |
  | `dashboard` | UI | Display data in a browser dashboard |

  ---

  ## Connecting to MQTT

  ### Step 1 — Add MQTT Broker Configuration
  1. Drag an **mqtt in** node onto the canvas
  2. Double-click to open properties
  3. Click the pencil ✏️ next to "Server" to add a new broker
  4. Enter: `localhost` port `1883`
  5. Save and deploy

  ### Step 2 — Parse Incoming JSON
  After the **mqtt in** node, add a **JSON** node to automatically parse `msg.payload`:
  ```
  [mqtt in] → [JSON] → [function] → [debug]
  ```

  ### Step 3 — Function Node to Extract Values
  ```javascript
  // Extract temperature and humidity from parsed payload
  var temp = msg.payload.temperature;
  var hum  = msg.payload.humidity;

  msg.topic   = "Climate Data";
  msg.payload = `Temp: ${temp}°C | Humidity: ${hum}%`;

  return msg;
  ```

  ---

  ## Node-RED Dashboard

  ### Install Dashboard Nodes
  ```bash
  cd ~/.node-red
  npm install node-red-dashboard
  ```
  Or use the **Manage palette** menu in the editor.

  ### Dashboard Nodes Available
  - `ui_gauge` — Circular gauge (great for temperature)
  - `ui_chart` — Line/bar chart for time-series data
  - `ui_text` — Display a text value
  - `ui_button` — Trigger actions
  - `ui_switch` — Toggle a boolean state

  ### Example Flow — Live Temperature Gauge
  ```
  [mqtt in "sensor/climate"] 
    → [JSON] 
    → [change: set msg.payload to msg.payload.temperature]
    → [ui_gauge: Temperature]
  ```

  Access the dashboard at: `http://<raspberry-pi-ip>:1880/ui`

  ---

  ## Practical Project: Live Sensor Dashboard

  ### Full Flow Design
  ```
  MQTT Broker (Mosquitto)
       ↓
  [mqtt in "sensor/climate"]
       ↓
  [JSON parser]
       ↓
  [function: split into temp + humidity]
       ↓
  ├── [ui_gauge: Temperature °C]
  ├── [ui_gauge: Humidity %]
  └── [ui_chart: History]
       ↓
  [http request: POST to PostgreSQL API]
  ```

  ### Exporting & Importing Flows
  Export your flow as JSON:
  1. Select all nodes (Ctrl+A)
  2. Menu → Export → Clipboard
  3. Copy the JSON and save it

  Import a flow:
  1. Menu → Import → Clipboard
  2. Paste the JSON and click Import

  ---

  ## Comparison: Node-RED vs Traditional Coding

  | Aspect | Node-RED | Traditional Code |
  |--------|----------|-----------------|
  | Setup time | Minutes | Hours |
  | Learning curve | Low | High |
  | Debugging | Visual, real-time | Log files |
  | Flexibility | Medium | Full |
  | Best for | Rapid prototyping, IoT | Complex logic, production |

  ---

  ## Summary

  Node-RED transforms complex IoT workflows into visual, drag-and-drop flows. Combined with Raspberry Pi and MQTT, it becomes a powerful hub for real-time sensor monitoring, data logging, and dashboard visualization — all without writing traditional application code.

  **Key takeaways:**
  - Flows are wires connecting nodes
  - Messages carry data as `msg.payload`
  - MQTT integration is native and straightforward
  - The dashboard add-on provides a ready-made UI in minutes
---
