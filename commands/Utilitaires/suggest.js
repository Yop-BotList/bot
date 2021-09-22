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

        const e = new MessageEmbed()
        .setTitle(`Nouvelle suggestion de ${message.author.username} !`)
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setColor(client.color)
        .setTimestamp(new Date())
        .setDescription(`\`\`\`md\n# ${args.join(' ')}\n\`\`\`\n**Réagissez :**\n${client.yes} = Oui\n${bof} = Pourquoi pas ?\n${client.no} = Non`)
            client.channels.cache.get(suggests).send({ embeds: [e] }).then(msg => {
            msg.react('838334340618256384')
            msg.react('838334339820945419')
            msg.react('838334340160815104')
            message.channel.send(client.yes + ` | Votre suggestion a bien été envoyée. Allez voir dans le <#${suggests}>.`)
        });
    }
}
