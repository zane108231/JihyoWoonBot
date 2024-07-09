const axios = require('axios');

module.exports = (bot) => {
  bot.onText(/\/ai (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1];

    try {
      bot.sendMessage(chatId, '');
      
      const response = await axios.get(`https://apilistbyzcdsph-7twv.onrender.com/gpt4?query=${encodeURIComponent(query)}`);
      const message = response.data.respond;
      
      bot.sendMessage(chatId, message);
    } catch (error) {
      console.error('Walang respomse sa Api bay:', error);
      bot.sendMessage(chatId, 'Sorry, there was an error fetching the information.');
    }
  });
};
