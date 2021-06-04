const Discord  = require('discord.js'),
      Database = require('easy-json-database'),
      moment = require('moment');
moment.locale('fr');

const dbLikes = new Database('./database/likes.json'),
      dbDesc = new Database('./database/description.json'),
      dbProprio = new Database('./database/proprio.json'),
      dbPrefix = new Database('./database/prefix.json'),
      dbSite = new Database('./database/siteweb.json'),
      dbSupport = new Database('./database/support.json')

exports.run = async (client, message, args) => {
    if (!args[0]) {
        return message.channel.send('```y!botprofil <mention bot>```')
    } else {
       if (!message.mentions.members.first()) {
           return message.channel.send(':no_entry_sign: On me dit dans l\'oreillette que ta mention est invalide :confused:')
       } else {
        const member = message.mentions.members.first();
        if (!member.user.bot) {
            return message.channel.send(':no_entry_sign: Mon développeur m\'a interdit de divulger de informations sur les humains. Réessaie avec la mention d\'un bot.')
        }
        if (!dbProprio.has(`Proprio_${member.user.id}`)) {
            return message.channel.send(':no_entry_sign: Désolé, mais je ne retrouve pas ce bot sur ma liste.')
        }
            //définition des valeurs
            if (dbDesc.has(`Desc_${member.user.id}`)) {
                var description = dbDesc.get(`Desc_${member.user.id}`)
            }
            if (!dbDesc.has(`Desc_${member.user.id}`)) {
                var description = '_Aucune description définie..._'
            }
            if (dbLikes.has(`Likes_${member.user.id}`)) {
                var likes = `${dbLikes.get(`Likes_${member.user.id}`)} vote(s)`
                var lastlike = dbLikes.get(`LastLike_${member.user.id}`)
            }
            if (!dbLikes.has(`Likes_${member.user.id}`)) {
                var lastlike = '_Malheureusement, personne n\'a récemment voté pour ce bot :confused:_'
                var likes = '0 votes'
            }
            if (dbPrefix.has(`Prefix_${member.user.id}`)) {
                var prefix = dbPrefix.get(`Prefix_${member.user.id}`)
            }
            if (dbSupport.has(`Support_${member.user.id}`)) {
                var support = dbSupport.get(`Support_${member.user.id}`)
            }
            if (!dbSupport.has(`Support_${member.user.id}`)) {
                var support = '_Aucun serveur support défini..._'
            }
            if (dbSite.has(`Site_${member.user.id}`)) {
                var siteweb = dbSite.get(`Site_${member.user.id}`)
            }
            if (!dbSite.has(`Site_${member.user.id}`)) {
                var siteweb = '_Aucun site web défini..._'
            }

            //Message
            message.channel.send({
                embed: {
                    title: `Informations sur le bot ${member.user.username}`,
                    color: client.color,
                    timestamp: new Date(),
                    thumbnail: member.user.displayAvatarURL(),
                    footer: {
                        text: `${member.user.username} a rejoint la liste le ${moment(member.joinedAt).format('Do MMMM YYYY')}`,
                    },
                    fields: [
                        {
                            name: '__:robot: Nom :__',
                            value: `> <@${member.id}>`,
                            inline: true
                        },
                        {
                            name: '__:key: Propriétaire :__',
                            value: `> <@${dbProprio.get(`Proprio_${member.id}`)}>`,
                            inline: true
                        },
                        {
                            name: '__:bookmark_tabs: Préfixe :__',
                            value: `> ${prefix}`,
                            inline: true
                        },
                        {
                            name: '__:pencil: Description :__',
                            value: `> ${description}`,
                            inline: false
                        },
                        {
                            name: '__:question: Serveur support : __',
                            vale: `> ${support}`,
                            inline: true
                        },
                        {
                            name: '__:globe_with_meridians: Site web :__',
                            value: `> ${siteweb}`,
                            inline: true
                        },
                        {
                            name: '__:nut_and_bolt: Lien d\'invitation :__',
                            value: `> [Clique ici](https://discord.com/oauth2/authorize?client_id=${member.user.id}&scope=bot&permissions=2147483647)`,
                            inline: false
                        },
                        {
                            name: '__:sparkling_heart: Vote(s) :__',
                            value: `> ${likes}`,
                            inline: true
                        },
                        {
                             name: '__:two_hearts: Dernier like :__',
                             value: `${lastlike}`,
                             inline: true
                        }
                    ]
                }
            })
       }
    }
}

exports.help = {
    name: "botprofil"
}