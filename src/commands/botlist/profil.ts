import Class from '../..';
import Command from '../../utils/Command';
import { Message } from 'discord.js';
import bots from '../../models/bots';
import moment from "moment";

moment.locale("fr");

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

  async run(client: Class, message: Message): Promise<Message<boolean> | undefined> {
    const member = message.mentions.members?.first();

    if (!member || !member.user) return message.reply({ content: `**${client.emotes.no} ➜ Membre introuvable !**` });

    if (!member.user.bot) {
      const data = await bots.find();

      let robots: any[] = []

      data.forEach(x => {
        if (x.ownerId === member.user.id || x.team.includes(member.user.id)) robots.push(x.botId)
      })

      message.reply({
        embeds: [
          {
            title: `Informations sur ${member.user.tag}`,
            color: client.config.color.integer,
            thumbnail: {
              url: member.user.displayAvatarURL()
            },
            fields: [
              {
                name: '__🏷 Nom :__',
                value: `> <@${member.user.id}> (\`${member.user.tag}\`)`,
                inline: false
              }, {
                name: '__📆 Date de création :__',
                value: `> ${moment(member.user.createdAt).format('Do MMMM YYYY')}`,
                inline: false
              }, {
                name: '__📆 A rejoint le :__',
                value: `> ${moment(member.joinedAt).format('Do MMMM YYYY')}`,
                inline: true
              }, {
                name: '__🧾 Robots listés :__',
                value: '> ' + (robots!.length > 0 ? robots?.map(x => `<@${x}>`).slice(0, 4).join(", ") : "*Aucun robot listé...*")
              }
            ]
          }
        ]
      });
    }

    if (member.user.bot) {
      let db = await bots.findOne({ botId: member.user.id });

      if (!db) {
        message.reply({
          embeds: [
            {
              title: `Informations sur ${member.user.tag}`,
              color: client.config.color.integer,
              thumbnail: {
                url: member.user.displayAvatarURL()
              },
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
                  value: `> ${moment(member.joinedAt).format('Do MMMM YYYY')}`,
                  inline: true
                }
              ]
            }
          ]
        });
      }

      if (db) {
        const site = db.site || "*Aucun site web...*",
          support = db.supportInvite || "*Aucun support...*",
          description = db.description || "*Aucune description...*",
          owners = [];

        owners.push(db.ownerId)
        if (db.team?.length > 0) db.team.forEach(async (x) => owners.push(x))

        message.reply({
          embeds: [
            {
              title: `Informations sur ${member.user.tag}`,
              color: client.config.color.integer,
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
                }, {
                  name: '__:key: Propriétaire(s) :__',
                  value: `> ${owners.map(x => `<@${x}>`).slice(0, 4).join(", ")}`,
                  inline: true
                }, {
                  name: '__:bookmark_tabs: Préfixe :__',
                  value: `> ${db.prefix}`,
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
                  value: `> [Clique ici](https://discord.com/oauth2/authorize?client_id=${member.user.id}&scope=bot%20applications.commands&permissions=-1)`,
                  inline: false
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
