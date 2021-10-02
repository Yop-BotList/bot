const { Client, Message, MessageEmbed } = requier("discord.js");

module.exports = {
    name: "slap",
    categories: "fun",
    permissions: "everyone",
    description: "Frapper un autre utilisateur.",
    aliases: [],
    usage: "slap <utilisateur>",
    
    /**
    * @param {Message} message
    * @param {Client} client
    * @param {String[]} args
    */
    run: async (client, message, args) => { 
        const member = message.mentions.members.fisrt() || message.guild.members.cache.get(args[0]);
        if (!member) return message.reply(`**${client.no} ➜ Qui souhaites-tu frapper ?**`)
        const slap = ["https://tenor.com/view/chikku-neesan-girl-hit-wall-stfu-anime-girl-smack-gif-17078255", "https://tenor.com/view/mm-emu-emu-anime-slap-strong-gif-7958720", "https://tenor.com/view/slap-handa-seishuu-naru-kotoishi-barakamon-anime-barakamon-gif-5509136", "https://tenor.com/view/fly-away-slap-smack-anime-mad-gif-17845941", "https://tenor.com/view/powerful-head-slap-anime-death-tragic-gif-14358509", "https://tenor.com/view/cass-will-anime-slap-gif-17342897", "https://tenor.com/view/in-your-face-slap-anime-angry-pissed-gif-19408787"],
              e = new MessageEmbed()
        .setTitle(`${message.author.id} frappe ${member.user.username}`)
        .setTimestamp(new Date())
        .setImage(slap[Math.floor(Math.random() * activities.length)])
        
        message.reply({ content: `<@${member.user.id}>`, embeds: [e] });
}
