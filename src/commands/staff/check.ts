import { ButtonInteraction, ChannelType, Message } from "discord.js";
import Class from "../..";
import { channels, roles } from "../../configs";
import { bots, verificators } from "../../models/";
import Command from "../../utils/Command";
import { newInfraction } from "../../utils/InfractionService";

class Check extends Command {
    constructor() {
        super({
            name: 'check',
            category: 'Staff',
            description: 'Gérer le système de re-vérification',
            usage: 'check <start | stop | accept | reject> [bot] [raison]',
            botPerms: ["EmbedLinks", "SendMessages", "ReadMessageHistory", "ManageRoles", "ManageNicknames"],
            requiredRole: roles.verificator,
            minArgs: 1
        });
    }

    async run(client: Class, message: Message, args: string[]): Promise<Message<boolean> | undefined> {
        if (!['start', 'stop', 'accept', 'reject'].includes(args[0])) return message.reply({
            content: `**${client.emotes.no} ➜ Veuillez entrer un argument valide.**`
        })

        if (['start', 'stop'] && !message.member!.permissions.has('Administrator')) return message.reply({
            content: `**${client.emotes.no} ➜ Vous ne pouvez pas utiliser cet argument.**`
        })

        if (args[0] === 'start') {
            let oldData = await bots.findOne({ checked: false })

            if (oldData) message.reply({
                content: `**${client.emotes.no} ➜ La re-vérification des bots du serveur n’est pas encore terminée.**`
            })

            const msg = await message.reply({
                content: `**${client.emotes.loading} ➜ Mise en service du système de re-vérification. Cette action peut prendre jusqu’à 5 minutes.**`
            })

            let data = await bots.find({ verified: true });

            let owners: any[] = []

            for (const x of data) {
                if (owners.includes(x.ownerId)) return;
                owners.push(x.ownerId)
                const owner = await client.users.fetch(`${x.ownerId}`);

                await bots.findOneAndUpdate({ botId: x.botId }, { $set: { checked: false } }, { upsert: true })

                setTimeout(() => owner.send({
                    content: `**${client.emotes.no} ➜ Bonjour/Bonsoir !\nLe STAFF de ${message.guild!.name} vient de lancer une opération de re-vérification de tous les robots présents sur la liste. C’est pourquoi je vous informe que votre robot sera lui aussi re-vérifié, et qu’en cas de non respect de nos conditions, celui-ci sera supprimé.**`
                }).catch(() => { }), (Math.random() * (300000 - 3000) + 3000));
            }
            msg.edit({
                content: `**${client.emotes.yes} ➜ Système de re-vérification mis en service. Votre équipe de vérificateurs peut dès maintenant effectuer les re-vérifications avec les commandes \`check accept\` et \`check reject\` qui fonctionnent exactement comme les commandes \`accept\` et \`reject\` !**`
            })
        }

        if (args[0] === 'stop') {
            let oldData = await bots.findOne({ checked: false })

            if (!oldData) message.reply({
                content: `**${client.emotes.no} ➜ Aucune re-vérification des bots n’est en cours.**`
            })

            const msg = await message.reply({
                content: `**${client.emotes.loading} ➜ Arrêt du système de re-vérification. Cette action peut prendre quelques secondes.**`
            })

            let data = await bots.find({ verified: false })

            for (const x of data) {
                await bots.findOneAndUpdate({ botId: x.botId }, { $set: { checked: true } }, { upsert: true })
            }
            msg.edit({
                content: `**${client.emotes.yes} ➜ Système de re-vérification arrêté. Les commandes \`check accept\` et \`check reject\` sont désactivées.**`
            })
        }

        if (args[0] === 'accept') {
            const member = message.mentions.members?.first();
            if (!member?.user.bot) return message.reply({ content: `**${client.emotes.no} ➜ Vous n'avez pas mentionné de bots, ou alors, il n'est pas présent sur le serveur.**` });

            const channel = client.channels.cache.get(channels.botslogs);
            if (channel?.type !== ChannelType.GuildText) throw new Error("Le channel botslogs n'est pas un channel textuel ou n'a pas été trouvé.");

            let getBot = await bots.findOne({ botID: member.user.id, checked: false, verified: true });
            if (!getBot) return message.reply({ content: `**${client.emotes.no} ➜ ${member.user.tag} ne nécessite pas une re-vérification.**` });

            getBot.checked = true;
            getBot.save();

            getBot = await bots.findOne({ botID: member.user.id });

            channel.send({
                content: `<@${getBot!.ownerId}>`,
                embeds: [
                    {
                        title: "Re-vérification",
                        timestamp: new Date().toISOString(),
                        thumbnail: {
                            url: member.user.displayAvatarURL()
                        },
                        color: 0x00FF2A,
                        footer: {
                            text: `Pense à laisser un avis au serveur via la commande ${client.config.prefix}avis ^^`
                        },
                        description: `La re-vérification de ${member.user.username} vient de se terminer. Il continue de respecter les conditions d’ajout.`
                    }
                ]
            });

            message.reply({ content: `**${client.emotes.yes} ➜ Le bot ${member.user.tag} vient bien d'être accepté !**` });

            const verificator = await verificators.findOne({ userId: message.author.id })
            if (verificator) {
                verificator.verifications = verificator.verifications !== undefined ? verificator.verifications + 1 : 1;
                verificator.save();
            }
            if (!verificator) new verificators({
                userId: message.author.id,
                verifications: 1
            }).save()
        }

        if (args[0] === 'reject') {
            const member = await message.guild!.members.fetch(args[1]).catch(() => { });
            if (!member?.user.bot) return message.reply({ content: `**${client.emotes.no} ➜ Vous n'avez pas entré de bots, ou alors, il n'est pas présent sur le serveur.**` });

            const channel = client.channels.cache.get(channels.botslogs);
            if (channel?.type !== ChannelType.GuildText) throw new Error("Le channel botslogs n'est pas un channel textuel ou n'a pas été trouvé.");

            let getBot = await bots.findOne({ botID: member.user.id, checked: false, verified: true });
            if (!getBot) return message.reply({ content: `**${client.emotes.no} ➜ ${member.user.tag} ne nécessite pas une re-vérification.**` })

            let reason = args.slice(2).join(' ')

            if (!reason) return message.reply({ content: `**${client.emotes.no} ➜ Veuillez entrer une raison.**` })

            await bots.findOneAndDelete({ botID: member.user.id });

            channel.send({
                content: `<@${getBot!.ownerId}>`,
                embeds: [
                    {
                        title: "Re-vérification",
                        timestamp: new Date().toISOString(),
                        thumbnail: {
                            url: member.user.displayAvatarURL()
                        },
                        color: client.config.color.integer,
                        description: `La re-vérification de ${member.user.username} vient de se terminer. Il ne respecte malheureusement plus nos conditions. Il a donc été supprimé.`,
                        fields: [
                            {
                                name: 'Raison :',
                                value: `\`\`\`md\n# ${reason}\`\`\``
                            }
                        ]
                    }
                ]
            });

            message.reply({
                content: `**${client.emotes.yes} ➜ Le bot ${member.user.tag} vient bien d'être refusé !**`,
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 1,
                                label: 'Avertir l’utilisateur',
                                custom_id: 'btnWarn',
                                emoji: {
                                    id: "⚠️"
                                }
                            }
                        ]
                    }
                ]
            }).then(async (m) => {
                const filter = (x: any) => x.user.id === message.author.id;
                const collector = await m.createMessageComponentCollector({ filter, time: 30000, max: 1 });
                collector.on('collect', async (interaction: ButtonInteraction) => {
                    if (interaction.customId !== 'btnWarn') return;
                    const user = await client.users.fetch(`${getBot!.ownerId}`);
                    await newInfraction(client, user, message.member!, message.guild!, 'WARN', reason, 0);
                })

                collector.on('end', async () => {
                    m.edit({
                        content: `**${client.emotes.yes} ➜ Le bot ${member.user.tag} vient bien d'être refusé !**`,
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 2,
                                        style: 1,
                                        label: 'Avertir l’utilisateur',
                                        custom_id: 'btnWarn',
                                        emoji: {
                                            id: '⚠️'
                                        },
                                        disabled: true
                                    }
                                ]
                            }
                        ]
                    });
                });
            });

            const verificator = await verificators.findOne({ userId: message.author.id })
            if (verificator) {
                verificator.verifications = verificator.verifications !== undefined ? verificator.verifications + 1 : 1;
                verificator.save();
            }
            if (!verificator) new verificators({
                userId: message.author.id,
                verifications: 1
            }).save()

            if (client.config.autokick === true) member.kick().catch(() => { })
        }
    }
}

export = new Check;