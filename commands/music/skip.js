const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song.'),
    async execute({ client, interaction }) {

        const queue = useQueue(interaction.guildId);
        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: 'No music is being played!', ephemeral: true });
        }

        queue.node.skip()

        return interaction.reply({ content: `Skipped the current song: ${queue.currentTrack.title}` });
    },
};