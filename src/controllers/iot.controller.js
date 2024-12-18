import { wss } from '../index.js'; // Import the WebSocket server

// src/controllers/iot.controller.js
export const controlLed = (req, res) => {
    const { action } = req.body; // Expecting action in the request body
  
    if (!action || (action !== 'turn_on' && action !== 'turn_off')) {
      return res.status(400).json({ message: 'Invalid action' });
    }
  
    // Send the command to WebSocket to control the ESP32 LED
    if (wss.clients.size > 0) { // Ensure there is a WebSocket client connected
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(action); // Send the action to the WebSocket client (ESP32)
        }
      });
      return res.status(200).json({ message: `LED turned ${action}` });
    } else {
      return res.status(500).json({ message: 'No WebSocket client connected' });
    }
  };
  