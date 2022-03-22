require("dotenv").config();
const fetch = require("node-fetch");
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply(`Pong! ${client.ws.ping}ms :ping_pong:`);
	} else if (commandName === 'serverstatus') {

    const res = await fetch(`https://${process.env.WEBSITE_URL}/api/client/servers/${process.env.serverId}/resources`, {
      method: "GET",
      headers: {"Authorization": `Bearer ${process.env.APIKEY}`, "Content-Type": "application/json", "Accept": "application/json"}
    });

    const powerstate = await res.json();

		await interaction.reply(powerstate.attributes.current_state);

	} else if (commandName === 'sendcommand') {
    const Command = interaction.getString('command');
		const res = await fetch(`https://${process.env.WEBSITE_URL}/api/client/servers/${process.env.serverId}/command`, {
      method: "POST",
      body: JSON.stringify({command: Command}),
      headers: {"Authorization": `Bearer ${process.env.APIKEY}`, "Content-Type": "application/json", "Accept": "application/json"}
    });

    if(res.status == 502) return await interaction.reply('Server must be online to send a command');
    
    await interaction.reply("THE COMMAND HAS BEEN SENT");
	} else if(commandName == 'setpowerstate') {
    const powerstate = interaction.getString('powerstate');
    if(!["start", "stop", "kill", "restart"].includes(powerstate.toLowerCase())) return await interaction.reply("Power State must be: 'start', 'stop', 'kill' or 'restart'");

    const res = await fetch(`https://${process.env.WEBSITE_URL}/api/client/servers/${process.env.serverId}/power`, {
      method: "POST",
      body: JSON.stringify({signal: powerstate}),
      headers: {"Authorization": `Bearer ${process.env.APIKEY}`, "Content-Type": "application/json", "Accept": "application/json"}
    });

    await interaction.reply("THE POWER STATE HAS BEEN SET");
  } else if(commandName == 'usagedetails') {
    const res = await fetch(`https://${process.env.WEBSITE_URL}/api/client/servers/${process.env.serverId}/resources`, {
      method: "GET",
      headers: {"Authorization": `Bearer ${process.env.APIKEY}`, "Content-Type": "application/json", "Accept": "application/json"}
    });

    const usage = await res.json();

    await interaction.reply(`CPU: ${usage.attributes.resources.cpu_absolute}%\nRAM: ${usage.attributes.resources.memory_bytes} bytes`);
  }
});

client.login(process.env.TOKEN);