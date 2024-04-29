const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');


const loopModes = ['off', 'track', 'queue', 'autoplay']

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Set a loop mode for the queue.')
        .addIntegerOption(option =>
            option.setName('mode')
                .setDescription('The loop mode to set.')
                .setRequired(true)
                .addChoices(
                    { name: 'off', value: 0 },
                    { name: 'track', value: 1 },
                    { name: 'queue', value: 2 },
                    { name: 'autoplay', value: 3 }
                )),
    async execute({ client, interaction }) {

        const queue = useQueue(interaction.guildId);
        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: 'No music is being played!', ephemeral: true });
        }

        const mode = interaction.options.getInteger('mode');

        queue.setRepeatMode(mode);

        return interaction.reply({ content: `Set loop mode to **${loopModes[mode]}**` });
    },
};