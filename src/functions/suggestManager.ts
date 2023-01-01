import { ButtonInteraction, TextChannel } from "discord.js";
import Class from "..";
import { channels } from "../configs";
import { suggests } from "../models";

export default async function suggestManager(type: string, client: Class, interaction: ButtonInteraction) {
    const suggData = await suggests.findOne({ messageId: interaction.message.id });
    
    if (!suggData) return;
    
    if (suggData.voted!.includes(interaction.user.id)) return interaction.reply({
        content: "Vous avez déjà voté pour cette suggestion.",
        ephemeral: true
    });
    
    const suggChannel = client.channels.cache.get(channels.suggests) as TextChannel;
    
    const message = await suggChannel.messages.fetch(`${suggData.messageId}`);
    
    if (!message) return;
    
    const forSugg = type === "FOR" ? suggData.for! + 1 : suggData.for as number
    const againstSugg = type === "AGAINST" ? suggData.against! + 1 : suggData.against as number
    let percentF = 50;
    let percentA = 50;
    
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
    
    const embed = message.embeds[0];
    
    message.edit({
        embeds: [
            {
                title: `${embed.title}`,
                thumbnail: {
                    url: `${embed.thumbnail!.url}`
                },
                color: client.config.color.integer,
                timestamp: new Date().toISOString(),
                description: `${embed.description}`,
                fields: [
                    {
                        name: "Votes",
                        value: drawVoteBar() ?? ""
                    }
                ]
            }
        ],
        components: message.components
    });
    
    suggData.for = type === "FOR" ? suggData.for! + 1 : suggData.for;
    suggData.against = type === "AGAINST" ? suggData.against! + 1 : suggData.against;
    suggData.voted!.push(interaction.user.id);
    suggData.save();
    
    interaction.reply({
        content: "Vous venez juste de voter pour cette suggestion.",
        ephemeral: true
    });
}
