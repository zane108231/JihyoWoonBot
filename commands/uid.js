module.exports = (bot) => {
  bot.onText(/\/uid/, (msg) => {
    const chatId = msg.chat.id;
    const uidMessage = `Your Uid is here mother fucker: ${chatId}`;
    bot.sendMessage(chatId, uidMessage);
  });
};