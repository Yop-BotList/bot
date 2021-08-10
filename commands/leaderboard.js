const likeshema = require("../database/models/likes");

module.exports.run = async (client, message) => {

    const usersdata = await likeshema.find({ serverID: message.guild.id });

    if (usersdata.length < 3) return message.channel.send(`**${client.no} | Il n'y a pas assez de bots dans le classement pour que je puisse l'afficher.**`)

    let array = usersdata.sort((a, b) => (a.likesCount < b.likesCount) ? 1 : -1).slice(0, 10);
    let forfind = usersdata.sort((a, b) => (a.likesCount < b.likesCount) ? 1 : -1);

    function estUser(user) {
        return user.uID === message.author.id;
    }
    const user = forfind.find(estUser);
    const userTried = (element) => element === user;
    let ranked = forfind.findIndex(userTried) + 1
    let first;
    if (ranked === 1) {
        first = "1"
    } else {
        first = `${ranked}`
    }

    message.channel.send({
        embed: {
            title: "Classement des votes du mois :",
            color: client.color,
            thumbnail: {
                url: message.guild.iconURL()
            },
            description: array.map((r, i) => `#${i + 1} **${client.users.cache.get(r.botID).tag}** avec \`${r.likesCount}\``).join("\n")
        }
    })
}

module.exports.help = {
    description: "Permet de voir le classement des votes.",
    name: "leaderboard",
    aliases: ["lb", "top"],
    category: "botlist"
}