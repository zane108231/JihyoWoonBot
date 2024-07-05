const axios = require('axios');

module.exports = (bot) => {
  bot.onText(/\/shoti/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      bot.sendMessage(chatId, 'Fetching a random Shoti video, please wait...');

      const url = 'https://shoti-srv1.onrender.com/api/v1/get';
      const apiKey = '$shoti-1hg4gifgnlfdmeslom8';

      // Make POST request to fetch Shoti video
      const response = await axios.post(url, { apikey: apiKey }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Get video data from response
      const video = response.data.data;

      if (video && video.url && video.url.endsWith('.mp4')) {
        const videoUrl = video.url;

        // Send video file with caption
        bot.sendVideo(chatId, videoUrl, { caption: '🎥 CRUSH MOYAN NOH.' });
      } else {
        bot.sendMessage(chatId, 'Sorry, the Shoti video data is not in the expected format.');
      }
    } catch (error) {
      console.error('Error fetching Shoti video:', error.message || error);
      bot.sendMessage(chatId, `Sorry, there was an error fetching the Shoti video. Error: ${error.message}`);
    }
  });
};
