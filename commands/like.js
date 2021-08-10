const moment = require('moment'),
      cooldown = new Set(),
      likeshema = require("../database/models/likes")
moment.locale('fr');

exports.run = async (client, message) => {
    if (cooldown.has(message.author.id)) {
        return message.channel.send(client.no + " | Veuillez patienter encore un peu avant de pouvoir utiliser cette commande !")
    }
    const member = message.mentions.members.first();
    if (!member) {
        return message.channel.send(client.no + " | Veuillez mentionner un bot pour qui voter.");
    } else if (!client.dbProprio.has(`Proprio_${member.user.id}`)) {
        return message.channel.send(client.no + ' | Désolé, mais ce bot n\'est pas sur la liste.')
    } else {
    if (member.user.bot) {
    const verifyVotes = await likeshema.findOne({ botID: member.user.id, serverID: message.guild.id });
    if (!verifyVotes) {
        new likeshema({
            botID: member.user.id,
            serverID: message.guild.id,
            likesCount: 1,
            likeDate: `Le ${moment().format("Do MMMM YYYY")} à ${moment().format("HH")}h${moment().format("mm")}`
        }).save();
    }
    else {
        await likeshema.findOneAndUpdate({ botID: member.user.id, serverID: message.guild.id }, { likesCount: (verifyVotes.likesCount + 1), likeDate: `Le ${moment().format("Do MMMM YYYY")} à ${moment().format("HH")}h${moment().format("mm")}` }, { new: true });
    }
    
    const votesGet = await likeshema.findOne({ botID: member.user.id, serverID: message.guild.id });
    
    const votes = votesGet ? votesGet.likesCount : 1;
        setTimeout(() => {
            message.channel.send(client.yes + ` | Vous avez bien voté pour <@${member.user.id}> ! Il a maintenant ${votes} vote(s).`);
        client.channels.cache.get(client.botlogs).send(client.yes + `** | <@${message.author.id}> viens juste de voter pour <@${member.user.id}> !**`)
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
    category: "botlist",
    aliases: ["vote", "botlike", "botvote"],
    description: "Voter pour un bot.",
    usage: "like <mention bot>",
    example: [`like <@782667133716791316>`]
}
