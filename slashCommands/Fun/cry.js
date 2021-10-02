const { ContextMenuInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'cry',
    description: 'Pleurer devant tout le monde.',

    /** 
     * @param {Client} client 
     * @param {ContextMenuInteraction} interaction
     */
    run: async(client, interaction) => {
         const cry = ["https://tenor.com/view/anime-cry-sad-comfort-gif-12023502", "https://tenor.com/view/cry-sad-why-anime-himouto-gif-5298257", "https://tenor.com/view/sad-anime-crying-tears-cry-gif-17952304", "https://tenor.com/view/anime-anime-cry-anime-sad-anime-sorry-sorry-gif-19978494", "https://tenor.com/view/cry-anime-kawaii-gif-4772697", "https://tenor.com/view/anime-sad-tears-cry-cute-gif-16408575", "https://tenor.com/view/hunter-x-hunter-gon-freecs-sad-crying-tears-gif-16729297"],
              e = new MessageEmbed()
        .setTitle(`<@${message.author.id} chiale comme un gros bébé ! Venez ||pas|| le consoler !`)
        .setTimestamp(new Date())
        .setImage(cry[Math.floor(Math.random() * activities.length)])

         interaction.followUp({ content: null, embeds: [e] })
    },
};
