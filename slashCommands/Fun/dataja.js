const { ContextMenuInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'dataja',
    description: 'Don’t ask to ask, juste ask !',

    /** 
     * @param {Client} client 
     * @param {ContextMenuInteraction} interaction
     */
    run: async(client, interaction) => {
         interaction.followUp({ content: '"Ne demande pas si tu peux demander, mais demande directement. Ça nous fait gagner du temps."\n*Source : <https://dontasktoask.com/>*' })
    },
};
