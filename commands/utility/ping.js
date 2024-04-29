const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute({ client, interaction }) {
        // Roundtrip Latency describes the amount of time a full API roundtrip takes
        // (from the creation of the command message to the creation of the response message)
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        interaction.editReply(`Pong! Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
    },
};