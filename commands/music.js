const path = require('path');
const fs = require('fs-extra');
const ytdl = require('@distube/ytdl-core');
const ytsr = require('ytsr');

module.exports = (bot) => {
    bot.onText(/\/music (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const musicName = match[1];

        function byte2mb(bytes) {
            const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            let l = 0, n = parseInt(bytes, 10) || 0;
            while (n >= 1024 && ++l) n = n / 1024;
            return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
        }

        if (!musicName) {
            bot.sendMessage(chatId, 'To get started, type /music and the title of the song you want.');
            return;
        }

        try {
            bot.sendMessage(chatId, `Searching for "${musicName}"...`);

            const searchResults = await ytsr(musicName, { limit: 1 });
            if (!searchResults.items.length) {
                bot.sendMessage(chatId, "Can't find the search.");
                return;
            }

            const music = searchResults.items[0];
            const musicUrl = music.url;
            const stream = ytdl(musicUrl, { filter: 'audioonly' });
            const time = new Date();
            const timestamp = time.toISOString().replace(/[:.]/g, '-');
            const filePath = path.join(__dirname, 'cache', `${timestamp}_music.mp3`);

            stream.pipe(fs.createWriteStream(filePath));
            
            stream.on('response', () => {
                // Handle the response, e.g., show progress (optional)
            });

            stream.on('info', (info) => {
                // You can log or use the info here (optional)
            });

            stream.on('end', () => {
                const fileSize = fs.statSync(filePath).size;
                if (fileSize > 26214400) { // 25MB
                    fs.unlinkSync(filePath);
                    bot.sendMessage(chatId, 'The file could not be sent because it is larger than 25MB.');
                    return;
                }

                const messageOptions = {
                    caption: `${music.title}`,
                    // Telegram requires the file to be either a readable stream or a file path
                    thumb: filePath,
                };
                bot.sendAudio(chatId, filePath, messageOptions).then(() => {
                    fs.unlinkSync(filePath);  // Clean up the file after sending
                });
            });

        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, 'An error occurred while processing your request.');
        }
    });
};
