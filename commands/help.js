const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    if (!args[0]) {
        return message.channel.send({
            embed: {
                title: "Menu d'aide de " + client.user.username + ' :',
                thumbnail: {
                    url: client.user.displayAvatarURL()
                },
                color: client.color,
                footer: {
                    text: "YopBot | Version " + client.version
                },
                timestamp: new Date(),
                fields: [
                    {
                        name: "❱ Utilitaires :",
                        value: client.commands.filter(command => command.help.category === "utils").map((command) => `\`${command.help.name}\``).join(", "),
                        inline: true
                    },
                    {
                        name: "❱ BotList :",
                        value: client.commands.filter(command => command.help.category === "botlist").map((command) => `\`${command.help.name}\``).join(", "),
                        inline: true  
                    },
                    {
                        name: "❱ STAFF :",
                        value: client.commands.filter(command => command.help.category === "staff").map((command) => `\`${command.help.name}\``).join(", "),
                        inline: true
                    },
                    {
                        name: "❱ Développeur :",
                        value: client.commands.filter(command => command.help.category === "owner").map((command) => `\`${command.help.name}\``).join(", "),
                        inline: true
                    }
                ]
            }
        })
    }
    if (args[0]) {
        const commandName = args[0].toLowerCase(), 
              command = client.commands.get(commandName) || client.commands.find(x => x.help.aliases && x.help.aliases.includes(commandName))

        if (!command) return message.channel.send(client.no + " | Désolé, mais je ne possède pas cette commande.")
        let aliases,
            examples,
            usage;
        if (!command.help.aliases) {
            aliases = "_Pas d'aliases disponibles sur cette commande..._";
        }
        else {
            aliases = `\`${client.prefix + command.help.aliases.join("`, `")}\``
        }
        if (!command.help.example) {
            examples = "_Pas d'exemples disponibles sur cette commande..._";
        }
        else {
            examples = `\`${client.prefix + command.help.example.join("`, `")}\``
        }
        if (!command.help.usage) {
            usage = "_Pas d'utilisation disponible sur cette commande..._";
        }
        else {
            usage = `\`${client.prefix + command.help.usage}\``
        }
        return message.channel.send({
            embed: {
                title: "Menu d'aide sur la commande " + command.help.name + " :",
                color: client.color,
                timestamp: new Date(),
                thumbnail: {
                    url: client.user.displayAvatarURL()
                },
                description: "> Les arguments entre `<>` sont obligatoire et ceux entre `[]` sont facultatifs.",
                fields: [
                    {
                        name: "❱ Commande :",
                        value: `\`${client.prefix + command.help.name}\``,
                        inline: false
                    },
                    {
                        name: "❱ Description :",
                        value: command.help.description || "_Aucune description définie..._",
                        inline: false
                    },
                    {
                        name: "❱ Utilisation :",
                        value: usage,
                        inline: false
                    },
                    {
                        name: "❱ Exemple :",
                        value: examples,
                        inline: false  
                    },
                    {
                        name: "❱ Catégorie :",
                        value: `\`${command.help.category}\`` || "_Aucune catégorie définie..._",
                        inline: false
                    },
                    {
                        name: "❱ Aliases",
                        value: aliases,
                        inline: false
                    }
                ]
            }
        })
    }
}

exports.help =  {
    name: "help",
    category: "utils",
    aliases: ["h", "aide"],
    description: "Recevoir de l'aide sur les commandes du bot.",
    usage: "help [commande]",
    example: ["help", "help stats"]
}