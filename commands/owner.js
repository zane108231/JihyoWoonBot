const ownerUsername = '@woonjihyo';

module.exports = (bot) => {
  bot.onText(/\/owner/, (msg) => {
    const chatId = msg.chat.id;
    const message = `
📢 Meet My Owner!
---------------------------------------------
👤 Owner: ${ownerUsername}
---------------------------------------------
If you have any questions, feedback, or need assistance, feel free to reach out!
    `;
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  });
};