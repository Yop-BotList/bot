import { Message, ButtonInteraction } from "discord.js";
import Class from "../..";
import { channels, config, roles } from "../../configs";
import bots from "../../models/bots";
import verificators from "../../models/verificators";
import Command from "../../utils/Command";
import { newInfraction } from "../../utils/InfractionService"

class Reject extends Command {
    constructor() {
        super({
            name: 'reject',
            aliases: ['rej'],
            category: 'Staff',
            description: 'Refuser un bot de la liste.',
            usage: 'reject <id> <raison>',
            cooldown: 120,
            botPerms: ["EmbedLinks", "SendMessages", "ReadMessageHistory", "ManageRoles", "KickMembers"],
            requiredRole: roles.verificator,
            minArgs: 2
        });
    }

    async run(client: Class, message: Message, args: string[]) {
        if (!args[0]) return message.reply({ content: `**${client.emotes.no} ➜ Merci de me donner un ID de bot valide et présent sur le serveur.**` })
        let member = await client.users.fetch(args[0]).catch(() => null);
        if (!member) return message.reply({ content: `**${client.emotes.no} ➜ Merci de me donner un ID de bot valide et présent sur le serveur.**` })
        let botGet = await bots.findOne({ botId: args[0], verified: false });
        if (!botGet) return message.reply({ content: `**${client.emotes.no} ➜ Aucune demande n’a été envoyée pour ${member?.tag} !**` });

        if (!args.slice(1).join(" ")) return message.reply({ content: `**${client.emotes.no} ➜ Vous n'avez pas donné de raison de refus.**` });

        const channel = client.channels.cache!.get(channels.botslogs);

        channel?.isTextBased() ? channel.send({
            content: `<@${botGet.ownerId}>`,
            embeds: [
                {
                    title: "Refus...",
                    timestamp: new Date().toISOString(),
                    thumbnail: {
                        url: member?.displayAvatarURL()
                    },
                    color: client.config.color.integer,
                    footer: {
                        text: `Tu peux toujours corriger ce que ${message.author.username} demande et refaire une demande ^^`
                    },
                    description: `<@${message.author.id}> vient juste de refuser le bot ${member?.username} pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\``
                }
            ]
        }) : new Error("The channel is not a Text Based channel");

        const verificator = await verificators.findOne({ userId: message.author.id })
        if (verificator) {
            verificator.verifications = verificator.verifications !== undefined ? verificator.verifications + 1 : 1;
            verificator.save();
        }
        if (!verificator) new verificators({
            userId: message.author.id,
            verifications: 1
        }).save()

        message.channel.send({
            content: `**${client.emotes.yes} ➜ Le bot ${member?.username}#${member?.discriminator} vient bien d'être refusé pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\`**`,
            components: [
                    {
                        type: 1,
                        components: [
                                {
                                    type: 2,
                                    custom_id: 'button',
                                    label: 'Avertir l’utilisateur',
                                    emoji: {
                                        name: '⚠️'
                                    },
                                    style: 1
                                }
                            ]
                    }
                ]
        }).then(async (msg: Message) => {
            const filter = (x: any) => x.user.id === message.author.id
            const collector = await msg.createMessageComponentCollector({ filter })
            collector.on("collect", async (interaction: ButtonInteraction) => {
                const user = await client.users.fetch(botGet.ownerId!)
                await newInfraction(client, user!, message.member!, message.guild!, "WARN", 'Non respect des conditions d’ajout de bot.', 0).then(async (res: any) => {
                    if (res) await interaction.reply(res)
                })
            })
        })

        await botGet.deleteOne();

        const guildMember = await message.guild!.members.fetch(args[0]).catch(() => { })

        if (guildMember?.user && config.autokick === true) guildMember?.kick().catch(() => { });
    }
}

export = new Reject;