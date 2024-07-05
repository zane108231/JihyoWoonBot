const axios = require('axios');

module.exports = (bot) => {
  bot.onText(/\/waifu (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const searchQuery = match[1];

    try {
      bot.sendMessage(chatId, 'Please wait, fetching your waifu image...');

      const response = await axios.get(`https://nash-rest-api.replit.app/waifu`, {
        params: {
          search: searchQuery
        }
      });

      const image = response.data.data.images[0];
      const imageUrl = image.url;

      bot.sendPhoto(chatId, imageUrl, {
        caption: `Here's a waifu image for "${searchQuery}".`
      });
    } catch (error) {
      console.error('Error fetching data from API:', error);
      bot.sendMessage(chatId, 'Sorry, there was an error fetching the waifu image.');
    }
  });
};