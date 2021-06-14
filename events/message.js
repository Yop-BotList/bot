const config = require('../configs/config.json'),
      { botlogs } = require('../configs/channels.json');

module.exports = (client, message) =>  {
    if (message.content === "!d bump") {
        setTimeout(() => {
            if (message.embeds.length && message.author.id == '302050872383242240' && message.embeds[ 0 ].description.indexOf("Bump effectué !") > -1) {
                return message.channel.send(client.yes + ` | Merci <@${message.author.id}> pour ton bump !`)
            } else return message.channel.send(client.no + " | Mince, tu es arrivé trop tard ! ")
        }, 1500)
    }
    
    if (message.content.startsWith(client.prefix)) {
        if (message.content.indexOf(client.prefix) !== 0) return;
        const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
    
        const cmd = client.commands.get(command) || client.aliases.get(command);
        if (!cmd) return message.channel.send(client.no + ' | Désolé, mais je ne trouve pas cette commande.');
        if (cmd) {
            if (message.author.bot && config.botsAllowed === false) return message.channel.send('**' + client.no + ' | Désolé, mais je suis configuré pour ne pas répondre aux autres bots.**');
            if (message.channel.type === 'dm') return message.channel.send(client.no + " | Désolé, mais mes commandes sont utilisables uniquement dans un serveur.")
            client.channels.cache.get(botlogs).send({
                embed: {
                    title: "Utilisation d'un commande",
                    thumbnail: client.user.displayAvatarURL(),
                    color: client.color,
                    timestamp: new Date(),
                    fields: [
                        {
                            name: "❱ Utilisateur :",
                            value: `\`\`\`${message.author.username}#${message.author.discriminator} (${message.author.id})\`\`\``,
                            inline: false
                        },
                        {
                            name: "❱ Commande :",
                            value: "```" + message.content + "```",
                            inline: false
                        },
                        {
                            name: "❱ Lien",
                            value: `[Cliquez-ici](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}) _Il se peut que cette personne aie supprimé ou édité son message._`,
                            inline: false
                        }
                    ]
                }
            })
            cmd.run(client, message, args)
        }
    }
}