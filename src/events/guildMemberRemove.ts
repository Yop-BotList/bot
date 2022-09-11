import { GuildMember, ChannelType } from "discord.js";
import Class from "..";
import { bots } from '../models';
import { channels, roles } from '../configs';

export = async (client: Class, member: GuildMember) => {
    if (member.guild.id !== client.config.mainguildid) return;
    
    if (member.user.bot) {
        const data = await bots.findOne({ botId: member.user.id });
        
        if (!data) return;
        
        const channel = client.channels.cache.get(channels.botslogs);
        
        if (!channel || channel.type !== ChannelType.GuildText) return new Error(`Le salon de logs b’existe pas ou n’est pas un salon textuel`);
        
        channel.send({
            content: `<@${data.ownerId}>`,
            embeds: [
                {
                    title: `Suppression ...`,
                    color: 0xFF0000,
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: `Vous pensez que c'est une erreur ? Envoyez-moi un Message Privé !`
                    },
                    description: `${member.user.username} vient juste de quitter le serveur pour une raison inconnue. Il a donc été supprimé de la liste.`,
                    thumbnail: {
                        url: member.user.displayAvatarURL()
                    }
                }
            ]
        });
        
        const ownerBots = await bots.find({ ownerId: data.ownerId });
        if (ownerBots.length === 0) {
            const owner = member.guild?.members.cache.get(`${data?.ownerId}`);
            if (owner) owner.roles.remove(roles.isclient);
        }
        
        await bots.deleteOne({ botId: member.user.id });
    }
    
    if (!member.user.bot) {
        const channel = client.channels.cache.get(channels.welcomechannel);

        if (!channel?.isTextBased()) return new Error("WelcomeChannel is not a text based channel.");

        if (channel.lastMessage?.content === `**${client.emotes.discordicons.wave} ➜ Je veux un maximum d’applaudissements pour l’entrée de \`${member.user.username}\` sur le serveur !**`) channel.lastMessage.edit( `**${client.emotes.discordicons.wave} ➜ Je veux un maximum ~~d’applaudissements pour l’entrée de \`${member.user.username}\` sur le serveur~~ de pouces en bas pour son départ immédiat 👎 !**`);
    }
}