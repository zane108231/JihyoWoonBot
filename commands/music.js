const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

module.exports = (bot) => {
    const YOUTUBE_API_KEY = 'AIzaSyA4b1j_IHISNZQi8UCGu0TMYof-byIWbMU'; // Replace with your YouTube API key

    bot.onText(/\/music (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const searchTerm = match[1];
        const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(searchTerm)}&key=${YOUTUBE_API_KEY}`;

        try {
            // Dynamically import node-fetch
            const fetch = (await import('node-fetch')).default;

            // Step 1: Search for the video on YouTube
            const response = await fetch(youtubeSearchUrl);
            const data = await response.json();
            if (!data.items || data.items.length === 0) {
                return bot.sendMessage(chatId, `No results found for "${searchTerm}".`);
            }

            const videoId = data.items[0].id.videoId;
            const videoTitle = data.items[0].snippet.title;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

            // Step 2: Download the audio directly in MP3 format
            const outputFileName = path.join(__dirname, 'downloads', `${videoId}.mp3`);

            // Ensure downloads directory exists
            if (!fs.existsSync(path.join(__dirname, 'downloads'))) {
                fs.mkdirSync(path.join(__dirname, 'downloads'));
            }

            // Download the audio stream
            const audioStream = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });
            const writeStream = fs.createWriteStream(outputFileName);

            audioStream.pipe(writeStream);

            writeStream.on('finish', () => {
                // Step 3: Send the MP3 file to Telegram
                bot.sendAudio(chatId, outputFileName, { title: videoTitle })
                    .then(() => {
                        // Delete the file after sending
                        fs.unlinkSync(outputFileName);
                    })
                    .catch(error => {
                        console.error('Error sending audio:', error);
                        bot.sendMessage(chatId, `Error sending audio file: ${error.message}`);
                    });
            });

            writeStream.on('error', error => {
                console.error('Error writing audio file:', error);
                bot.sendMessage(chatId, `Error writing audio file: ${error.message}`);
            });

            bot.sendMessage(chatId, `Downloading and preparing "${videoTitle}"...`);

        } catch (error) {
            console.error('Error:', error);
            bot.sendMessage(chatId, `An error occurred: ${error.message}`);
        }
    });
};
