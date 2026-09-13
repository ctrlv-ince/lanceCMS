---
title: "Advanced Raspberry Pi Sensor Applications"
slug: "advanced-raspberry-pi-sensor-applications"
instructor: "Borja, V. · Cipriano, Y.A. · Duque, R.J. · Ego, I.R. · Monforte, A.R. · Vila, L.C."
level: "advanced"
description: "A full-stack IoT project using Raspberry Pi, ESP32, DHT sensors, Servo motors, MQTT, PostgreSQL, Python SocketIO, and a Next.js dashboard — covering every step from hardware wiring to live data visualization."
published: true
body: |
  ## Overview

  This project demonstrates a complete IoT sensor ecosystem running on a Raspberry Pi. It integrates an ESP32 microcontroller with DHT temperature/humidity sensors and a servo motor, streams live data via MQTT, persists it in PostgreSQL, and visualizes it on a Next.js + Tailwind CSS dashboard.

  ---

  ## Part 1 — System & Server Setup

  ### Update Raspberry Pi Packages
  Start by ensuring your Raspberry Pi OS is fully up to date:
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```

  ### Install Node.js v20 LTS
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
  node -v   # should print v20.x.x
  ```

  ### Install MongoDB (64-bit Raspberry Pi OS)
  ```bash
  wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
  sudo apt install -y mongodb
  sudo systemctl enable mongod && sudo systemctl start mongod
  ```

  ### PM2 — Process Management
  PM2 keeps your Node.js backend running 24/7 and auto-restarts on reboot:
  ```bash
  npm install -g pm2
  pm2 start app.js --name "sensor-api"
  pm2 startup      # generates systemd unit
  pm2 save         # save process list for reboot
  ```

  ---

  ## Part 2 — ESP32 + Sensor Hardware

  ### DHT Temperature & Humidity Sensor
  Connect the DHT sensor to **GPIO 14** on the ESP32.

  ```cpp
  #include <DHT.h>
  #define FANPIN 14
  #define DHTTYPE DHT22

  DHT dht(FANPIN, DHTTYPE);

  void setup() {
    Serial.begin(115200);
    dht.begin();
  }

  void loop() {
    float temp = dht.readTemperature();
    float hum  = dht.readHumidity();
    Serial.printf("Temp: %.1f°C  Humidity: %.1f%%\n", temp, hum);
    delay(2000);
  }
  ```

  ### Servo Motor Control
  Connect the servo to **GPIO 13**:

  ```cpp
  #include <ESP32Servo.h>
  #define SERVOPIN 13

  Servo myServo;

  void setup() {
    myServo.attach(SERVOPIN);
  }

  void loop() {
    myServo.write(0);    delay(1000);
    myServo.write(90);   delay(1000);
    myServo.write(180);  delay(1000);
  }
  ```

  ---

  ## Part 3 — MQTT Broker (Mosquitto)

  ### Install & Configure Mosquitto
  ```bash
  sudo apt install mosquitto mosquitto-clients -y
  sudo systemctl enable mosquitto
  sudo systemctl start mosquitto
  ```

  ### Test MQTT Communication
  Subscribe on one terminal:
  ```bash
  mosquitto_sub -h localhost -t "sensor/climate"
  ```

  Publish from another:
  ```bash
  mosquitto_pub -h localhost -t "sensor/climate" -m '{"temp":27.5,"humidity":65}'
  ```

  ---

  ## Part 4 — PostgreSQL Database

  ### Install PostgreSQL
  ```bash
  sudo apt install postgresql postgresql-contrib -y
  sudo systemctl enable postgresql
  sudo systemctl start postgresql
  ```

  ### Create Database & Schema
  ```sql
  CREATE DATABASE sensordb;
  \c sensordb

  CREATE TABLE climate_readings (
    id         SERIAL PRIMARY KEY,
    temperature FLOAT NOT NULL,
    humidity    FLOAT NOT NULL,
    recorded_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE light_readings (
    id         SERIAL PRIMARY KEY,
    lux        FLOAT NOT NULL,
    recorded_at TIMESTAMP DEFAULT NOW()
  );
  ```

  ### Verify Live Data
  ```sql
  SELECT * FROM climate_readings ORDER BY recorded_at DESC LIMIT 10;
  SELECT * FROM light_readings   ORDER BY recorded_at DESC LIMIT 10;
  ```

  ---

  ## Part 5 — Python Backend

  ### Setup Virtual Environment
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  pip install python-socketio paho-mqtt psycopg2-binary eventlet
  ```

  ### Real-Time SocketIO Server (server.py)
  ```python
  import eventlet
  import socketio
  import paho.mqtt.client as mqtt
  import psycopg2
  import json

  sio = socketio.Server(cors_allowed_origins='*')
  app = socketio.WSGIApp(sio)

  DB = psycopg2.connect("dbname=sensordb user=pi password=yourpass host=localhost")

  def on_message(client, userdata, msg):
      data = json.loads(msg.payload)
      cur = DB.cursor()
      cur.execute(
          "INSERT INTO climate_readings (temperature, humidity) VALUES (%s, %s)",
          (data['temp'], data['humidity'])
      )
      DB.commit()
      sio.emit('climate_update', data)

  mqtt_client = mqtt.Client()
  mqtt_client.on_message = on_message
  mqtt_client.connect("localhost", 1883)
  mqtt_client.subscribe("sensor/climate")
  mqtt_client.loop_start()

  if __name__ == '__main__':
      eventlet.wsgi.server(eventlet.listen(('', 5000)), app)
  ```

  ---

  ## Part 6 — Next.js Frontend Dashboard

  ### Scaffold the Project
  ```bash
  npx create-next-app@latest dashboard --typescript --tailwind
  cd dashboard
  npm i -D prisma
  npx prisma init
  npm run dev
  ```

  The dashboard displays live climate & light data from the Python backend, with charts updating in real time via SocketIO.

  ---

  ## Summary

  | Component | Technology |
  |-----------|-----------|
  | Hardware  | Raspberry Pi + ESP32 + DHT22 + Servo |
  | Messaging | Mosquitto MQTT Broker |
  | Database  | PostgreSQL |
  | Backend   | Python + SocketIO + paho-mqtt |
  | Frontend  | Next.js + Tailwind CSS + Prisma |
  | Process   | PM2 |
---
