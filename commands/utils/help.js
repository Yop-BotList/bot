'use strict';

const Command = require("../../structure/Command.js");
const config = require('../../config.json')

class Help extends Command {
    constructor() {
        super({
            name: 'help',
            category: 'utils',
            description: "Plus besoin de l'expliquer !",
            usage: 'help <commande>',
            example: ['help', 'help ping'],
            aliases: ['h', 'aide']
        });
    }

    async run(client, message, args) {
        if (!args[1]) {
            await message.channel.send({
                embed: {
                    color: config.color,
                    title: `Liste des commandes de : ${client.user.username}`,
                    thumbnail: {
                        url: client.user.displayAvatarURL()
                    },
                    description: `Utilisez \`y!help (commande)\` pour obtenir plus d´informations.`,
                    fields: [
                        {
                            name: "❱ Utilitaires :",
                            value: client.commands.filter((command) => command.category === "utils").map((command) => `\`${command.name}\``).join(', '),
                           
                            inline: true,
                        },
                        {
                            name: '❱ STAFF :',
                            value: client.commands.filter((command) => command.category === "staff").map((command) => `\`${command.name}\``).join(', '),
                            inline: true,
                        },
                        {
                            name: "❱ Commandes Développeur :",
                            value: client.commands.filter((command) => command.category === "dev").map((command) => `\`${command.name}\``).join(', '),
                            inline: false,
                        },
                    ],
                    footer: {
                        text: client.footer
                    },

                }
            })
        } else if (args[1]) {

            const command = client.commands.find(cmd => cmd.aliases.includes(args[1])) || client.commands.get(args[1]);
            if (!command) return message.channel.send(`La commande renseignée est invalide ou n'existe pas.`);
            let send = "";
            command.example.forEach(use => {
                send += 'y!' + use + '\n'
            })
            await message.channel.send({
                embed: {
                    color: config.color,
                    author: {
                        name: `Menu d'aide sur la commande : ` + args[1],
                        icon_url: message.author.displayAvatarURL()
                    },
                    description: `Les arguments contenus entre \`<>\` sont obligatoires et ceux contenus entre \`()\` sont facultatifs.`,
                    footer: {
                        icon_url: client.user.displayAvatarURL(),
                        text: client.user.username
                    },
                    fields: [
                        {
                            name: "Description",
                            value: !command.description ? 'Aucune description renseignée.' : command.description,
                        },
                        {
                            name: "Utilisation(s)",
                            value: !command.usage ? "Aucune utilisation renseignée." : 'y!' + command.usage,
                        },
                        {
                            name: "Example(s)",
                            value: !command.example ? `Pas d'exemple renseigné.` : send,
                        }]
                }
            })
        }
    }
}

module.exports = new Help;