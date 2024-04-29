const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song.'),
    async execute({ client, interaction }) {

        const queue = useQueue(interaction.guildId);
        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: 'No music is being played!', ephemeral: true });
        }

        if (queue.node.isPaused()) {
            return interaction.reply({ content: 'The current song is already paused!', ephemeral: true });
        }
        queue.node.setPaused(true);

        return interaction.reply({ content: 'Paused the current song.' });
    },
};