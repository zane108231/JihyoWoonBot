module.exports = (bot) => {
  bot.onText(/\/uid/, (msg) => {
    const chatId = msg.chat.id; // Get the chat ID
    const userId = msg.from.id; // Get the user ID
    const firstName = msg.from.first_name; // Get the user's first name (optional)

    const uidMessage = `Your UID is here, ${firstName}: ${userId}`;
    bot.sendMessage(chatId, uidMessage);
  });
};
