exports.run = async (client, message, args) => {
    if (!args[0]) {
        return message.channel.send({
            embed: {
                title: "Menu d'aide de " + client.user.username + ' :',
                thumbnail: client.user.displayAvatarURL(),
                footer: {
                    text: "YopBot | Version 1.0"
                },
                timestamp: new Date(),
                fields: [
                    {
                        name: "❱ Utilitaires :",
                        value: client.commands.map((command) => `\`${command.help.name}\``).join(", ")
                    }
                ]
            }
        })
    }
    // if (args[0]) {
    //     const commandName = args[0].toLowerCase(), 
    //           command = client.commands.get(commandName) || client.commands.find(x => x.help.aliases && x.help.aliases.includes(commandName))

    //     if (!command) return message.channel.send(client.no + " | Désolé, mais je ne possède pas cette commande.")
    //     let aliases;
    //     if (!command.help.aliases) {
    //         aliases = "Pas d'aliases.";
    //     }
    //     else {
    //         aliases = command.help.aliases.join(", ")
    //     }
    //     return message.channel.send({
    //         embed: {
    //             title: "Menu d'aide sur la commande " + args[0] + " :",
    //             color: client.color,
    //             timestamp: new Date(),
    //             thumbnail: client.user.displayAvatarURL(),
    //             fields: [
    //                 {
    //                     name: "❱ Commande :",
    //                     value: command.help.name,
    //                     inline: true
    //                 }
    //             ]
    //         }
    //     })
    // }
}

exports.help =  {
    name: "help",
    // aliases: ["h", "aide"]
}