const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song in your current voice channel.')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The URL of the song you want to play.')
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

        const searchResult = await player.search(song, { requestedBy: interaction.user });

        if (!searchResult.hasTracks()) {
            // If player didn't find any songs for this query
            await interaction.editReply(`We found no tracks for **${song}!**`);
            return;
        } else {
            try {
                const songInfo =
                    await player.play(channel, searchResult, {
                        nodeOptions: {
                            metadata: interaction
                        },
                        volume: 23
                    });
                if (songInfo.track.raw.queryType === 'spotifySong') {

                    if (!songInfo.track.metadata.bridge) {
                        return interaction.followUp(`Could only find song on Spotify, which I can't stream :cry:`);
                    }

                    let bridgedURL = songInfo.track.metadata.bridge.permalink_url
                    if (!bridgedURL) {
                        return interaction.followUp(`Could only find song on Spotify, which I can't stream :cry:`);
                    }

                    // console.log("=======================")
                    // console.log(bridgedURL)
                    try {
                        await player.play(channel, bridgedURL, {
                            nodeOptions: {
                                metadata: interaction
                            },
                            volume: 23,
                        })
                    } catch (e) {
                        // let's return error if something failed
                        return interaction.followUp(`Could not find song :cry:`);
                    }
                }

                await interaction.editReply(`Queued up: **${songInfo.track.title}** by **${songInfo.track.author}**.`);

                const embed = new EmbedBuilder()
                    .setTitle('Now Playing')
                    .setDescription(`[${songInfo.track.title}](${songInfo.track.url})`)

                // Send the embed
                return interaction.channel.send({ embeds: [embed] });

                // console.log("=======================")
                // console.log(songInfo.track)
            } catch (e) {
                // let's return error if something failed
                return interaction.followUp(`Something went wrong: ${e}`);
            }
        }
    },
};
