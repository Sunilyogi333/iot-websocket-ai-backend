import "dotenv/config";
import connectDb from "./config/mongoose.connection.js";
import app from "./app.js";
import { WebSocketServer } from "ws";
import http from "http";
import { PythonShell } from "python-shell";
const port = process.env.PORT;

// Create an HTTP server to use with WebSocket
const server = http.createServer(app);

// Set up WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  // Send initial message to client
  ws.send(JSON.stringify({ message: "Welcome to the WebSocket server" }));

  // Handle incoming messages from the Flutter client
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("Received from client:", data);

      const { action } = data;

      if (action === "turn_on") {
        // Send the command to turn on the bulb (forward to ESP32)
        console.log("Turning on the bulb...");
        ws.send("turn_on");
      } else if (action === "turn_off") {
        // Send the command to turn off the bulb (forward to ESP32)
        console.log("Turning off the bulb...");
        ws.send("turn_off");
      } else if (action === "getData") {
        // Send current sensor data back to client (Flutter app)
        const sensorData = {
          humidity: Math.random() * 100, // Simulate random humidity data
          temperature: Math.random() * 40, // Simulate random temperature data
        };
        ws.send(JSON.stringify(sensorData));
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  // Periodically send data to Flutter app (simulated sensor data)
  setInterval(() => {
    console.log("Sending data to Flutter app: Humidity and Temperature");
    const sensorData = {
      humidity: Math.random() * 100, // Simulate random humidity data
      temperature: Math.random() * 40, // Simulate random temperature data
    };

    // Send data to connected client (Flutter)
    ws.send(JSON.stringify(sensorData));
  }, 10000);

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

// Connect to the database and start the server
connectDb()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
      console.log(`WebSocket server started`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to the database:", error);
  });
export { wss }; // Export WebSocket server

console.log("Hello World");
