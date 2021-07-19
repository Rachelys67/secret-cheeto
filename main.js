const Discord = require("discord.js");
const config = require("./config.json");
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command2 = require(`./commands/${file}`);
	client.commands.set(command2.name, command2);
}
client.on('ready', () => {
	console.log('Ready');
	client.user.setActivity("with Destroying Democracy", {type: "PLAYING"})
});

function processCommand (message) {

	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
}

client.on('message', message => {
	if (message.author.bot) return;
	processCommand(message);
});

client.login(process.env.token);