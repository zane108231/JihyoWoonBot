const express = require('express');
const path = require('path');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

// Rainbow text function and logo omitted for brevity

const token = '7395268494:AAGUryHIfvDyOtsqVbM7850WV6bgsmJIt2c';
const bot = new TelegramBot(token, { polling: true, username: true }); // Enable username option

const commandsPath = path.join(__dirname, 'commands');

const loadCommands = () => {
  fs.readdir(commandsPath, (err, files) => {
    if (err) {
      console.error('Error reading commands directory:', err);
      return;
    }

    files.forEach(file => {
      if (path.extname(file) === '.js') {
        const command = require(path.join(commandsPath, file));
        command(bot);
        console.log(`Loaded command: ${path.basename(file, '.js')}`);
      }
    });
  });
};

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`HTTP server is running on port ${port}`);
});

loadCommands();

bot.on('polling_error', (error) => {
  console.log(`Polling error: ${error.code}`);
});

console.log('JihyoBot is running...');
