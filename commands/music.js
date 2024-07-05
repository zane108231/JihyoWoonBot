const axios = require('axios');

module.exports = (bot) => {
    bot.onText(/\/music (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const searchQuery = match[1];

        const clientId = '5cc03b6b3f894e308fd4ce1ccad22814';
        const clientSecret = 'b74b20aec84a4028bfa8a3c5f25c5cd5';

        // Function to obtain access token from Spotify API
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
            const fileName = `${track.name} - ${track.artists[0].name}.mp3`;

            // Example code to handle downloading and sending the track...
            // Replace with actual logic to handle downloading and sending the track
            // For Telegram, you'll need to send an audio file
            // bot.sendAudio(chatId, track.preview_url, { caption: 'Your caption here' });

            bot.sendMessage(chatId, `Title: ${track.name}\nArtist: ${track.artists[0].name}\nPreview URL: ${track.preview_url}`);

        } catch (error) {
            console.error('An error occurred while processing the request:', error);
            bot.sendMessage(chatId, 'An error occurred while processing your request.');
        }
    });

    // Optional: Add more command handlers or bot event listeners as needed

    // Start listening for messages
    bot.on('message', (msg) => {
        console.log('Received message:', msg);
    });
};
