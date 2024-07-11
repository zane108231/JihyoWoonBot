const axios = require('axios');

module.exports = (bot) => {
    bot.onText(/\/genmicrosoft (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const name = match[1];

        try {
            // Fetch account details from the API
            const response = await fetch(`https://joshweb.click/api/genmicro?name=${encodeURIComponent(name)}`);
            const data = await response.json();

            // Check if the response status is true
            if (data.status) {
                // Extract email and password from the response
                const { email, password } = data.result;

                // Format the account details
                const accountInfo = `
Generated Account:
Email: ${email}
Password: ${password}
                `;

                // Send the account details to the chat
                bot.sendMessage(chatId, accountInfo);
            } else {
                // Handle unsuccessful response
                bot.sendMessage(chatId, 'Failed to generate account. The API returned an unsuccessful status.');
            }
        } catch (error) {
            // Handle errors
            bot.sendMessage(chatId, 'Failed to generate account. Please try again later.');
            console.error(error);
        }
    });

    // Optional: Handle the case when the user does not provide a name
    bot.onText(/\/genmicro$/, (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'Please provide a name. Usage: /genmicro <name>');
    });
};
