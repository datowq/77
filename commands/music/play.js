const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song in your current voice channel.')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The name or URL of the song or playlist you want to play.')
                .setRequired(true)),
    async execute({ client, interaction }) {

        const player = useMainPlayer();

        const channel = interaction.member.voice.channel;
        const song = interaction.options.getString('song', true);

        if (!channel) {
            return interaction.reply('You need to join a voice channel first!');
        }

        // let's defer the interaction as things can take time to process
        await interaction.deferReply();

        try {
            await player.play(channel, song, {
                nodeOptions: {
                    metadata: interaction.channel
                },
                volume: 70
            });

            return interaction.followUp("yippe!");
        } catch (e) {
            // let's return error if something failed
            return interaction.followUp(`Something went wrong: ${e}`);
        }

    },
};
