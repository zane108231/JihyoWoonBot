const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = (bot) => {
    bot.onText(/\/music (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const searchQuery = match[1];

        const clientId = '5cc03b6b3f894e308fd4ce1ccad22814';
        const clientSecret = 'b74b20aec84a4028bfa8a3c5f25c5cd5';

        const getAccessToken = async () => {
            try {
                const response = await axios.post('https://accounts.spotify.com/api/token', null, {
                    params: {
                        grant_type: 'client_credentials'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    auth: {
                        username: clientId,
                        password: clientSecret,
                    },
                });
                return response.data.access_token;
            } catch (error) {
                console.error('Error getting access token:', error.response.data);
                return null;
            }
        };

        const accessToken = await getAccessToken();

        if (!accessToken) {
            bot.sendMessage(chatId, 'Failed to obtain access token.');
            return;
        }

        if (!searchQuery) {
            bot.sendMessage(chatId, 'To get started, type /music and the title of the song you want.');
            return;
        }

        try {
            bot.sendMessage(chatId, `Searching for "${searchQuery}"...`);

            const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=1`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const track = response.data.tracks.items[0];
            if (!track) {
                bot.sendMessage(chatId, "Can't find the search.");
                return;
            }

            const trackUrl = track.external_urls.spotify;
            const previewUrl = track.preview_url;
            const fileName = `${track.name} - ${track.artists[0].name}.mp3`;

            if (!previewUrl) {
                bot.sendMessage(chatId, "No preview available for this track.");
                return;
            }

            // Download the preview file
            const filePath = path.resolve(__dirname, fileName);
            const writer = fs.createWriteStream(filePath);

            const responseStream = await axios({
                url: previewUrl,
                method: 'GET',
                responseType: 'stream'
            });

            responseStream.data.pipe(writer);

            writer.on('finish', async () => {
                // Send the audio file to the user
                await bot.sendAudio(chatId, filePath, { caption: `Title: ${track.name}\nArtist: ${track.artists[0].name}` });

                // Clean up the file after sending
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting the file:', err);
                });
            });

            writer.on('error', (err) => {
                console.error('Error writing the file:', err);
                bot.sendMessage(chatId, 'An error occurred while processing your request.');
            });

        } catch (error) {
            console.error('An error occurred while processing the request:', error);
            bot.sendMessage(chatId, 'An error occurred while processing your request.');
        }
    });

    bot.on('message', (msg) => {
        console.log('Received message:', msg);
    });
};
