const Discord = require('discord.js'),
      { suggests } = require('../configs/channels.json'),
      { bof } = require('../configs/emojis.json');

exports.run = async (client, message, args) => {
    if (!args[1]) {
        message.channel.send('```y!suggest <suggestion>```')
    } else {
        client.channels.cache.get(suggests).send({
        embed: {
            title: `Nouvelle suggestion de ${message.author.username} !`,
            color: client.color,
            timestamp: new Date(),
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

exports.help = {
    name: "suggest",
    category: "utils"
}