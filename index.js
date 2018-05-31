const TelegramBot = require('node-telegram-bot-api');
const telegramToken = 'xxxxx';
const bot = new TelegramBot(telegramToken, {polling: true})
const fetch = require('node-fetch');
const subs = require('./data.js');

bot.onText(/\/redditnsfw/, (msg) => {
	bot.sendMessage(msg.chat.id, "Welcome", {
		"reply_markup": {
			"keyboard": Object.values(subs).map((sub) => [`r/${sub}`])
			}
	});
});

bot.onText(/r\/.*/, (msg) => {
	const chatId = msg.chat.id;
	const sub = msg.text.substring(2);
	fetch(`https://www.reddit.com/r/${sub ? sub : 'gifs'}/random.json?`)
		.then((res) => res.json())
		.then((body) => {
			const url = (Array.isArray(body) ? body[0] : body).data.children.reduce((mediaUrl, child) => {
				if (mediaUrl) {
					return;
				}
				return child.data.url;

			}, '');
			console.log(`sub: ${sub}, url: ${url}`);
			bot.sendMessage(chatId, url);
		})
});