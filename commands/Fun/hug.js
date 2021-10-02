const { Client, Message, MessageEmbed } = requier("discord.js");

module.exports = {
    name: "hug",
    categories: "fun",
    permissions: "everyone",
    description: "Faire un câlin à quelqu'un !",
    aliases: [],
    usage: "hug <utilisateur>",
    
    /**
    * @param {Message} message
    * @param {Client} client
    * @param {String[]} args
    */
    run: async (client, message, args) => { 
        const member = message.mentions.members.fisrt() || message.guild.members.cache.get(args[0]);
        if (!member) return message.reply(`**${client.no} ➜ À qui souhaites-tu faire un câlin ?**`)
        const hug = ["https://tenor.com/view/anime-cute-hug-gif-14577424", "https://tenor.com/view/tackle-hug-couple-anime-cute-couple-love-gif-17023255", "https://tenor.com/view/hug-k-on-anime-cuddle-gif-16095203", "https://tenor.com/view/hug-anime-gif-19674705", "https://tenor.com/view/teria-wang-kishuku-gakkou-no-juliet-hug-anime-gif-16509980", "https://tenor.com/view/hug-anime-love-sweet-tight-hug-gif-7324587", "https://tenor.com/view/anime-choke-hug-too-tight-gif-14108949"],
              e = new MessageEmbed()
        .setTitle(`${message.author.id} fait un câlin à ${member.user.username}`)
        .setTimestamp(new Date())
        .setImage(hug[Math.floor(Math.random() * activities.length)])
        
        message.reply({ content: `<@${member.user.id}>`, embeds: [e] });
}
