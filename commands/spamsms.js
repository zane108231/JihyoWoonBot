    const axios = require('axios');

    module.exports = (bot) => {
        bot.onText(/\/spamsms (.+) (.+) (.+)/, async (msg, match) => {
            const chatId = msg.chat.id;
            const phoneNumber = match[1];
            const smsAmount = match[2];
            const smsDelay = match[3];

            // Construct the URL with your API endpoint
            const apiUrl = 'https://smsbombtoolbyzcdsph.onrender.com';
            const queryParams = `?phoneNumber=${encodeURIComponent(phoneNumber)}&smsAmount=${encodeURIComponent(smsAmount)}&smsDelay=${encodeURIComponent(smsDelay)}`;
            const fullUrl = apiUrl + queryParams;

            try {
                // Make a GET request to the API endpoint
                const response = await axios.get(fullUrl);

                // Handle success response
                const responseData = response.data;
                bot.sendMessage(chatId, `SMS bombing started to ${phoneNumber} with ${smsAmount} SMSs and ${smsDelay} ms delay.`);
            } catch (error) {
                // Handle error
                console.error('Error occurred:', error.message);
                bot.sendMessage(chatId, 'Failed to start SMS bombing. Please try again later.');
            }
        });
    };
