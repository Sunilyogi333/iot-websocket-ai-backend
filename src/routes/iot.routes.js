// src/routes/iot.routes.js
import express from 'express';
import { controlLed } from '../controllers/iot.controller.js';

const router = express.Router();

// Endpoint to control the LED
router.post('/control-led', controlLed);

export default router;
