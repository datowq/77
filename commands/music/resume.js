const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the current song.'),
    async execute({ client, interaction }) {

        const queue = useQueue(interaction.guildId);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: 'No music is being played!', ephemeral: true });
        }

        if (!queue.node.isPaused()) {
            return interaction.reply({ content: `**${queue.currentTrack.title}** is already playing!`, ephemeral: true });
        }
        queue.node.setPaused(false);

        return interaction.reply({ content: `Resumed the song: **${queue.currentTrack.title}**` });
    },
};