const Discord = require('discord.js'),
      Database = require("easy-json-database"),
      moment = require('moment'),
      cooldown = new Set();
moment.locale('fr');

const dbLikes = new Database('./database/likes.json'),
      dbProprio = new Database('./database/proprio.json');

exports.run = async (client, message) => {
    if (cooldown.has(message.author.id)) {
        return message.channel.send(client.no + " | Veuillez patienter encore un peu avant de pouvoir utiliser cette commande !")
    }
    const member = message.mentions.members.first();
    if (!member) {
        return message.channel.send(client.no + " | Veuillez mentionner un bot pour qui voter.");
    } else if (!dbProprio.has(`Proprio_${member.user.id}`)) {
        return message.channel.send(client.no + ' | Désolé, mais ce bot n\'est pas sur la liste.')
    } else {
    if (member.user.bot) {
        let votes = Number(0)
        if (dbLikes.has(`likes_${member.user.id}`)) {
            votes = (Number(dbLikes.get(`likes_${member.user.id}`)) + 1)
        } else if (!dbLikes.has(`Likes_${member.id}`)) {
            votes = Number(1)
        }
        setTimeout(() => {
            message.channel.send(client.yes + ` | Vous avez bien voté pour <@${member.user.id}> ! Il a maintenant ${votes} vote(s).`);
        client.channels.cache.get(client.botlogs).send(client.yes + `** | <@${message.author.id}> viens juste de voter pour <@${member.user.id}> !**`);
        dbLikes.set(`likes_${member.user.id}`, `${votes}`)
        dbLikes.set(`LastLike_${member.user.id}`, `Le ${moment().format('Do MMMM YYYY')} à ${moment().format('HH')}h${moment().format('mm')}`)
        }, 1000)
        cooldown.add(message.author.id);
        setTimeout(() => {
          cooldown.delete(message.author.id);
        }, (1000 * 3600));
    } else if (!member.user.bot) {
        message.channel.send(client.no + " | Cet utilisateur n'est pas un bot.");
    }
}
}

exports.help = {
    name: "like",
    catogory: "botlist"
}