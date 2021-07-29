const Discord = require('discord.js'),
      config = require('../configs/config.json')

exports.run = async (client, message, args) => {
        if (message.author.id !== config.owner) return message.channel.send(client.no + " | Vous n'avez pas la permission d'utiliser cette commande.")
        if (!args[0]) return message.channel.send("```y!eval <code>```")
    	if (message.content.toLowerCase().match(`token`)) return message.channel.send(client.no + " | Attention ! J'ai détecté le mot `token` dans ton message. Évite cela si tu veux garder ton accès à cette commande.")
        if(message.content.toLowerCase().match('client.destroy()')) return message.channel.send(client.no + " | Attention ! J'ai détecté le mot `client.destroy()` dans ton message. Évite cela si tu veux garder ton accès à cette commande.")
        if(message.content.toLowerCase().match('removerole')) return message.channel.send(client.no + " | Attention ! J'ai détecté le mot `removerole` dans ton message. Évite cela si tu veux garder ton accès à cette commande.")
        if(message.content.toLowerCase().match("addrole")) return message.channel.send(client.no + " | Attention ! J'ai détecté le mot `addrole` dans ton message. Évite cela si tu veux garder ton accès à cette commande.")

        message.channel.send({
            embed: {
                title: 'Évaluation d\'un code en Javascript :',
                color: client.color,
                timestamp: new Date(),
                fields: [
                    {
                        name: ':inbox_tray: Entrée :',
                        value: `\`\`\`js\n${args.join(' ')}\`\`\``,
                        inline: false,
                    },
                    {
                        name: ':outbox_tray: Sortie :',
                        value: `\`\`\`js\n${eval(args.join(' '))}\`\`\``,
                        inline: false,
                    },
                ]
            }
        });
}

exports.help = {
    name: "eval",
    category: "owner",
    aliases: ["e"],
    description: "Évaluer un code en Javascript.",
    usage: "eval <code>",
    example: ["eval message.reply('Salut à toi :wave: !')"]
}