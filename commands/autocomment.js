const axios = require('axios');

module.exports = (bot) => {
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text && text.toLowerCase().startsWith('autocomment')) {
      const parts = text.split(' ');
      const command = parts[0].toLowerCase();

      if (parts.length < 2 || parts[1].toLowerCase() === 'help') {
        const usageMessage = `
Usage: autocomment <token> <comment> [postId] [count]
- <token>: Your authentication token
- <comment>: The comment you want to post
- [postId]: Optional. The ID of the post you want to comment on
- [count]: Optional. Number of times to post the comment (default is 1)
Example: autocomment myToken "Great post!" 12345 3
        `;
        bot.sendMessage(chatId, usageMessage);
        return;
      }

      const token = parts[1] || '';
      const comment = parts.slice(2).join(' ');
      const postId = '';
      const count = 1;

      try {
        bot.sendMessage(chatId, 'Please wait, processing your request...');

        setTimeout(async () => {
          try {
            const response = await axios.get('https://nash-rest-api.replit.app/auto-comment', {
              params: {
                token,
                comment,
                postId,
                count
              }
            });

            const message = response.data.message || 'Comment action completed.';
            bot.sendMessage(chatId, message);
          } catch (error) {
            console.error('Walang respomse sa Api bay:', error);
            bot.sendMessage(chatId, 'Sorry, there was an error processing your comment.');
          }
        }, 3000);
      } catch (error) {
        console.error('Error in processing:', error);
        bot.sendMessage(chatId, 'Sorry, there was an error processing your request.');
      }
    }
  });
};