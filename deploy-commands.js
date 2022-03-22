const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Ping command, what did you expect'),
	new SlashCommandBuilder().setName('serverstatus').setDescription('Replies with wheather the server is online or not'),
	new SlashCommandBuilder().setName('sendcommand').setDescription('Sends a command to the server').addStringOption((option) =>
  option
    .setName("command")
    .setDescription("The command to send")
    .setRequired(true)
  ),
  new SlashCommandBuilder().setName('setpowerstate').setDescription('Turns the server on or off').addStringOption((option) =>
  option
    .setName("powerstate")
    .setDescription("The powerstate to set the server to (This should be 'start', 'stop', 'kill' or 'restart'")
    .setRequired(true)
  ),
  new SlashCommandBuilder().setName('usagedetails').setDescription('Gets usage details for the server'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), { body: commands })
	.then(() => console.log('Successfully registered commands.'))
	.catch(console.error);