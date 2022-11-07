import { ButtonInteraction, ChannelType, Message } from "discord.js";
import Class from "../..";
import Command from "../../utils/Command";
import { channels, roles } from "../../configs";
import { bots } from "../../models";

class Botadd extends Command {
    constructor() {
        super({
            name: "botadd",
            category: "Botlist",
            description: "Ajoute un bot à la liste.",
            usage: "botadd <id> <prefix>",
            aliases: ["addbot"],
            cooldown: 10,
            minArgs: 2
        });
    }

    async run(client: Class, message: Message, args: string[]): Promise<Message<boolean> | undefined> {
        if (message.mentions.members?.first() || message.mentions.users.first()) return message.reply({ content: `**${client.emotes.no} ➜ Désolé je ne prend pas en charge les mentions.**` });

        const user = await client.users.fetch(args[0]).catch(() => null);
        if (!user) return message.reply({ content: `**${client.emotes.no} ➜ Je ne trouve pas l'utilisateur.**` });
        if (!user.bot) return message.reply({ content: `**${client.emotes.no} ➜ Cet utilisateur n'est pas un bot.**` });

        const channel = client.channels.cache.get(channels.botslogs);
        if (channel?.type !== ChannelType.GuildText) throw new Error("Le channel botslogs n'est pas un channel textuel ou n'a pas été trouvé.");

        const userBots = await bots.find({ ownerId: message.author.id });

        if ((userBots.length > 0) && !message.member?.roles.cache.has(roles.premium)) return message.reply({
            content: `**${client.emotes.no} ➜ Vous ne pouvez pas ajouter un deuxième bot car vous ne possédez pas le role premium (voir <#${channels.faq}> N°7 pour plus d'informations).**`
        });

        if (await bots.findOne({ botId: user.id })) return message.reply({ content: `**${client.emotes.no} ➜ Ce bot est déjà dans la liste.**` });

        let team: string[] = [];

        const msg = await message.reply({
            content: `**${client.emotes.question} ➜ Êtes-vous le seul propriétaire/développeur de ${user.username} ?**`,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 3,
                            label: 'Oui',
                            custom_id: 'btnYes'
                        }, {
                            type: 2,
                            style: 4,
                            label: 'Non',
                            custom_id: 'btnNo'
                        }
                    ]
                }
            ]
        });

        const filter = (x: any) => x.user.id === message.author.id;
        const collector = await msg.createMessageComponentCollector({ filter });

        collector.on("collect", async (interaction: ButtonInteraction) => {
            await interaction.deferUpdate()

            if (interaction.customId === 'btnYes') {
                new bots({
                    botId: user.id,
                    prefix: args[1],
                    ownerId: message.author.id,
                    verified: false,
                    team: team,
                    checked: true,
                    avatar: user.displayAvatarURL(),
                    username: user.username
                }).save();

                channel.send({
                    content: `<@${message.author.id}> / <@&${roles.verificator}>`,
                    embeds: [
                        {
                            title: "Demande d'ajout...",
                            description: `<@${message.author.id}> a demandé à ajouter le bot [${user.username}#${user.discriminator}](https://discord.com/oauth2/authorize?client_id=${user.id}&permissions=0&scope=bot%20applications.commands). Un vérificateur va bientôt s’occuper de lui.`,
                            color: 0x66DA61,
                            thumbnail: {
                                url: user.displayAvatarURL()
                            },
                            timestamp: new Date().toISOString()
                        }
                    ]
                });

                msg.edit({
                    content: `**${client.emotes.yes} ➜ Votre bot \`${user.tag}\` vient juste d'être ajouté à la liste d’attente.**`,
                    components: []
                });

                collector.stop();
            }

            if (interaction.customId === "btnNo") {
                msg.edit({
                    content: `**${client.emotes.question} ➜ Veuillez mentionner l’un des autres propriétaire/développeur de ${user.username}.**`,
                    components: []
                });

                const messageFilter = (x: any) => x.author.id === message.author.id;
                const messageCollector = message.channel.createMessageCollector({ filter: messageFilter });

                messageCollector.on("collect", async (m: Message) => {
                    let teammate = m.mentions.users.first();

                    if (m.content !== 'cancel' && !teammate) return msg.reply({
                        content: `**${client.emotes.no} ➜ Utilisateur introuvable.**`
                    }).then(async (mm) => {
                        m.delete();

                        setTimeout(() => {
                            return mm.delete();
                        }, 2500);
                    });

                    if (teammate?.bot === true) return msg.reply({
                        content: `**${client.emotes.no} ➜ Merci de mentionner un humain.**`
                    }).then(async (mm) => {
                        m.delete();

                        setTimeout(() => {
                            return mm.delete();
                        }, 2500);
                    });

                    if (teammate?.id === message.author.id) return msg.reply({
                        content: `**${client.emotes.no} ➜ Merci de ne pas vous mentionner.**`
                    }).then(async (mm) => {
                        m.delete();

                        setTimeout(() => {
                            return mm.delete();
                        }, 2500);
                    });

                    if (m.content === 'cancel') {
                        msg.edit({
                            content: `**${client.emotes.yes} ➜ Ajout de robot à la liste annulé.**`
                        });

                        m.delete();

                        collector.stop();
                        return messageCollector.stop();
                    }

                    team.push(teammate!.id);
                    m.delete()

                    msg.edit({
                        content: `**${client.emotes.question} ➜ Souhaitez-vous ajouter un autre propriétaire/développeur ?**`,
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 2,
                                        style: 3,
                                        label: 'Oui',
                                        custom_id: 'btnNo'
                                    }, {
                                        type: 2,
                                        style: 4,
                                        label: 'Non',
                                        custom_id: 'btnYes'
                                    }
                                ]
                            }
                        ]
                    });

                    messageCollector.stop();
                });
            }
        });
    }
}

export = new Botadd;