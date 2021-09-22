const { Client, Message, MessageEmbed } = require("discord.js")
      
module.exports = {
    name: "suggest",
    aliases: ["sugg", "suggestion"],
    description: "Permet d'envoyer une suggestion ,au serveur.",
    categories: "info",
    permissions: "everyone",
    cooldown: 15,
    usage: "suggest <suggestion>",
    /**
     *  @param {Client} client
     *  @param {Message} message
     */

    run: async(client, message) => {
        if (!args[1]) return message.channel.send('```y!suggest <suggestion>```')
            client.channels.cache.get(suggests).send({
            embed: {
                title: `Nouvelle suggestion de ${message.author.username} !`,
                color: client.color,
                timestamp: new Date(),
                thumbnail: {
                    url: message.author.displayAvatarURL()
                },
                footer: {
                    icon_url: client.user.displayAvatarURL(),
                },
                description: `\`\`\`md\n# ${args.join(' ')}\n\`\`\`\n**Réagissez :**\n${client.yes} = Oui\n${bof} = Pourquoi pas ?\n${client.no} = Non`
            }
        }).then(msg => {
            msg.react('838334340618256384')
            msg.react('838334339820945419')
            msg.react('838334340160815104')
            message.channel.send(client.yes + ` | Votre suggestion a bien été envoyée. Allez voir dans le <#${suggests}>.`)
        });
    }
}