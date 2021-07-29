const { welcomechannel } = require("../configs/channels.json");

module.exports = (client, member) => {
    if (!member.user.bot) {
        client.channels.cache.get(welcomechannel).send(`**<a:entre:838336027616739338> | Un \`${member.user.username}\` sauvage tape l'incruste dans le serveur !**`)
    }
    if (member.user.bot) {
        client.channels.cache.get(welcomechannel).send(`**<a:entre:838336027616739338> | Oh non, de la concurrance <:Panda_horrible:838335972931272745> ! Nan, je rigole ! Bienvenue à toi <@${member.user.id}> :wink:**`)
    }
}
