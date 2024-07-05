const express = require('express');
const path = require('path');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const rainbowColors = [
  '\x1b[31m', // Red
  '\x1b[33m', // Yellow
  '\x1b[32m', // Green
  '\x1b[36m', // Cyan
  '\x1b[34m', // Blue
  '\x1b[35m', // Magenta
];

const rainbowText = (text) => {
  let colorIndex = 0;
  return text.split('').map(char => {
    if (char === ' ') return char;
    const color = rainbowColors[colorIndex];
    colorIndex = (colorIndex + 1) % rainbowColors.length;
    return color + char;
  }).join('') + '\x1b[0m';
};

const logo = `
${rainbowText('███╗░░██╗░█████╗░░██████╗██╗░░██╗')}
${rainbowText('████╗░██║██╔══██╗██╔════╝██║░░██║')}
${rainbowText('██╔██╗██║███████║╚█████╗░███████║')}
${rainbowText('██║╚████║██╔══██║░╚═══██╗██╔══██║')}
${rainbowText('██║░╚███║██║░░██║██████╔╝██║░░██║')}
${rainbowText('╚═╝░░╚══╝╚═╝░░╚═╝╚═════╝░╚═╝░░╚═╝')}
`;

const credits = `
${rainbowText('╔══════════════════════════╗')}
${rainbowText('║ Credits: Jihyo Woon. ║')}
${rainbowText('╚══════════════════════════╝')}
`;

const token = '7298983210:AAHxiiwTnciv2odUzcLLj5xIJ2x0BMOQbEw';
const bot = new TelegramBot(token, { polling: true });

const commandsPath = path.join(__dirname, 'commands');

const loadCommands = () => {
  fs.readdir(commandsPath, (err, files) => {
    if (err) {
      console.error(rainbowText('Error reading commands directory:'), err);
      return;
    }

    files.forEach(file => {
      if (path.extname(file) === '.js') {
        const command = require(path.join(commandsPath, file));
        command(bot);
        console.log(rainbowText(`Loaded command: ${path.basename(file, '.js')}`));
      }
    });
  });
};

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(rainbowText(`HTTP server is running on port ${port}`));
});

console.log(logo);
console.log(credits);
loadCommands();

bot.on('polling_error', (error) => {
  console.log(rainbowText(`Polling error: ${error.code}`));
});

console.log(rainbowText('NashBot is running...'));