const axios = require('axios');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

module.exports = (bot) => {
  // Command to fetch a random video
  bot.onText(/\/porn/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      bot.sendMessage(chatId, 'Fetching a random video, please wait...');

      // Fetch random video link from the first API endpoint
      const response1 = await axios.get('https://joshweb.click/prn/home');
      const videoData = response1.data;

      if (videoData && videoData.link) {
        const randomVideoLink = videoData.link;

        // Fetch video details from the second API endpoint using the random video link
        const response2 = await axios.get(`https://apilistbyzcdsph-7twv.onrender.com/pornhubdownload?url=${encodeURIComponent(randomVideoLink)}`);
        const videoLinks = response2.data.videoLinks;

        // Find the 240p quality video link
        const video240p = videoLinks.find(video => video.quality === "240");

        if (video240p && video240p.url) {
          const videoUrl = video240p.url;

          // Download and convert the .m3u8 stream to .mp4 using fluent-ffmpeg
          const timestamp = new Date().getTime(); // Generate a unique filename
          const videoFilePath = path.join(__dirname, `${timestamp}.mp4`); // Save to current directory with a unique name

          bot.sendMessage(chatId, 'Downloading and converting video, please wait...');

          ffmpeg(videoUrl)
            .output(videoFilePath)
            .videoCodec('copy') // Copy the video stream without re-encoding for speed
            .audioCodec('copy') // Copy the audio stream without re-encoding for speed
            .duration(600) // Trim video to 10 minutes (600 seconds)
            .on('end', async () => {
              bot.sendMessage(chatId, 'Sending video...');

              // Send the video file
              bot.sendVideo(chatId, fs.createReadStream(videoFilePath), {
                caption: 'Here is your 10-minute video!' // Optionally send a caption
              })
                .then(() => {
                  // Delete the downloaded file after sending
                  fs.unlinkSync(videoFilePath);
                })
                .catch(err => {
                  console.error('Error sending video:', err);
                  bot.sendMessage(chatId, 'Error sending video.');
                });
            })
            .on('error', (err) => {
              console.error('Error converting video:', err.message);
              bot.sendMessage(chatId, 'Error converting video.');
            })
            .run();
        } else {
          bot.sendMessage(chatId, 'Failed to fetch 240p video link.');
        }
      } else {
        bot.sendMessage(chatId, 'Failed to fetch random video link.');
      }
    } catch (error) {
      console.error('Error fetching video:', error.message || error);
      bot.sendMessage(chatId, 'Error fetching video.');
    }
  });

    // Command to search for videos
    bot.onText(/\/vidsearch (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const searchText = match[1];

      try {
        bot.sendMessage(chatId, `Searching for "${searchText}" videos...`);

        // Fetch video search results from API
        const response = await axios.get(`https://apilistbyzcdsph-7twv.onrender.com/pornhubsearch?search=${encodeURIComponent(searchText)}`);
        const searchResults = response.data.videos;

        if (searchResults && searchResults.length > 0) {
          // Prepare messages to send
          let message = '';
          for (let i = 0; i < searchResults.length; i++) {
            const video = searchResults[i];
            message += `${video.title}\n${video.link}\n\n`;

            // Telegram has a limit of 4096 characters per message, split into multiple messages if necessary
            if (message.length > 3000) { // Adjust message length as needed
              await bot.sendMessage(chatId, message);
              message = ''; // Reset message for the next batch
            }
          }

          // Send any remaining messages
          if (message.trim() !== '') {
            await bot.sendMessage(chatId, message);
          }
        } else {
          bot.sendMessage(chatId, 'No videos found for your search.');
        }
      } catch (error) {
        console.error('Error searching videos:', error.message || error);
        bot.sendMessage(chatId, 'Error searching videos.');
      }
    });


  // Command to download and convert a selected video
  bot.onText(/\/viddl (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const selectedVideoIndex = parseInt(match[1]);

    try {
      bot.sendMessage(chatId, 'Downloading and converting video, please wait...');

      // Fetch video search results again to get the selected video link
      const response = await axios.get(`https://apilistbyzcdsph-7twv.onrender.com/search?search=${encodeURIComponent(searchText)}`);
      const searchResults = response.data.videos;

      if (searchResults && searchResults.length > 0 && selectedVideoIndex >= 0 && selectedVideoIndex < searchResults.length) {
        const selectedVideo = searchResults[selectedVideoIndex];
        const videoUrl = selectedVideo.link;

        // Fetch video details from the download API
        const response = await axios.get(`https://apilistbyzcdsph-7twv.onrender.com/pornhubdownload?url=${encodeURIComponent(videoUrl)}`);
        const videoLinks = response.data.videoLinks;

        // Find the 240p quality video link
        const video240p = videoLinks.find(video => video.quality === "240");

        if (video240p && video240p.url) {
          const videoUrl = video240p.url;

          // Download and convert the .m3u8 stream to .mp4 using fluent-ffmpeg
          const timestamp = new Date().getTime(); // Generate a unique filename
          const videoFilePath = path.join(__dirname, `${timestamp}.mp4`); // Save to current directory with a unique name

          ffmpeg(videoUrl)
            .output(videoFilePath)
            .videoCodec('copy') // Copy the video stream without re-encoding for speed
            .audioCodec('copy') // Copy the audio stream without re-encoding for speed
            .duration(600) // Limit the duration of the output video to 10 minutes (600 seconds)
            .on('end', async () => {
              bot.sendMessage(chatId, 'Sending video...');

              // Send the video file
              bot.sendVideo(chatId, fs.createReadStream(videoFilePath), {
                caption: 'Here is your downloaded 10-minute video!' // Optionally send a caption
              })
                .then(() => {
                  // Delete the downloaded file after sending
                  fs.unlinkSync(videoFilePath);
                })
                .catch(err => {
                  console.error('Error sending video:', err);
                  bot.sendMessage(chatId, 'Error sending video.');
                });
            })
            .on('error', (err) => {
              console.error('Error converting video:', err.message);
              bot.sendMessage(chatId, 'Error converting video.');
            })
            .run();
        } else {
          bot.sendMessage(chatId, 'Failed to fetch 240p video link.');
        }
      } else {
        bot.sendMessage(chatId, 'Invalid video selection.');
      }
    } catch (error) {
      console.error('Error downloading and converting video:', error.message || error);
      bot.sendMessage(chatId, 'Error downloading and converting video.');
    }
  });
};
