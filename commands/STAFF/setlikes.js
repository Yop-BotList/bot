const { verificator } = require("../../configs/roles.json"),
    { Client, Message } = require("discord.js"),
    bots = require("../../models/bots"),
    moment = require("moment");

    moment.locale("fr")

module.exports = {
    name: 'setlikes',
    categories : 'staff', 
    permissions : verificator, 
    description: "Permet de rénitialiser ou changer le nombre de likes d'un bot.",
    cooldown : 3600,
    usage: 'setlikes <set/reset> <bot> <number>',

    /**
     * @param {Client} client
     * @param {Message} message
     */
    run: async (client, message, args) => {
        if (!args[0]) return message.reply({ content: `${client.no} ➜ Merci de mettre une des deux options au lieu de aucune, \`set/reset\`.` });
    
        if (args[0] === "set") {
            let bot = message.mentions.members.first();
            if (!bot) return message.reply({ content: `${client.no} ➜ Merci de mentionner un bot.` });
            if (!bot.user || !bot.user.bot) return message.reply({ content: `${client.no} ➜ ${args[1]} n'est pas un bot.` });
            let botGet = await bots.findOne({ botID: bot.user.id });
            if (!botGet) return message.reply({ content: `${client.no} ➜ \`${bot.user.tag}\` n'est pas sur la liste.` });

            if (!args.slice(2).join(" ")) return message.reply({ content: `${client.no} ➜ Merci de me donner un nombre de votes.` });
            args.shift();

            const amount = parseInt(args[1]);

            if (isNaN(amount)) return message.reply({ content: `${client.no} ➜ Merci de mettre un nombre valide.` });

            await bots.findOneAndUpdate({
                botID: bot.user.id
            }, {
                likesCount: amount,
                likeDate: `Le ${moment().format("Do MMMM YYYY")} à ${moment().format("HH")}h${moment().format("mm")}`
            }, {
                upsert: true
            });

            message.reply({ content: `${client.yes} ➜ Le nombre de likes de \`${bot.user.tag}\` est maintenant défini sur ${amount}.` });
        } else if (args[0] === "reset") {
            let bot = message.mentions.members.first();
            if (!bot) return message.reply({ content: `${client.no} ➜ Merci de mentionner un bot.` });
            if (!bot.user || !bot.user.bot) return message.reply({ content: `${client.no} ➜ ${args[1]} n'est pas un bot.` });
            let botGet = await bots.findOne({ botID: bot.user.id });
            if (!botGet) return message.reply({ content: `${client.no} ➜ \`${bot.user.tag}\` n'est pas sur la liste.` });

            await bots.findOneAndUpdate({
                botID: bot.user.id
            }, {
                $set: {
                    likesCount: 0,
                    likeDate: "Aucun votes"
                }
            }, {
                upsert: true
            });

            message.reply({ content: `${client.yes} ➜ Le nombre de votes de \`${bot.user.tag}\` vient juste d'être réinitialisé.` });
        } else return message.reply({ content: `${client.no} ➜ Merci de mettre une des deux options, \`set/reset\`.` });
    }
}