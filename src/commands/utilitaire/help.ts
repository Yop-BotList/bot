import { Message } from "discord.js";
import Class from "../..";
import Command from "../../utils/Command";

class Help extends Command {
    constructor() {
        super({
            name: 'help',
            aliases: ['h'],
            category: 'Utilitaire',
            description: 'Affiche la liste des commandes disponibles.',
            usage: 'help [commande]',
            cooldown: 3000
        });
    }
    
    async run(client: Class, message: Message, args: string[]): Promise<Message<boolean>> {
        if (!args[0]) {
            let commandsList = [
                {
                    name: "➜ Utilitaires :",
                    value: client.commands.filter(c => c.category === 'Utilitaire').map(c => `\`${c.name}\``).join(', ')
                }, {
                    name: "➜ Botlist :",
                    value: client.commands.filter(c => c.category === 'Botlist').map(c => `\`${c.name}\``).join(', ')
                }, {
                    name: "➜ Staff :",
                    value: client.commands.filter(c => c.category === 'Staff').map(c => `\`${c.name}\``).join(', ')
                }
            ];
            
            if (client.config.owners.includes(message.author.id)) commandsList.push({
                name: "➜ Développeur :",
                value: client.commands.filter(c => c.category === 'Developpeur').map(c => `\`${c.name}\``).join(', ')
            });
            
            commandsList.push({
                name: "➜ Liens :",
                value: "[GitHub](https://github.com/Nonolanlan1007/Yop-Bot) • [Serveur Support](https://discord.gg/3dQeTg9Vz3) • [Trello](https://trello.com/b/KHmaXsL4/yopbot) • [Signaler un bug](https://github.com/Nonolanlan1007/Yop-Bot/issues/new)"
            });
            
            return message.reply({
                embeds: [
                    {
                        title: `Menu d'aide de ${client.user?.username}`,
                        description: `Voici la liste des commandes disponibles.\n\nPour plus d'informations sur une commande, utilisez \`${client.config.prefix}help [commande]\`.`,
                        color: client.config.color.integer,
                        fields: commandsList,
                        timestamp: new Date().toISOString(),
                        thumbnail: {
                            url: `${message.guild!.iconURL()}`
                        },
                        footer: {
                            text: `YopBot | Version ${client.version}`
                        }
                    }
                ]
            });
        }
        
        let command = client.commands.find(c => c.name === args[0] || c.aliases.includes(args[0]));
        
        if (!command) return message.reply(`**${client.emotes.no} ➜ La commande \`${args[0]}\` n'existe pas.**`);
        
        return message.reply({
            embeds: [
                {
                    title: `Aide de ${command.name}`,
                    description: `<> sont des arguments requis\nEt [] sont des arguments optionnels.`,
                    color: client.config.color.integer,
                    thumbnail: {
                        url: `${message.guild!.iconURL()}`
                    },
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: `YopBot | Version ${client.version}`
                    },
                    fields: [
                        {
                            name: '❱ Description :',
                            value: command.description || 'Aucune description disponible.'
                        }, {
                            name: '❱ Usage :',
                            value: command.usage
                        }, {
                            name: '❱ Catégorie :',
                            value: command.category
                        }, {
                            name: '❱ Cooldown :',
                            value: `${command.cooldown} secondes`
                        }, {
                            name: '❱ Aliases :',
                            value: command.aliases.length > 0 ? command.aliases.map((alias: string) => `\`${alias}\``).join(', ') : 'Aucun alias.'
                        }, {
                            name: '❱ Permissions :',
                            value: command.perms.length > 0 ? command.perms.map((permission: string) => `\`${permission}\``).join(', ') : 'Aucune permission requise.'
                        }, {
                            name: '❱ Exemple :',
                            value: command.exemple || 'Aucun exemple disponible.'
                        }
                    ]
                }
            ]
        });
    }
}

export = new Help;
