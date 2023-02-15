import {ButtonInteraction, ChannelType, TextChannel} from 'discord.js'
import Class from "../index";
import {suggests} from "../models/";
import {channels} from "../configs";

export async function votesReceiver(client: Class, type: string, interaction: ButtonInteraction) {
    const data = await suggests.findOne({ msgId: interaction.message.id })
    
    if (!data) return interaction.reply({
        content: `${client.emotes.no} ➜ Cette suggestion n'existe pas.`,
        ephemeral: true
    })

    let currentVote = data.voted!.find((x: any) => x.userId === interaction.user.id)?.vote

    const suggChannel = client.channels.cache.get(channels.suggests) as TextChannel | undefined;
    
    if (!suggChannel || suggChannel.type !== ChannelType.GuildText) {
        await interaction.reply({
            content: `${client.emotes.no} ➜ Le système de suggestions **est désactivé** sur ce serveur.`,
            ephemeral: true
        })
        return
    }

    if (currentVote && currentVote === type) return interaction.reply({
        content: `${client.emotes.no} ➜ Vous avez déjà voté cette option.`,
        ephemeral: true
    })

    let forSugg = type === "FOR" ? data.for + 1 : data.for;
    let againstSugg = type === "AGAINST" ? data.against + 1 : data.against;
    let percentF = 50;
    let percentA = 50;

    if (currentVote === "FOR") forSugg = forSugg - 1
    if (currentVote === "AGAINST") againstSugg = againstSugg - 1

    function toPercent(votes: number): number {
        const total = forSugg + againstSugg;

        const percent = (100 * votes) / total;

        return isNaN(percent) ? 50 : Math.trunc(percent);
    }

    function drawVoteBar() {
        percentF = toPercent(forSugg);
        percentA = toPercent(againstSugg);

        const blue = client.emotes.loadBar.blue;
        const red = client.emotes.loadBar.red;

        if (percentA === 100) return `Pour - 0% ${red.start}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.end} 100% - Contre`;

        if (percentF >= 10 && percentA >= 90) return `Pour - ${percentF}% ${blue.start}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.end} ${percentA}% - Contre`;

        if (percentF >= 20 && percentA >= 80) return `Pour - ${percentF}% ${blue.start}${blue.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.end} ${percentA}% - Contre`;

        if (percentF >= 30 && percentA >= 70) return `Pour - ${percentF}% ${blue.start}${blue.middle}${blue.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.end} ${percentA}% - Contre`;

        if (percentF >= 40 && percentA >= 60) return `Pour - ${percentF}% ${blue.start}${blue.middle}${blue.middle}${blue.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.end} ${percentA}% - Contre`;

        if ((percentF === 50) && (percentA === 50)) return `Pour - 50% ${blue.start}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${red.middle}${red.middle}${red.middle}${red.middle}${red.end} 50% - Contre`;

        if (percentF >= 60 && percentA >= 40) return `Pour - ${percentF}% ${blue.start}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${red.middle}${red.middle}${red.middle}${red.end} ${percentA}% - Contre`;

        if (percentF >= 70 && percentA >= 30) return `Pour - ${percentF}% ${blue.start}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${red.middle}${red.middle}${red.end} ${percentA}% - Contre`;

        if (percentF >= 80 && percentA >= 20) return `Pour - ${percentF}% ${blue.start}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${red.middle}${red.end} ${percentA}% - Contre`;

        if (percentF >= 90 && percentA >= 10) return `Pour - ${percentF}% ${blue.start}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${red.end} ${percentA}% - Contre`;

        if (percentF === 100) return `Pour - 100% ${blue.start}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.middle}${blue.end} 0% - Contre`;
    }

    const currentEmbed = interaction.message.embeds[0]

    if (!currentEmbed) interaction.message.delete()

    interaction.message.edit({
        embeds: [
            {
                title: currentEmbed.title!,
                thumbnail: {
                    url: interaction.guild!.iconURL()!,
                },
                color: client.config.color.integer,
                timestamp: new Date().toISOString(),
                footer: {
                    text: `YopBot V${client.version}`
                },
                description: currentEmbed.description!,
                fields: [
                    {
                        name: "Votes",
                        value: drawVoteBar() ?? ""
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
                        style: 3,
                        custom_id: "forSugg",
                        emoji: {
                            name: "👍"
                        }
                    }, {
                        type: 2,
                        style: 2,
                        custom_id: "bofSugg",
                        emoji: {
                            name: "🤷"
                        }
                    }, {
                        type: 2,
                        style: 4,
                        custom_id: "againstSugg",
                        emoji: {
                            name: "👎"
                        }
                    },
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 1,
                        custom_id: "viewVotersSugg",
                        emoji: { name: "👀" },
                        label: "Votes"
                    },
                    {
                        type: 2,
                        style: 2,
                        custom_id: "openThread",
                        emoji: {name: "hierarchie", id: "907996994595848192"},
                        label: "Ouvrir un fil",
                        disabled: interaction.message.hasThread
                    }
                ]
            }
        ]
    })

    let array:any[]

    if (currentVote) {
        array = data.voted.filter((x: any) => x.userId !== interaction.user.id)

        array.push({
            userId: interaction.user.id,
            vote: type
        })
    }

    if (!currentVote) {
        array = data.voted

        array.push({
            userId: interaction.user.id,
            vote: type
        })
    }

    data.for = forSugg
    data.against = againstSugg
    // @ts-ignore
    data.voted = array
    data.save()

    return interaction.reply({
        content: `${client.emotes.yes} ➜ Vote ${currentVote ? "**modifié**" : "**pris en compte**"}.`,
        ephemeral: true
    })
}


export async function sendVoters (client: Class, interaction: ButtonInteraction) {
    const db = await suggests.findOne({ msgId: interaction.message.id })

    if (!db) return interaction.reply({
        content: `${client.emotes.no} ➜ Cette suggestion n'existe pas.`,
        ephemeral: true
    })

    let forVoters = db.voted.filter((x: any) => x.vote === "FOR"),
        bofVoters = db.voted.filter((x: any) => x.vote === "BOF"),
        againstVoters = db.voted.filter((x: any) => x.vote === "AGAINST")

    await interaction.reply({
        embeds: [
            {
                title: `Liste des votes de la suggestion N°${db.id}`,
                thumbnail: {
                    url: interaction.guild!.iconURL()!,
                },
                color: client.config.color.integer,
                timestamp: new Date().toISOString(),
                footer: {
                    text: `YopBot V${client.version}`
                },
                fields: [
                    {
                        name: "👍 Votes positifs :",
                        value: `> ${forVoters.length > 0 ? forVoters.map((x: any) => `<@${x.userId}>`).slice(0, 39).join(", ") : "Aucuns votes positifs."}${forVoters.length > 40 ? ` et ${String(forVoters.length - 40)} autre(s)...` : ""}`
                    },
                    {
                        name: "🤷 Votes mitigés :",
                        value: `> ${bofVoters.length > 0 ? bofVoters.map((x: any) => `<@${x.userId}>`).slice(0, 39).join(", ") : "Aucuns votes mitigés."}${bofVoters.length > 40 ? ` et ${String(bofVoters.length - 40)} autre(s)...` : ""}`
                    },
                    {
                        name: "👎 Votes négatifs :",
                        value: `> ${againstVoters.length > 0 ? againstVoters.map((x: any) => `<@${x.userId}>`).slice(0, 39).join(", ") : "Aucuns votes négatifs."}${againstVoters.length > 40 ? ` et ${String(againstVoters.length - 40)} autre(s)...` : ""}`
                    }
                ]
            }
        ],
        ephemeral: true
    })
}