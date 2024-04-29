const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the queue.'),
    async execute({ client, interaction }) {

        const queue = useQueue(interaction.guildId);
        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: 'No music is being played!', ephemeral: true });
        }

        queue.tracks.shuffle();

        return interaction.reply({ content: `Shuffled the queue!` });
    },
};