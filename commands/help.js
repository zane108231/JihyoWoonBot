const fs = require('fs');
const path = require('path');

module.exports = (bot) => {
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const commandFiles = fs.readdirSync(path.join(__dirname)).filter(file => file.endsWith('.js') && file !== 'help.js');

    const commandsList = commandFiles.map(file => {
      const commandName = path.basename(file, '.js');
      return `⊂⊃ ➥ /${commandName}`;
    }).join('\n');

    const helpMessage = `
━━𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂━━
${commandsList}
━━━━━━━━━━━━━━━
━━𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙿𝙰𝙶𝙴 : <1/1>━━
Total commands: ${commandFiles.length}
    `;

    bot.sendMessage(chatId, helpMessage.trim());
  });
};