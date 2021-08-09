const { autokick } = require("../configs/config.json");

module.exports = async (client, member) => {
    if (autokick === false) return
    if (client.dbProprio.has(`Bot_${member.user.id}`)) {
        const bot = member.guild.members.cache.get(client.dbProprio.get(`Bot_${member.user.id}`))
        client.channels.cache.get(client.botlogs).send({
            embed:{
                title: 'Auto-expultion...',
                timestamp: new Date(),
                thumbnail: {
                    url: bot.user.displayAvatarURL()
                },
                color: '#FF0000',
                description: `<@${member.user.id}> vient juste de quiter le serveur. Son bot a donc été supprimé !`
            }
        });
        setTimeout(() => {
            bot.kick("Bot supprimé de la liste.")
            client.dbProprio.delete(`Bot_${member.user.id}`)
            client.dbProprio.delete(`Proprio_${bot.user.id}`)
            if (client.dbVerifStatut.has(`Statut_${bot.user.id}`)) client.dbVerifStatut.delete(`Statut_${bot.user.id}`)
        }, 1000)
    }
}
