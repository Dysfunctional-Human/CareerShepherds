import mongoose from 'mongoose';

const chatbotSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User schema
    required: true,
  },
  sessionId: {
    type: String, // To handle multiple sessions per user
    required: true,
  },
  messages: [
    {
      message: { type: String, required: true },
      human: { type: Boolean, required: true }, // True if it's user, false if chatbot
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Chat=mongoose.model('Chatbot', chatbotSchema);
export default Chat;
