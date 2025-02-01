import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { startChat,chat,getSessions } from '../controllers/chatbotController.js';
const router = express.Router();
router.get('/start-chat/',protectRoute, startChat);
router.post('/chat/', protectRoute, chat);
router.get('/sessions/', protectRoute, getSessions);

export default router;