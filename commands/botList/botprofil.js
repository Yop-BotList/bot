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
        const ownerdb = await bots.findOne({ serverID: mainguildid, owerID: message.author.id })
        const member = message.mentions.members.first() || message.guild.members.cache.get(ownerdb.ownerID);
        let db = await bots.findOne({ serverID: mainguildid, botID: member.user.id })
        if (!db) return message.channel.send("**" + client.no + " ➜ Désolé, mais je ne retrouve pas ce bot sur ma liste (ce n'est d'ailleurs peut-être même pas un bot)**")

            const votes = db.likesCount || 0,
                    lastlike = db.likeDate || "*Aucun vote...*",
                    e = new MessageEmbed()
                    .setTitle(`Informations sur le robot ${member.user.username}`)
                    .setColor(client.color)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setTimestamp(new Date())
                    .setFooter(`${member.user.username} a rejoint la liste le ${moment(member.joinedAt).format('Do MMMM YYYY')}`)
                    .addFields(                        {
                        name: '__:robot: Nom :__',
                        value: `> <@${member.user.id}>`,
                        inline: true
                    },
                    {
                        name: '__:key: Propriétaire :__',
                        value: `> <@${db.owerID}>`,
                        inline: true
                    },
                    {
                        name: '__:bookmark_tabs: Préfixe :__',
                        value: `> ${db.prefix}`,
                        inline: true
                    },
                    {
                        name: '__:pencil: Description :__',
                        value: `> ${db.desc}`,
                        inline: false
                    },
                    {
                        name: '__:question: Serveur support : __',
                        value: `> ${db.serverInvite}`,
                        inline: true
                    },
                    {
                        name: '__:globe_with_meridians: Site web :__',
                        value: `> ${db.site}`,
                        inline: true
                    },
                    {
                        name: '__:nut_and_bolt: Lien d\'invitation :__',
                        value: `> [Clique ici](https://discord.com/oauth2/authorize?client_id=${member.user.id}&scope=bot%20application.commands&permissions=-1)`,
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
                    })
            
            //Message
            message.channel.send({ embeds: [e] })
    }
}