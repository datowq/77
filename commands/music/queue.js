const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Lists songs in the qwueue.'),
    async execute({ client, interaction }) {

        const queue = useQueue(interaction.guildId);
        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: 'No music is being played!', ephemeral: true });
        }

        let tracks = queue.tracks.toArray(); //Converts the queue into a array of tracks
        const currentTrack = queue.currentTrack; //Gets the current track being played

        tracks = tracks.slice(0, 10); //Gets the first 10 tracks in the queue

        let queueList = '';
        if (tracks.length == 0) {
            queueList = 'No songs in queue.';
        } else {
            queueList = tracks.map((track, i) => `${i + 1}. ${track.title}`).join('\n');
        }


        // console.log(queueList)

        const embed = new EmbedBuilder()
            .setTitle(`Now Playing: **${currentTrack.title}**`)
            .setDescription(`NEXT 10 IN QUEUE:\n${queueList}`)
            .setThumbnail(currentTrack.thumbnail)

        return interaction.reply({ embeds: [embed] });
    },
};