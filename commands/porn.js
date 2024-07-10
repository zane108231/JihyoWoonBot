const axios = require('axios');
const fs = require('fs');
const path = require('path');        

module.exports = (bot) => {
  bot.onText(/\/porn/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      bot.sendMessage(chatId, 'Fetching a random video, please wait...');

      // Fetch random video link from the first API endpoint
      const response1 = await axios.get('https://apilistbyzcdsph-7twv.onrender.com/xvideos');
      const videoData = response1.data;

      if (videoData && videoData.link) {
        const randomVideoLink = videoData.link;

        // Fetch video details from the second API endpoint using the random video link
        const response2 = await axios.get(`https://joshweb.click/prn/download?url=${encodeURIComponent(randomVideoLink)}`);
        const videoInfo = response2.data.result;

        if (videoInfo && videoInfo.contentUrl && videoInfo.contentUrl.Low_Quality) {
          const videoUrl = videoInfo.contentUrl.Low_Quality;

          // Download the video
          const videoResponse = await axios({
            method: 'get',
            url: videoUrl,
            responseType: 'stream'
          });

          const timestamp = new Date().getTime(); // Generate a unique filename
          const videoFilePath = path.join(__dirname, `${timestamp}.mp4`); // Save to current directory with a unique name

          const writer = fs.createWriteStream(videoFilePath);
          videoResponse.data.pipe(writer);

          // Wait for file to finish downloading
          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });

          // Send the video file
          bot.sendVideo(chatId, fs.createReadStream(videoFilePath), {
            caption: videoInfo.name // Optionally send video name as caption
          })
            .then(() => {
              // Delete the downloaded file after sending
              fs.unlinkSync(videoFilePath);
            })
            .catch(err => console.error('', err));
        } else {
          bot.sendMessage(chatId, '');
        }
      } else {
        bot.sendMessage(chatId, '');
      }
    } catch (error) {
      console.error('Error fetching video:', error.message || error);
      bot.sendMessage(chatId, '');
    }
  });
};
