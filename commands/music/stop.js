const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Clears the queue.'),
    async execute({ client, interaction }) {

        const queue = useQueue(interaction.guildId);
        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: 'No music is being played!', ephemeral: true });
        }

        queue.delete();

        return interaction.reply({ content: 'Cleared the queue.' });
    },
};