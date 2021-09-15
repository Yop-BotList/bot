const { ContextMenuInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Show Bot Ping',

    /** 
     * @param {Client} client 
     * @param {ContextMenuInteraction} interaction
     */
    run: async(client, interaction) => {
        try {
            let ping = new MessageEmbed()
            .setDescription(`🏓 Ping : ${client.ws.ping}`)
            .setColor('RANDOM')
            .setTimestamp()

            interaction.followUp({ content: null, embeds : [ping] })
        } catch (e) {
            new Error(e);
        };
    },
};