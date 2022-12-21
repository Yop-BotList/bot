import { CommandInteraction, PermissionsBitField } from "discord.js";
import Class from "../..";
import { config, emotes } from "../../configs";
import Slash from "../../utils/Slash";
import { bots, users, verificators } from "../../models"
import moment from "moment"

class Profil extends Slash {
    constructor() {
        super({
            name: "profil",
            description: "Voir le profil d'un membre/un bot.",
            description_localizations: {
                "en-US": "See member's profile"
            },
            options: [
                {
                    type: 6,
                    name: "membre",
                    name_localizations: {
                        "en-US": "member"
                    },
                    description: "Membre dont vous souhaitez voir le profil.",
                    description_localizations: {
                        "en-US": "Member whose profile you wish to see."
                    },
                    required: false
                }
            ]
        });
    }

    async run(client: Class, interaction: CommandInteraction) {
        let member = interaction.guild.members.cache.get(interaction.options.getUser("membre")?.id || interaction.user.id) || interaction.guild.members.fetch(interaction.options.getUser("membre")?.id || interaction.user.id).catch(() => {}) || interaction.member

        if (!member!.user.bot) {
            const data = await bots.find();

            let robots: any[] = []

            data.forEach(x => {
                if (x.ownerId === member!.user.id || x.team.includes(member!.user.id)) robots.push(x.botId)
            })

            /**
             * Créer la liste des badges avec des emojis.
             * @return String
             */
            async function drawBadges () {
                const user = await users.findOne({ userId: member!.user.id })

                if (!user) return ""

                let list = ""

                user.badges.forEach(async (badge: { id: string; acquired: boolean; }) => {
                if (!badge.acquired) return;

                switch (badge.id) {
                    case "dev": {
                    list = list + emotes.badges.dev
                    break;
                    }
                    case "partner": {
                    list = list + emotes.badges.partner
                    break;
                    }
                    case "premium": {
                    list = list + emotes.badges.premium
                    break;
                    }
                    case "staff": {
                    list = list + emotes.badges.staff
                    break;
                    }
                    case "support": {
                    list = list + emotes.badges.support
                    break;
                    }
                    case "verificator": {
                    list = list + emotes.badges.verificator
                    break;
                    }
                }
                })
                return list
            }


            let components = []

            const data2 = await verificators.findOne({ userId: member.user.id })
            if (data2.verifications) components.push({
                type: 2,
                style: 1,
                label: `${data2.verifications || 0} vérification(s)`,
                disabled: true,
                customId: "VERIFICATIONS"
            })
            components.push({
                type: 2,
                style: 5,
                label: "Voir sur le site !",
                url: `https://yopbotlist.me/users/${member!.user.id}`
            })

            interaction.reply({
                embeds: [
                {
                    title: `Informations sur ${member!.user.tag}`,
                    color: client.config.color.integer,
                    thumbnail: {
                    url: member!.user.displayAvatarURL()
                    },
                    fields: [
                    {
                        name: '__🏷 Nom :__',
                        value: `> <@${member!.user.id}> (\`${member!.user.tag}\`) ${await drawBadges()}`,
                        inline: false
                    }, {
                        name: '__📆 Date de création :__',
                        value: `> ${moment(member!.user.createdAt).format('Do MMMM YYYY')}`,
                        inline: false
                    }, {
                        name: '__📆 A rejoint le :__',
                        value: `> ${moment(member!.joinedAt).format('Do MMMM YYYY')}`,
                        inline: true
                    }, {
                        name: '__🧾 Robots listés :__',
                        value: '> ' + (robots!.length > 0 ? robots?.map(x => `<@${x}>`).slice(0, 4).join(", ") : "*Aucun robot listé...*")
                    }
                    ]
                }
                ],
                components: [
                    { 
                        type: 1,
                        components: components
                    }
                ]
            });
        }

        if (member!.user.bot) {
            let db = await bots.findOne({ botId: member!.user.id });

            if (!db) interaction.reply({
                embeds: [
                    {
                        title: `Informations sur ${member!.user.tag}`,
                        color: client.config.color.integer,
                        thumbnail: {
                        url: member!.user.displayAvatarURL()
                        },
                        fields: [
                            {
                                name: '__🏷 Nom :__',
                                value: `> <@${member!.user.id}> (\`${member!.user.tag}\`)`,
                                inline: false
                            }, {
                                name: '__📆 Date de création :__',
                                value: `> ${moment(member!.user.createdAt).format('Do MMMM YYYY')}`,
                                inline: false
                            }, {
                                name: '__📆 A rejoint le :__',
                                value: `> ${moment(member!.joinedAt).format('Do MMMM YYYY')}`,
                                inline: true
                            }
                        ]
                    }
                ]
            });

            if (db) {
                const site = db.site || "*Aucun site web...*",
                support = db.supportInvite || "*Aucun support...*",
                description = db.description || "*Aucune description...*",
                owners = [];

                owners.push(db.ownerId)
                if (db.team?.length > 0) db.team.forEach(async (x) => owners.push(x))

                interaction.reply({
                    embeds: [
                        {
                            title: `Informations sur ${member!.user.tag}`,
                            color: client.config.color.integer,
                            thumbnail: {
                                url: member!.user.displayAvatarURL()
                            },
                            footer: {
                                text: `${member!.user.username} a rejoint la liste le ${moment(member!.joinedAt).format('Do MMMM YYYY')}`
                            },
                            fields: [
                                {
                                name: '__:robot: Nom :__',
                                value: `> <@${member!.user.id}> (\`${member!.user.tag}\`)`,
                                inline: true
                                }, {
                                name: '__:key: Propriétaire(s) :__',
                                value: `> ${owners.map(x => `<@${x}>`).slice(0, 4).join(", ")}`,
                                inline: true
                                }, {
                                name: '__:bookmark_tabs: Préfixe :__',
                                value: `> ${db.prefix || ""} ${db.supportSlashs && db.supportSlashs === true ? emotes.badges.supportSlashs : ""}`,
                                inline: true
                                }, {
                                name: '__:pencil: Description :__',
                                value: `> ${description}`,
                                inline: false
                                }, {
                                name: '__:question: Serveur support : __',
                                value: `> ${support}`,
                                inline: true
                                }, {
                                name: '__:globe_with_meridians: Site web :__',
                                value: `> ${site}`,
                                inline: true
                                }, {
                                name: '__:nut_and_bolt: Lien d\'invitation :__',
                                value: `> [Clique ici](https://discord.com/oauth2/authorize?client_id=${member!.user.id}&scope=bot%20applications.commands&permissions=-1)`,
                                inline: false
                                }

                            ]
                        }
                    ],
                    components: [
                        {
                        type: 1,
                        components: [
                            {
                            type: 2,
                            style: 1,
                            label: `${db.likes || 0} vote${db.likes && db.likes > 1 || db.likes === 0 ? "s" : ""}`,
                            customId: `likesInfoBTN`,
                            disabled: true
                            },
                            {
                            type: 2,
                            style: 5,
                            label: "Voir sur le site !",
                            url: `https://yopbotlist.me/bots/${member!.user.id}`
                            },
                            {
                            type: 2,
                            style: 5,
                            label: "Voter !",
                            url: `https://yopbotlist.me/bots/${member!.user.id}/vote`
                            }
                        ]
                        }
                    ]
                });
            }
        }
    }
}

export = new Profil;