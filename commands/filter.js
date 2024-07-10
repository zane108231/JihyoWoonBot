const axios = require('axios');

// Object to store filters and replies for each chat
const chatFilters = {};

module.exports = (bot) => {
  // Command to set a filter using message reply
  bot.onText(/\/filter (.+)/, (msg, match) => {
    if (!isAdmin(msg)) {
      return;
    }

    const chatId = msg.chat.id;
    const filter = match[1].toLowerCase(); // Reply for the filter
    const replyMessage = msg.reply_to_message; // Get the replied message object

    if (!replyMessage) {
      bot.sendMessage(chatId, '');
      return;
    }

    const messageId = replyMessage.message_id;
    const messageText = replyMessage.text || replyMessage.caption; // Get the text or caption of the replied message

    // Initialize filters object for the chat if not already present
    if (!chatFilters[chatId]) {
      chatFilters[chatId] = {};
    }

    // Store the filter and reply in the object specific to the chat
    chatFilters[chatId][messageText.toLowerCase()] = filter;

    bot.sendMessage(chatId, `Filter set for "${messageText}": "${filter}"`);
  });

  // Command to set a filter using explicit text_to_match === reply_message format
  bot.onText(/\/filter (.+) === (.+)/, (msg, match) => {
    if (!isAdmin(msg)) {
      return;
    }

    const chatId = msg.chat.id;
    const textToMatch = match[1].toLowerCase().trim();
    const replyMessage = match[2].trim();

    // Initialize filters object for the chat if not already present
    if (!chatFilters[chatId]) {
      chatFilters[chatId] = {};
    }

    // Store the filter and reply in the object specific to the chat
    chatFilters[chatId][textToMatch] = replyMessage;

    bot.sendMessage(chatId, `Filter set for "${textToMatch}": "${replyMessage}"`);
  });

  // Command to list all filter replies
  bot.onText(/\/filters/, (msg) => {
    if (!isAdmin(msg)) {
      return;
    }

    const chatId = msg.chat.id;
    let response = 'List of all filters:\n';

    if (chatFilters[chatId]) {
      Object.keys(chatFilters[chatId]).forEach((messageText) => {
        const filter = chatFilters[chatId][messageText];
        response += `"${messageText}" => "${filter}"\n`;
      });
    } else {
      response += 'No filters set.';
    }

    bot.sendMessage(chatId, response);
  });

  // Command to remove a filter
  bot.onText(/\/removefilter (.+)/, (msg, match) => {
    if (!isAdmin(msg)) {
      return;
    }

    const chatId = msg.chat.id;
    const filterToRemove = match[1].toLowerCase();

    if (chatFilters[chatId] && chatFilters[chatId][filterToRemove]) {
      delete chatFilters[chatId][filterToRemove];
      bot.sendMessage(chatId, `Filter "${filterToRemove}" removed.`);
    } else {
      bot.sendMessage(chatId, `Filter "${filterToRemove}" not found.`);
    }
  });

  // Responding to messages that match any filter
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text.toLowerCase();

    // Check if the incoming message matches any filter for this chat
    if (chatFilters[chatId] && chatFilters[chatId][message]) {
      // Reply to the user who triggered the filter
      bot.sendMessage(chatId, `@${msg.from.username} ${chatFilters[chatId][message]}`, {
        reply_to_message_id: msg.message_id
      });
    }
  });

  // Function to check if user is an admin
  function isAdmin(msg) {
    // Check if user is an administrator in the chat
    if ('chat' in msg && 'from' in msg && 'id' in msg.chat && 'id' in msg.from) {
      const chatId = msg.chat.id;
      const userId = msg.from.id;

      return bot.getChatMember(chatId, userId)
        .then((chatMember) => {
          return chatMember.status === 'creator' || chatMember.status === 'administrator';
        })
        .catch((error) => {
          console.error('Error checking admin status:', error);
          return false;
        });
    }

    return false;
  }
};
