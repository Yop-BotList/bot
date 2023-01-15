import { Interaction, Message, SelectMenuInteraction, ThreadChannel, ChannelType } from "discord.js";
import Class from "..";
import TicketsDM from "../functions/ticketsDM";
import { users, bots, verificators } from "../models";
import FaqModal from "../modals/FaqModal";
import RejectBotModal from "../modals/RejectBotModal";
import SendModal from "../utils/SendModal";
import suggestManager from "../functions/suggestManager";
import { roles, emotes } from "../configs"


export = async (client: Class, interaction: Interaction) => {
    const ticketManager = new TicketsDM(client);

    if (interaction.isChatInputCommand()) {
        const slash = client.slashs.get(interaction.commandName);

        if (!slash) return;

        try {
            await slash.run(client, interaction);
        } catch (err: any) {
            interaction.reply({
                content: "Une erreur s'est produite lors de l'utilisation de cette commande. :\n\n```\n" + err + "```",
                ephemeral: true
            });
            console.log(err.stack)
        }
    }
    if (interaction.isButton()) {
        if (interaction.customId === "faqVerifBtn") {
            const userFind = await users.findOne({ userId: interaction.user.id });

            if (!userFind) new users({
                readFaq: false,
                totalNumbers: 0,
                warns: [],
                avis: null,
                cmdbl: false,
                ticketsbl: false,
                userId: interaction.user.id,
                badges: [
                    {
                        id: "dev",
                        acquired: false
                    }, {
                        id: "partner",
                        acquired: false
                    }, {
                        id: "premium",
                        acquired: false
                    }, {
                        id: "staff",
                        acquired: false
                    }, {
                        id: "support",
                        acquired: false
                    }, {
                        id: "verificator",
                        acquired: false
                    }
                ]
            }).save();

            const userGet = await users.findOne({ userId: interaction.user.id });

            if (userGet!.readFaq === true) return interaction.reply({
                ephemeral: true,
                content: "Vous avez déjà répondu à la faq, vous pouvez aller sur le reste du serveur."
            });

            const faqModal = new FaqModal();
            SendModal(client, interaction, faqModal);
            faqModal.handleSubmit(client, interaction);
        }

        if (interaction.customId === "forSugg") suggestManager("FOR", client, interaction);
        if (interaction.customId === "botSugg") interaction.reply({
            content: "Vous venez juste de voter pour cette suggestion.",
            ephemeral: true
        });
        if (interaction.customId === "againstSugg") suggestManager("AGAINST", client, interaction);
        if (interaction.customId === "suggestThread") {
            interaction.message.edit({
                embeds: interaction.message.embeds,
                components: [interaction.message.components[0]]
            });

            interaction.message.startThread({
                name: `Suggestion de ${interaction.message.embeds[0].title!.split(" ! ")[0].split(" ").slice(3).join(" ")}`
            });
        }

        if (interaction.customId === "buttonTransfer") ticketManager.transfer(interaction);

        if (interaction.customId === "buttonClose") ticketManager.transcript(interaction, interaction.channelId);

        if (interaction.customId.endsWith("bugChangeStatus")) {
            const data = interaction.customId.split(".")

            const db = await bots.findOne({ botId: data[0] })
            //@ts-ignore
            if (!db || !interaction.member!.roles!.cache.has(roles.verificator) && interaction.user.id !== db!.ownerId && db.team && !db.team.includes(interaction.user.id)) return interaction.reply({
                content: `**${client.emotes.no} ➜ Ce bot n'est pas listé ou ne vous appartient pas.**`,
                ephemeral: true
            })

            const bugData = db.bugs.find((x: any) => x.msgId === data[1])
            if (!bugData) return;

            interaction.reply({
                content: `**${client.emotes.question} ➜ Veuillez sélectionner un nouveau statut d'avancement sur la résolution du bug signalé par <@${bugData.submitter}>**`,
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 3,
                                customId: "menuSelectBugStatus",
                                placeholder: "Statuts de bugs",
                                options: [
                                    {
                                        label: "Investigations en cours...",
                                        value: "1",
                                        description: "Votre équipe de développement est actuellement en train de rechercher l'origine de ce bug.",
                                        emoji: { name: "🔍" },
                                        default: bugData.status === 1
                                    },
                                    {
                                        label: "Résolution en cours...",
                                        value: "2",
                                        description: "Votre équipe de développement est actuellement en train de tenter de résoudre ce bug.",
                                        emoji: { name: "💻" },
                                        default: bugData.status === 2
                                    },
                                    {
                                        label: "Correctif publié lors de la prochaine mise à jour",
                                        value: "3",
                                        description: "Votre équipe de développement a résolu ce bug. Il sera corrigé lors de la prochaine mise à jour.",
                                        emoji: { name: "📆" },
                                        default: bugData.status === 3
                                    },
                                    {
                                        label: "Corrigé !",
                                        value: "4",
                                        description: "Ce bug a été corrigé !",
                                        emoji: { name: "✅" },
                                        default: bugData.status === 4
                                    }
                                ]
                            }
                        ]
                    }
                ],
                ephemeral: true,
                fetchReply: true
            }).then(async (msg: Message) => {
                const filter = (x: any) => x.user.id === interaction.user.id && x.customId === "menuSelectBugStatus";
                const collector = await msg.createMessageComponentCollector({ filter, max: 1 })

                collector.on("collect", async (int: SelectMenuInteraction) => {
                    await int.deferUpdate()

                    const oldStatus = bugData.status

                    bugData.status = Number(int.values[0])

                    db.bugs = db.bugs.filter((x: any) => x.msgId !== bugData.msgId)

                    db.bugs.push(bugData)

                    db.save()

                    function getTextStatus(status: number | undefined) {
                        if (status === 0) return "none"
                        if (status === 1) return "En cours d'investigation"
                        if (status === 2) return "En cours résolution"
                        if (status === 3) return "Résolu, publié lors de prochaine màj"
                        if (status === 4) return "Résolu & publié"
                    }

                    interaction.message!.reply({
                        content: `<@${bugData.submitter}>`,
                        embeds: [
                            {
                                footer: {
                                    text: "Version " + client.version
                                },
                                timestamp: new Date().toISOString(),
                                color: client.config.color.integer,
                                description: `<@${interaction.user.id}> a passé le statut de ce bug de \`${getTextStatus(oldStatus)}\` à \`${getTextStatus(bugData.status)}\`.`
                            }
                        ]
                    })

                    interaction.editReply({ content: `**${client.emotes.yes} ➜ Statut modifié.**`, components: [] })

                    if (int.values[0] === "3" || int.values[0] === "4") {
                        let bugLength = db.bugs.filter((x: any) => x.status !== 3 && x.status !== 4).length || 0

                        await interaction.message.edit({
                            content: interaction.message.content,
                            embeds: interaction.message.embeds,
                            components: []
                        })

                        if (bugLength > 0) return;

                        const ch = interaction.channel as ThreadChannel

                        await ch!.edit({
                            archived: true
                        })
                    }
                })
            })
        }

        if (interaction.customId === "AcceptBot") {
            // @ts-ignore
            if (!interaction.member!.roles!.cache.has(roles.verificator) && !client.config.owners.includes(interaction.user.id)) return interaction.reply({
                content: `**${client.emotes.no} ➜ Vous n'avez pas le rôle requis pour utiliser cette commande.**`,
                ephemeral: true
            })

            const adb = await bots.findOne({ msgID: interaction.message.id })

            if (!adb) {
                return interaction.reply({ content: `Impossible de retrouver L'ID de l'embeds.`, ephemeral: true })
            }

            if (adb) {

                const member_guild = await interaction.guild?.members.cache.get(adb.botId)
                if (!member_guild) return interaction.reply({
                    content: `Impossible d'accepter le bot <@${adb.botId}> car il n'est pas présent sur le serveur.`,
                    ephemeral: true
                })

                await bots.findOneAndUpdate({ botId: adb.botId }, { $unset: { msgID: String() } })
                await bots.findOneAndUpdate({ botId: adb.botId }, { $set: { verified: true } })

                // @ts-ignore
                interaction.guild.channels.cache.get(interaction.channel.id).messages.fetch(interaction.message.id).then(async (msg) => {
                    msg.edit({ components: [] })
                    // @ts-ignore
                    interaction.channel.send({
                        // @ts-ignore
                        content: `<@${adb.ownerId}>`, embeds: [
                            {
                                title: "Acceptation...",
                                timestamp: new Date().toISOString(),
                                thumbnail: {
                                    url: member_guild.user.displayAvatarURL()
                                },
                                color: 0x00FF2A,
                                footer: {
                                    text: `Pense à laisser un avis au serveur via la commande ${client.config.prefix}avis send <ton avis> ^^`
                                },
                                description: `${interaction.user} vient juste d'accepter le bot ${member_guild.user.username} !`
                            }
                        ]
                    })
                })
            }
        }

        if (interaction.customId === "RejectBot") {
            // @ts-ignore
            if (!interaction.member!.roles!.cache.has(roles.verificator) && !client.config.owners.includes(interaction.user.id)) return interaction.reply({
                content: `**${client.emotes.no} ➜ Vous n'avez pas le rôle requis pour utiliser cette commande.**`,
                ephemeral: true
            })

            const adb = await bots.findOne({ msgID: interaction.message.id })

            if (!adb) {
                return interaction.reply({ content: `Impossible de retrouver L'ID de l'embeds.`, ephemeral: true })
            }

            if (adb) {
                const member = await client.users.fetch(adb.botId).catch(error => {
                })
                if (!member) return interaction.reply({
                    content: `Impossible de refuser ce robot, il n'est peut être plus dans la liste ou alors le robot a été supprimé.`,
                    ephemeral: true
                })

                const rejectBot = new RejectBotModal();
                SendModal(client, interaction, rejectBot);
                rejectBot.handleSubmit(client, interaction);

            }
        }
    }

    if (interaction.isStringSelectMenu()) {
        await interaction.deferUpdate();
        if (interaction.customId === 'notifs_mps') {
            const user = await users.findOne({ userId: interaction.user.id })


            if (interaction.values.includes("suggestion")) {
              if (user) await users.findOneAndUpdate({ userId: interaction.user.id }, { $pull: { notifs: { "name": "suggestion" } } }, { upsert: false })

              if (user) await users.findOneAndUpdate({ userId: interaction.user.id }, { $push: { notifs: { "name": "suggestion", 'acquired': true } } }, { upsert: false })
            }

            if (!interaction.values.includes("suggestion")) {
                if (user)   await users.findOneAndUpdate({ userId: interaction.user.id }, { $pull: { notifs: { "name": "suggestion" } } }, { upsert: false })

                if (user)   await users.findOneAndUpdate({ userId: interaction.user.id }, { $push: { notifs: { "name": "suggestion", 'acquired': false } } }, { upsert: false })
            }

            if (interaction.values.includes("reverification")) {
                await users.findOneAndUpdate({ userId: interaction.user.id }, { $pull: { notifs: { "name": "reverification" } } }, { upsert: false })

                await users.findOneAndUpdate({ userId: interaction.user.id }, { $push: { notifs: { "name": "reverification", 'acquired': true } } }, { upsert: false })
            }

            if (!interaction.values.includes("reverification")) {
                await users.findOneAndUpdate({ userId: interaction.user.id }, { $pull: { notifs: { "name": "reverification" } } }, { upsert: false })

                await users.findOneAndUpdate({ userId: interaction.user.id }, { $push: { notifs: { "name": "reverification", 'acquired': false } } }, { upsert: false })
            }

            if (interaction.values.includes("newbugs")) {
                await users.findOneAndUpdate({ userId: interaction.user.id }, { $pull: { notifs: { "name": "newbugs" } } }, { upsert: false })

                await users.findOneAndUpdate({ userId: interaction.user.id }, { $push: { notifs: { "name": "newbugs", 'acquired': true } } }, { upsert: false })
            }

            if (!interaction.values.includes("newbugs")) {
                await users.findOneAndUpdate({ userId: interaction.user.id }, { $pull: { notifs: { "name": "newbugs" } } }, { upsert: false })

                await users.findOneAndUpdate({ userId: interaction.user.id }, { $push: { notifs: { "name": "newbugs", 'acquired': false } } }, { upsert: false })
            }

            if (interaction.values.includes("sanction")) {
                await users.findOneAndUpdate({ userId: interaction.user.id }, { $pull: { notifs: { "name": "sanction" } } }, { upsert: false })

                await users.findOneAndUpdate({ userId: interaction.user.id }, { $push: { notifs: { "name": "sanction", 'acquired': true } } }, { upsert: false })
            }

            if (!interaction.values.includes("sanction")) {
                await users.findOneAndUpdate({ userId: interaction.user.id }, { $pull: { notifs: { "name": "sanction" } } }, { upsert: false })

                await users.findOneAndUpdate({ userId: interaction.user.id }, { $push: { notifs: { "name": "sanction", 'acquired': false } } }, { upsert: false })
            }

            if (interaction.values.includes("counter")) {
                await users.findOneAndUpdate({ userId: interaction.user.id }, { $pull: { notifs: { "name": "counter" } } }, { upsert: false })

                await users.findOneAndUpdate({ userId: interaction.user.id }, { $push: { notifs: { "name": "counter", 'acquired': true } } }, { upsert: false })
            }

            if (!interaction.values.includes("counter")) {
                await users.findOneAndUpdate({ userId: interaction.user.id }, { $pull: { notifs: { "name": "counter" } } }, { upsert: false })

                await users.findOneAndUpdate({ userId: interaction.user.id }, { $push: { notifs: { "name": "counter", 'acquired': false } } }, { upsert: false })
            }

            if (interaction.channel!.type === ChannelType.GuildText) {
                const channel = await client.channels.fetch(interaction.channelId)
                // @ts-ignore
                const msg = await channel!.messages.edit(interaction.message.id)
                //    await msg.edit({ content: `**${emotes.yes} ➜ Modifications enregistrées !**`, embeds: [], components: [] })

                await interaction.followUp({ content: `** ${emotes.yes} ➜ Modifications enregistrées !**` })
            }
        }
    }
}
