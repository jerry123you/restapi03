# MQTT-DB-Service

The MQTT-DB-Service is a Node.js application that subscribes to an MQTT broker to receive telemetry data and stores this data in a Postgres database.

## Features

- MQTT subscriber for receiving telemetry data.
- Database integration for storing received data in a structured format.


## Setup

To set up the service, ensure you have Node.js installed and then run:

```bash
npm install
```

Compile the TypeScript code with:

```bash
npm run build
```

Then start the service with:

```bash
npm start
```

How to use API:

http://127.0.0.1:9000/team1API/robot/HMI_GVL.M.Rob1.ROBOTPOS.Y/?tstart=2024-04-09%2012:47:46.778&tend=2024-04-09%2012:47:46.825