import { GuildMember } from "discord.js"
import Class from ".."
import bots from '../models/bots.ts'
import { channels } from '../configs'

export = async (client: Class, member: GuildMember) => {
  if (member.guild.id === client.config.staffGuildId) {
    if (!member.user.bot) return;
    const data = await bots.findOne({ botID: member.user.id })
    if (!data || !data.botID) return;
    if (data.verified !== false) return;
    const owner = await client.users.fetch(data.ownerID).catch(() => null)
    
    if (owner?.id) owner.send({
      content: `**${client.emotes.loading} ➜ Nous commençons à vérifier votre robot (\`${member.user.tag}\`) !`
    }).catch(() => {})
  }
  
  if (member.guild.id === client.config.mainguildid && !member.user.bot) client.channels.cache.get(channel.welcomechannel)?.send({
    content: `**${client.emotes.discordicons.wave} ➜ Je veux un maximum d’applaudissements pour l’entrée de \`${member.user.username}\` sur le serveur !**`
  })
}