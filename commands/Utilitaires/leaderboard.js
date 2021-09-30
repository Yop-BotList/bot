const { Client, Message, MessageEmbed } = require("discord.js"),
      bot = require("../../models/bots"),
      { mainguildid } = require("../../configs/config.json"),
      bumps = require("../../models/bumps");

module.exports = {
    name: "leaderboard",
    categories: "info",
    permissions: "everyone",
    description: "Afficher les différents classements du serveur.",
    aliases: ["top", "lb"],
    usage: "leaderboard <likes | bumps | staff>",
    
    /**
    * @param {Message} message
    * @param {Client} client
    * @param {String[]} args
    */
    run: async (client, message, args) => { 
        if (args[0] !== "likes" && args[0] !== "bumps" && args[0] !== "staff") return message.reply(`**${client.no} ➜ Veuillez entrer l'un des arguments suivants : \`likes\`, \`bumps\` ou \`staff\`.**`)
        
        // likes
        if (args[0] === "likes") {
    const usersdata = await bot.find({ serverID: mainguildid });

    if (usersdata.length < 2) return message.channel.send(`**${client.no} ➜ Il n'y a pas assez de bots dans le classement pour que je puisse afficher en afficher un.**`)
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
        
        // bumps
        if (args[0] === "bumps") {
            const usersdata = await bumps.find();

    if (usersdata.length < 2) return message.channel.send(`**${client.no} ➜ Il n'y a pas assez de bumpers dans le classement pour que je puisse afficher en afficher un.**`)
    let array = usersdata.sort((a, b) => (a.bumpCount < b.bumpCount) ? 1 : -1).slice(0, 10);
    let forfind = usersdata.sort((a, b) => (a.bumpCount < b.bumpCount) ? 1 : -1);

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
            title: "Classement des bumpers :",
            color: client.color,
            thumbnail: {
                url: message.guild.iconURL()
            },
            description: array.map((r, i) => `#${i + 1} **${client.users.cache.get(r.userId).tag}** avec \`${r.bumpCount}\` bump(s)`).join("\n")
        }
    })
        }
    }
}
