const { ContextMenuInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Show Bot Ping',

    /** 
     * @param {Client} client 
     * @param {ContextMenuInteraction} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        try {

            let ping = new MessageEmbed()
            .setDescription(`🏓 Ping : ${client.ws.ping}`)
            .setColor('RANDOM')
            .setTimestamp()

            interaction.followUp({embeds : [ping]})
        } catch (e) {
                console.log(e);
        };
    },
};