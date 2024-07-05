const axios = require('axios');
const fs = require('fs');
const { spotify, spotifydl } = require('betabotz-tools');
const path = __dirname + '/cache/spotify.mp3';

module.exports = (bot) => {
    bot.onText(/\/music (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const searchQuery = match[1];

        if (!searchQuery) {
            bot.sendMessage(chatId, '[ ❗ ] - Missing title of the song.');
            return;
        }

        try {
            bot.sendMessage(chatId, `[ 🔍 ] Searching for “${searchQuery}” ...`);

            const lyricResponse = await axios.get(`https://lyrist.vercel.app/api/${encodeURIComponent(searchQuery)}`);
            const { lyrics, title } = lyricResponse.data;

            const spotifyResults = await spotify(encodeURI(searchQuery));
            const spotifyUrl = spotifyResults.result.data[0].url;

            const downloadResult = await spotifydl(spotifyUrl);
            const audioData = (
                await axios.get(downloadResult.result, { responseType: 'arraybuffer' })
            ).data;

            fs.writeFileSync(path, Buffer.from(audioData, 'utf-8'));

            const messageText = `·•———[ SPOTIFY DL ]———•·\n\nTitle: ${title}\nLyrics:\n\n${lyrics}\n\nYou can download this audio by clicking this link or paste it to your browser: ${downloadResult.result}`;
            bot.sendAudio(chatId, fs.createReadStream(path), {
                caption: messageText
            }).then(() => {
                fs.unlinkSync(path);  // Clean up the file after sending
            });

        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, 'An error occurred while processing your request.');
        }
    });
};
