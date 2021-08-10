const { welcomechannel } = require("../configs/channels.json"),
      { botintests, botrole } = require("../configs/roles.json"),
      { red } = require("colors");

module.exports = (client, member) => {
    if (!member.user.bot) {
        client.channels.cache.get(welcomechannel).send(`**<a:entre:838336027616739338> | Un \`${member.user.username}\` sauvage tape l'incruste dans le serveur !**`)
    }
    if (member.user.bot) {
        // roles
            if (client.dbProprio.has(`Proprio_${member.user.id}`)) member.roles.add(botintests);
            member.roles.add(botrole);
        // autorename
        if (client.dbPrefix.has(`Prefix_${member.user.id}`)) member.setNickname(`[${client.dbPrefix.get(`Prefix_${member.user.id}`)}] ${member.user.username}`)
        // message
        client.channels.cache.get(welcomechannel).send(`**<a:entre:838336027616739338> | Oh non, de la concurrance <:Panda_horrible:838335972931272745> ! Nan, je rigole ! Bienvenue à toi <@${member.user.id}> :wink:**`)
    }
}
