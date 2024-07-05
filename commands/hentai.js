const axios = require('axios');

module.exports = (bot) => {
  bot.onText(/\/hentai/, async (msg) => {
    const chatId = msg.chat.id;

    const usageMessage = `
Usage: /hentai
Fetches and sends a random hentai video.
    `;

    bot.sendMessage(chatId, 'Please wait, fetching a random hentai video...');

    try {
      const response = await axios.get('https://joshweb.click/api/randhntai');
      const data = response.data.result;

      const randomVideo = data[Math.floor(Math.random() * data.length)];

      const message = `
Title: ${randomVideo.title}
Category: ${randomVideo.category}
Shares: ${randomVideo.share_count}
Views: ${randomVideo.views_count}
      `;

      bot.sendVideo(chatId, randomVideo.video_1, {
        caption: message,
        parse_mode: 'Markdown'
      });
    } catch (error) {
      console.error('Walang respomse sa Api bay:', error);
      bot.sendMessage(chatId, 'Sorry, there was an error fetching the hentai content.');
    }
  });
};