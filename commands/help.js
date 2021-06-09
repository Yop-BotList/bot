const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    if (!args[0]) {
        return message.channel.send({
            embed: {
                title: "Menu d'aide de " + client.user.username + ' :',
                thumbnail: client.user.displayAvatarURL(),
                color: client.color,
                footer: {
                    text: "YopBot | Version 1.8"
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
}

exports.help =  {
    name: "help",
    category: "utils",
    aliases: ["h", "aide"]
}
