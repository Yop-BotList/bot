import { GuildMember } from "discord.js";
import Class from "..";
import { bots, users } from '../models';
import { channels } from '../configs';

export = async (client: Class, member: GuildMember) => {
  if (member.guild.id === client.config.staffGuildId) {
    if (!member.user.bot) return;
    
    const data = await bots.findOne({ botId: member.user.id });
    if (!data || !data.botId) return;
    
    if (data.verified !== false) return;
    
    const owner = await client.users.fetch(`${data.ownerId}`).catch(() => null)
    
    if (owner?.id) owner.send({
      content: `**${client.emotes.loading} ➜ Nous commençons à vérifier votre robot (\`${member.user.tag}\`) !**`
    }).catch(() => {})
  }
  
  if (member.guild.id === client.config.mainguildid && !member.user.bot) {
    const channel = client.channels.cache.get(channels.welcomechannel);
    
    channel?.isTextBased() ? channel.send({
      content: `**${client.emotes.discordicons.wave} ➜ Je veux un maximum d’applaudissements pour l’entrée de \`${member.user.username}\` sur le serveur !**`
    }) : new Error("The channel is not a Text Based channel");

    const data = await users.findOne({ userId: member.user.id });
    if (!data) new users({
      userId: member.user.id,
      avis: null,
      cmdbl: false,
      ticketsbl: false,
      warns: [],
      totalNumbers: 0,
      readFaq: false
    }).save();
  }
}