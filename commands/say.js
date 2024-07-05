const axios = require('axios');

module.exports = (bot) => {
  bot.onText(/\/broadcast (.+)/, async (msg, match) => {
    const adminChatId = msg.chat.id;
    const broadcastMessage = match[1];

    try {
      bot.sendMessage(adminChatId, 'Broadcasting message to all users...');

      // Fetch all chat IDs that are currently using your bot
      const commands = await bot.getMyCommands();
      commands.forEach(command => {
        const chatId = command.chat.id;
        axios.post(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
          chat_id: chatId,
          text: broadcastMessage,
          parse_mode: 'HTML'
        }).then(response => {
          console.log(`Message sent to ${chatId}`);
        }).catch(error => {
          console.error(`Error sending message to ${chatId}:`, error);
        });
      });

      bot.sendMessage(adminChatId, 'Broadcast completed successfully.');
    } catch (error) {
      console.error('Error fetching commands:', error);
      bot.sendMessage(adminChatId, 'Sorry, there was an error broadcasting the message.');
    }
  });
};
