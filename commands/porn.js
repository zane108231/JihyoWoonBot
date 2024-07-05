const axios = require('axios');

module.exports = (bot) => {
  bot.onText(/\/porn/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      bot.sendMessage(chatId, 'Fetching a random video, please wait...');

      // Fetch video details from the API
      const response = await axios.get('https://nash-rest-api.replit.app/pornhub');
      const video = response.data;

      if (video && video.title && video.link) {
        const title = video.title;
        const link = video.link;

        // Check if the video link is a direct URL to a video file
        const isVideoFile = link.match(/\.(mp4|avi|mov|mkv)$/i);

        if (isVideoFile) {
          // Send the video file with the title as the caption
          bot.sendVideo(chatId, link, { caption: title });
        } else {
          // If it's not a direct video file, send the link as a fallback
          bot.sendMessage(chatId, `Title: ${title}\nLink: ${link}`);
        }
      } else {
        bot.sendMessage(chatId, 'Sorry, the video data is not in the expected format.');
      }
    } catch (error) {
      console.error('Error fetching video:', error.message || error);
      bot.sendMessage(chatId, `Sorry, there was an error fetching the video. Error: ${error.message}`);
    }
  });
};
