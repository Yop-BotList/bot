const { autokick } = require("../configs/config.json"),
      { mainguildid } = require("../configs/config.json"),
      { botlogs } = require("../configs/channels.json"),
      client = require("../index"),
      bots = require("../models/bots");

client.on("guildMemberRemove", async (client, member, guild) => {
    if (guild.id !== mainguildid) return
    const botget = await bots.find({ ownerID: member.user.id })
    if (botget) {
        botget.forEach(async x => {
            const robot = guild.members.cache.get(x.botID)
            client.channels.cache.get(botlogs).send({
                embed:{
                    title: 'Auto-expultion...',
                    timestamp: new Date(),
                    thumbnail: {
                        url: robot.user.displayAvatarURL()
                    },
                    color: '#FF0000',
                    description: `<@${member.user.id}> vient juste de quiter le serveur. Son robot <@${robot.user.id}> a donc été supprimé !`
                }
            });

            if (autokick === true) robot.kick("Bot supprimé de la liste.")
            await bots.deleteOne({ mainguildid, botID: x.botID })
        });
    }
})