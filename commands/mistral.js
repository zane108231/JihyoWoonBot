const axios = require('axios');

module.exports = (bot) => {
  bot.onText(/\/porn (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const prompt = match[1];

    try {
      bot.sendMessage(chatId, 'Please wait, processing your request...');

      const senderID = chatId;

      const response = await axios.get('https://nash-rest-api.replit.app/mistral', {
        params: {
          prompt: prompt,
          senderID: senderID
        }
      });

      const message = response.data.response;

      bot.sendMessage(chatId, message);
    } catch (error) {
      console.error('Walang respomse sa Api bay:', error);
      bot.sendMessage(chatId, 'Sorry, there was an error fetching the information.');
    }
  });
};