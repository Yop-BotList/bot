'use strict';

const { MessageEmbed } = require("discord.js"),
      { autokick } = require("../configs/config.json"),
      { mainguildid } = require("../configs/config.json"),
      { botlogs } = require("../configs/channels.json"),
      bots = require("../models/bots");

module.exports = async(client, member) => {
    if (member.guild.id !== mainguildid) return
    const botget = await bots.find({ ownerID: member.user.id })
    if (botget) {
        botget.forEach(async x => {
            const robot = await member.guild.members.fetch(x.botID),
                  e = new MessageEmbed()
                  .setTitle("Auto-expultion...")
                  .setColor(client.color)
                  .setTimestamp(new Date())
                  .setThumbnail(robot.user.displayAvatarURL())
                  .setDescription(`<@${member.user.id}> vient juste de quiter le serveur. Son robot <@${robot.user.id}> a donc été supprimé !`)
            client.channels.cache.get(botlogs).send({ embeds: [e] });

            if (autokick === true) robot.kick("Bot supprimé de la liste.")
            await bots.deleteOne({ botID: x.botID })
        });
    }
}