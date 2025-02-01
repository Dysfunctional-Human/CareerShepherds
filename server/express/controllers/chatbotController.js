import { v4 as uuidv4 } from 'uuid';
import Chat from '../models/chatbotModel.js';
import axios from 'axios';

const FAST_API_URL = 'http://localhost:8000';

export async function startChat(req, res) {
    try {
        function generateSessionId() {
            return uuidv4();
        }

        const sessionId = generateSessionId();
        const user = req.user;

        // Initialize request data with mandatory fields
        const requestData = {
            userid: user._id.toString(), // Convert ObjectId to string
            sessionid: sessionId
        };

        // Fields that may be present in the user object
        const optionalFields = [
            'firstName', 'lastName', 'email', 'username', 'password', 'phoneNumber', 
            'socialLinks', 'workExperience', 'educationDetails', 
            'skills', 'desiredSkills', 'projects'
        ];

        optionalFields.forEach(field => {
            if (user[field] !== null && user[field] !== undefined) {
                requestData[field] = user[field];
            }
        });

        // Convert nested ObjectIds and ensure proper types
        // if (user.workExperience) {
        //     requestData.workExperience = user.workExperience.map(exp => ({
        //         ...exp,
        //         _id: exp._id.toString(), // Convert _id to string
        //         startYear: exp.startYear ? parseInt(exp.startYear) : null,
        //         endYear: exp.endYear ? parseInt(exp.endYear) : null
        //     }));
        // }

        // if (user.educationDetails) {
        //     requestData.educationDetails = user.educationDetails.map(ed => ({
        //         ...ed,
        //         _id: ed._id.toString(),
        //         startYear: ed.startYear ? parseInt(ed.startYear) : null,
        //         endYear: ed.endYear ? parseInt(ed.endYear) : null
        //     }));
        // }

        // if (user.projects) {
        //     requestData.projects = user.projects.map(proj => ({
        //         ...proj,
        //         _id: proj._id.toString(),
        //         technologiesUsed: Array.isArray(proj.technologiesUsed[0]) ? proj.technologiesUsed[0] : proj.technologiesUsed
        //     }));
        // }

        // Ensure socialLinks is an object (or convert to a JSON string if needed)
        if (user.socialLinks && typeof user.socialLinks !== 'string') {
            requestData.socialLinks = JSON.stringify(user.socialLinks);
        }

        console.log("Final Request Data:", requestData);

        // Send request to FastAPI
        const response = await axios.post(`${FAST_API_URL}/api/start-chat`, requestData);

        // Save chat session in MongoDB
        const chat = new Chat({
            sessionId,
            userId: user._id,
            messages: []
        });
        await chat.save();

        res.send({sessionId});
    } catch (err) {
        console.error("Error in chatbot controller:", err.message);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

export async function chat(req, res) {
    const sessionId = req.body.sessionId;
    if (!sessionId) {
        return res.status(404).send({ message: 'Session Id is required'});
    }

    const userId = req.user._id;
    const humanMessage = req.body.message;
    
    try {
        const currentChat = await Chat.findOne({ sessionId });
        if (!currentChat) {
            return res.status(404).send({ message: 'Chat session not found' });
        }
        // const chatbotMessages = ["Hey! How can I help you?", "I am here to assist you!", "I am a chatbot! Ask me anything!"];
        const response= await axios.post(`${FAST_API_URL}/api/chat`, { sessionId, user_message: humanMessage });
        const chatbotMessage = response.data.messages.content;
        currentChat.messages.push({ message: humanMessage, human: true });
        currentChat.messages.push({ message: chatbotMessage, human: false });
        console.log("Chatbot message:", chatbotMessage);
        console.log("Current chat:", currentChat);
        await currentChat.save();

        const chatBotMessageId=currentChat.messages[currentChat.messages.length-1]._id;
        res.send({message:chatbotMessage,_id:chatBotMessageId});
    } catch (err) {
        console.log("Error in chat controller", err.message);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}
export async function getSessions(req, res) {
    const userId = req.user._id;

    try {
        const sessions = await Chat.find({ userId });
        res.status(200).send(sessions);
    } catch (err) {
        console.log("Error in chat controller", err.message);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}
