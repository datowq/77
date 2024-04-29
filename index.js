// Include necessary secrets
const { TOKEN } = require('./config.json');

// Import the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');

//  Import the necessary discord-player classes
const { Player } = require('discord-player');
require('events').EventEmitter.defaultMaxListeners = 20;

const { BridgeProvider, BridgeSource } = require('@discord-player/extractor');

const bridgeProvider = new BridgeProvider(
	BridgeSource.SoundCloud,
);

// Import file system module
const fs = require('node:fs');
const path = require('node:path');


// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
	],
});

// Create a new Collection to store commands
// A Collection is similar to a Map, but with additional utility methods
// https://discord.js.org/docs/packages/collection/1.5.3/Collection:Class
client.commands = new Collection();

// Add the commands to the client.commands Collection
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Create a new Player instance
client.player = new Player(client, {
	bridgeProvider: bridgeProvider,
	leaveOnEmpty: true,
	volume: 70,
});

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, async (readyClient) => {
	console.log(`Logged in as ${readyClient.user.tag}!`);

	// Get all ids of the servers
	const guild_ids = client.guilds.cache.map(guild => guild.id);

	// Construct and prepare an instance of the REST module
	const rest = new REST().setToken(TOKEN);

	await client.player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');

	// and deploy your commands!
	(async () => {
		try {
			console.log(`Started refreshing application (/) commands for ${guild_ids.length} guilds.`);

			for (const guild_id of guild_ids) {
				let data = await rest.put(
					Routes.applicationGuildCommands(client.user.id, guild_id),
					{ body: client.commands.map(command => command.data.toJSON()) },
				);
				console.log(`Successfully reloaded ${data.length} application (/) commands for guild ${guild_id}.`);
			}
		} catch (error) {
			// And of course, make sure you catch and log any errors!
			console.error(error);
		}
	})();
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	// console.log(interaction)

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute({ client, interaction });
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Login to Discord with your app's token
client.login(TOKEN);