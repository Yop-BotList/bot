const { Client, Message, MessageEmbed } = require("discord.js"),
      moment = require("moment"),
      bots = require("../../models/bots"),
      { prefix, mainguildid } = require("../../configs/config.json");

module.exports = {
    name: "botprofil",
    categories: "botlist",
    descripton: "Afficher le profil d'un robot inscrit sur la liste.",
    aliases: ["profilbot"],
    permissions: "everyone",
    usage: "botprofil [utilisateur]",
    /**
     *  @param {Client} client
     *  @param {Message} message
     *  @param {Sting[]} args
     */

    run: async (client, message, args) => {
        const member = message.mentions.members.first() || await bots.findOne({ serverID: mainguildid, owerID: message.author.id });
        if (!client.dbProprio.has(`Proprio_${member.user.id}`)) return message.channel.send(client.no + " | Désolé, mais je ne retrouve pas ce bot sur ma liste (ce n'est d'ailleurs peut-être même pas un bot)")
        let prefix = client.dbPrefix.get(`Prefix_${member.user.id}`),
            description = client.dbDesc.get(`Desc_${member.user.id}`) || "_Aucune description définie..._",
            support = client.dbSupport.get(`Support_${member.user.id}`) || "_Aucun serveur support défini..._",
            siteweb = client.dbSite.get(`Site_${member.user.id}`) || "_Aucu site web défini..._";

            const votesGet = await likeshema.findOne({ botID: member.user.id, serverID: message.guild.id });
            const votes = votesGet ? votesGet.likesCount : 0,
                    lastlike = votesGet ? votesGet.likeDate : "*Aucun vote...*"
            
            //Message
            message.channel.send({
                embed: {
                    title: `Informations sur le bot ${member.user.username}`,
                    color: client.color,
                    timestamp: new Date(),
                    thumbnail: {
                        url: member.user.displayAvatarURL()
                    },
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
                            value: `> <@${client.dbProprio.get(`Proprio_${member.id}`)}>`,
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
                            value: `> ${support}`,
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
                            value: `> ${votes} vote(s)`,
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