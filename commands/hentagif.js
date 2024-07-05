const axios = require('axios');

module.exports = (bot) => {
  bot.onText(/\/hentagif/, async (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Please wait, fetching a random hentai GIF...');

    try {
      const response = await axios.get('https://nash-rest-api.replit.app/hentai-gif');
      const { gifUrl } = response.data;

      bot.sendAnimation(chatId, gifUrl, {
        caption: 'Here is your random hentai GIF.',
        parse_mode: 'Markdown'
      });
    } catch (error) {
      console.error('Walang respomse sa Api bay:', error);
      bot.sendMessage(chatId, 'Sorry, there was an error fetching the GIF.');
    }
  });
};