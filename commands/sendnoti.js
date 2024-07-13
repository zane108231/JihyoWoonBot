const fs = require('fs');
const path = require('path');

const ADMIN_CHAT_ID = 6619264979;  // Replace with your Telegram ID
const groupChatsFile = path.join(__dirname, 'group_chats.json');

// Function to load group chats from file
const loadGroupChats = () => {
  if (fs.existsSync(groupChatsFile)) {
    return JSON.parse(fs.readFileSync(groupChatsFile, 'utf8'));
  }
  return [];
};

// Function to save group chats to file
const saveGroupChats = (groupChats) => {
  fs.writeFileSync(groupChatsFile, JSON.stringify(groupChats, null, 2));
};

module.exports = (bot) => {
  // Command to send notification to all group chats
  bot.onText(/\/sendnoti (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const fromId = msg.from.id;
    const notificationMessage = match[1];

    // Only allow broadcasting from the admin chat ID
    if (fromId !== ADMIN_CHAT_ID) {
      bot.sendMessage(chatId, 'You are not authorized to use this command.');
      return;
    }

    // Load group chat IDs from file
    const groupChats = loadGroupChats();

    console.log('Loaded group chats:', groupChats); // Debugging log

    if (groupChats.length === 0) {
      bot.sendMessage(chatId, 'No group chats to send the message to.');
      return;
    }

    bot.sendMessage(chatId, 'Sending notification to all group chats...');

    let sentCount = 0;

    for (const groupId of groupChats) {
      try {
        await bot.sendMessage(groupId, `\n\n ${notificationMessage}`);
        console.log(`Message sent to group chat ${groupId}`);
        sentCount++;
      } catch (error) {
        console.error(`Error sending message to group chat ${groupId}:`, error);
      }
    }

    bot.sendMessage(chatId, `Notification sent to ${sentCount} group(s).`);
  });

  // Track group chats where the bot is added
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // Track group chats
    if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
      let groupChats = loadGroupChats();
      if (!groupChats.includes(chatId)) {
        groupChats.push(chatId);
        saveGroupChats(groupChats);
        console.log(`Added group chat ${chatId}`); // Debugging log
      } else {
        console.log(`Group chat ${chatId} already tracked`); // Debugging log
      }
    }
  });
};
