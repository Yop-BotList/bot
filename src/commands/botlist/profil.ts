import Class from '..'
import Command from '../../utils/Command'
import { Message } from 'discord.js'
import bots from '../../models/bots'

class Profil extends Command {
  constructor() {
    super({
      name: 'profil',
      category: 'Botlist',
      description: 'Voir le profil d’un utilisateur.',
      usage: 'profil <utilisateur>',
      aliases: ['ui', 'userinfo'],
      cooldown: 5,
      minArgs: 1
    });
  }
  
  async run (client: Class, message: Message, args: string[]): Promise<Message<boolean> | undefined> {
    const member = message.mentions.members.first() || message.guild.members.fetch(args[0]).catch(() => null)
    
    if (!member.user) return message.reply({ content: `**${client.emotes.no} ➜ Membre introuvable !**`})
    
    if (!member.bot) {
      const data = await bots.find({ ownerID: member.user.id })
      
      let robots;
      
      if (data.length === 0) robots = 'Aucun robot listé.'
      if (data.length > 0) robots = data.map(x => `<@${x.botID}>`).join(", ")
      
      message.reply({
        embeds: [
            {
              title: `Informations sur ${member.user.tag}`,
              color: client.color,
              thumbnail: {
                url: member.user.displayAvatarURL()
              }
              fields: [
                  {
                    name: '__🏷 Nom :__',
                    value: `> <@${member.user.id}> (\`${member.user.tag}\`)`,
                    inline: false
                  },
                  {
                    name: '__📆 Date de création :__',
                    value: `> ${moment(member.user.createdAt).format('Do MMMM YYYY')}`,
                    inline: false
                  },
                  {
                    name: '__📆 A rejoint le :__',
                    value: `> ${moment(member.user.joinedAt).format('Do MMMM YYYY')}`,
                    inline: true
                  },
                  {
                    name: '__🧾 Robots listés :__',
                    value: '> ' + robots
                  }
                ]
            }
          ]
      })
    }
    
    if (member.bot) {
      let db = await bots.findOne({ botID: member.user.id })
      if (!db) {
        message.reply({
        embeds: [
            {
              title: `Informations sur ${member.user.tag}`,
              color: client.color,
              thumbnail: {
                url: member.user.displayAvatarURL()
              }
              fields: [
                  {
                    name: '__🏷 Nom :__',
                    value: `> <@${member.user.id}> (\`${member.user.tag}\`)`,
                    inline: false
                  },
                  {
                    name: '__📆 Date de création :__',
                    value: `> ${moment(member.user.createdAt).format('Do MMMM YYYY')}`,
                    inline: false
                  },
                  {
                    name: '__📆 A rejoint le :__',
                    value: `> ${moment(member.user.joinedAt).format('Do MMMM YYYY')}`,
                    inline: true
                  }
                ]
            }
          ]
        })

      }
      
      if (db) {
      const site = db.site || "*Aucun site web...*",
            support = db.serverInvite || "*Aucun support...*",
            description = db.desc || "*Aucune description...*"
            
      message.reply({
        embeds: [
            {
              title: `Informations sur ${member.user.tag}`,
              color: client.color,
              thumbnail: {
                url: member.user.displayAvatarURL()
              },
              footer: {
                text: `${member.user.username} a rejoint la liste le ${moment(member.joinedAt).format('Do MMMM YYYY')}`
              },
              fields: [
                {
                  name: '__:robot: Nom :__',
                  value: `> <@${member.user.id}> (\`${member.user.tag}\`)`,
                        inline: true
                },
                {
                  name: '__:key: Propriétaire :__',
                  value: `> <@${db.ownerID}>`,
                  inline: true
                },
                {
                  name: '__:bookmark_tabs: Préfixe :__',
                  value: `> ${db.prefix}`,
                  inline: true
                },
                {
                  name: '__:pencil: Description :__',
                  value: `> ${description}`,
                  inline: false
                },
                {
                  name: '__:question: Serveur support : __',
                  value: `> ${support}`,
                  inline: true
                },
                {
                  name: '__:globe_with_meridians: Site web :__',
                  value: `> ${site}`,
                  inline: true
                },
                {
                  name: '__:nut_and_bolt: Lien d\'invitation :__',
                  value: `> [Clique ici](https://discord.com/oauth2/authorize?client_id=${member.user.id}&scope=bot%20applications.commands&permissions=-1)`,
                  inline: false
                }
            
              ]
            }
          ]
      })
      }
    }
  }
}

export = new Profil;