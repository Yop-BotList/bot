const { welcomechannel } = require("../configs/channels.json"),
      { botintests, botrole } = require("../configs/roles.json"),
      { mainguildid } = require("../configs/config.json"),
      bots = require("../models/bots");

client.on("guildMemberAdd", async(client, member, guild) => {
    if (guild.id !== mainguildid) return;
    if (!member.user.bot) {
        client.channels.cache.get(welcomechannel).send(`**<a:entre:838336027616739338> ➜ Un \`${member.user.username}\` sauvage tape l'incruste dans le serveur !**`)
    }
    if (member.user.bot) {
        const db = await bots.findOne({ serverID: mainguildid, BotID: member.user.id })
        // roles
            if (db) member.roles.add(botintests);
            member.roles.add(botrole);
        // autorename
        if (db) member.setNickname(`[${db.prefix}] ${member.user.username}`)
        // message
        client.channels.cache.get(welcomechannel).send(`**<a:entre:838336027616739338> ➜ Oh non, de la concurrance <:Panda_horrible:838335972931272745> ! Nan, je rigole ! Bienvenue à toi <@${member.user.id}> :wink:**`)
    }
})