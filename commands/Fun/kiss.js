const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "kiss",
    categories: "fun",
    permissions: "everyone",
    description: "Embrasser un autre membre",
    aliases: [],
    usage: "kiss <utilisateur>",
    
    /**
    * @param {Message} message
    * @param {Client} client
    * @param {String[]} args
    */
    run: async (client, message, args) => { 
       const member = message.mentions.members.fisrt() || message.guild.members.cache.get(args[0]);
        if (!member) return message.reply(`**${client.no} ➜ Qui souhaites-tu embrasser ?**`)
        const kiss = ["https://tenor.com/view/love-cheek-peck-kiss-anime-gif-17382412", "https://tenor.com/view/toloveru-unexpected-surprise-kiss-gif-5372258", "https://tenor.com/view/kiss-anime-shocked-blush-faint-gif-16477767", "https://tenor.com/view/love-anime-kiss-hot-damn-gif-9838409", "https://tenor.com/view/yes-love-couple-kiss-in-love-gif-15009390", "https://tenor.com/view/anime-kissing-kiss-love-gif-10356314", "https://tenor.com/view/anime-kiss-gif-13221050"],
              e = new MessageEmbed()
        .setTitle(`${message.author.id} embrasse ${member.user.username}`)
        .setTimestamp(new Date())
        .setImage(kiss[Math.floor(Math.random() * kiss.length)])
        
        message.reply({ content: `<@${member.user.id}>`, embeds: [e] });
    }
}
