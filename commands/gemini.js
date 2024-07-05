const axios = require('axios');

module.exports = (bot) => {
    bot.onText(/\/gemini (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const prompt = match[1];

        try {
            const response = await axios.get(`https://nash-rest-api.replit.app/gemini?prompt=${encodeURIComponent(prompt)}`);

            // Assuming the API response has a 'response' property
            const geminiResponse = response.data.response; // Extracting only the 'response' property

            // Send the response back to the user
            bot.sendMessage(chatId, geminiResponse);
        } catch (error) {
            console.error('Error fetching Gemini API:', error);
            bot.sendMessage(chatId, 'Sorry, there was an error processing your request.');
        }
    });
};
