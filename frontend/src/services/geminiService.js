import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set. Please add it to .env.local');
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * System prompt for the health AI assistant
 */
const HEALTH_SYSTEM_PROMPT = `You are a healthcare-focused AI assistant for a healthcare app called Healthify.

YOUR SCOPE - You ONLY answer questions about:
- Health conditions, diseases, and symptoms
- Medications, side effects, and drug information
- Nutrition, diet, and dietary recommendations
- Fitness, exercise, and wellness tips
- Medical appointments and healthcare preparation
- Health metrics (blood pressure, heart rate, weight, etc.)
- Mental health and stress management
- Sleep hygiene and rest
- Preventive care and lifestyle improvements

WHAT YOU MUST REFUSE:
- Do NOT answer questions unrelated to health (e.g., ChatGPT, weather, sports, politics, technology, entertainment)
- Do NOT provide medical diagnoses (say "consult a doctor")
- Do NOT prescribe medications
- For non-health questions, politely decline and redirect to health topics

RESPONSE GUIDELINES:
1. Always remind users that you provide EDUCATIONAL information only
2. Never diagnose conditions - always recommend doctor consultation
3. Be empathetic, supportive, and friendly
4. Use emojis occasionally
5. For serious symptoms (chest pain, difficulty breathing, severe bleeding), strongly encourage emergency care
6. Keep responses concise but informative
7. When users ask off-topic questions, respond with: "I'm specifically designed to help with healthcare questions. Can I help you with something health-related instead? For example: symptoms, medications, fitness tips, or nutrition advice."

Remember: You are a health assistant, not a general AI. Stay focused on healthcare topics only.`;

/**
 * Initialize the Gemini model
 */
let model = null;

function getModel() {
    if (!model) {
        model = genAI.getGenerativeModel({ 
            model: 'gemini-2.5-flash',
            systemInstruction: HEALTH_SYSTEM_PROMPT
        });
    }
    return model;
}

/**
 * Debug: List available models with your API key
 * Call this in browser console: import { listAvailableModels } from './geminiService'; listAvailableModels();
 */
export async function listAvailableModels() {
    try {
        const models = await genAI.listModels();
        console.log('Available models:', models);
        return models;
    } catch (error) {
        console.error('Error listing models:', error);
    }
}

/**
 * Send a message to Gemini and get a response
 * @param {string} userMessage - The user's message
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} - The AI response
 */
export async function getAIResponse(userMessage, conversationHistory = []) {
    try {
        const model = getModel();
        
        // Filter conversation history to only include user and model messages
        // Skip initial bot-only messages and ensure first message is from user
        const history = conversationHistory
            .filter(msg => msg.from === 'user' || msg.from === 'bot')
            .map(msg => ({
                role: msg.from === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

        // Find the index of the first user message
        const firstUserIndex = history.findIndex(msg => msg.role === 'user');
        
        // Only keep history from the first user message onwards to avoid "First content should be with role 'user'" error
        const validHistory = firstUserIndex >= 0 ? history.slice(firstUserIndex) : [];

        // Start a new chat session with valid history
        const chat = model.startChat({
            history: validHistory,
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            }
        });

        // Send the user message and get response
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        
        return response.text();
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        
        // Provide more specific error messages
        if (error.message?.includes('API key')) {
            throw new Error('Invalid API key. Please check your VITE_GEMINI_API_KEY in .env.local');
        }
        if (error.message?.includes('quota')) {
            throw new Error('API quota exceeded. Please check your Gemini API usage.');
        }
        if (error.message?.includes('403') || error.message?.includes('permission')) {
            throw new Error('API permission denied. Verify your API key is valid.');
        }
        
        throw new Error(`AI Error: ${error.message || 'Failed to get AI response. Please try again.'}`);
    }
}

export default {
    getAIResponse,
    getModel
};
