const { blue, green } = require('colors'),
      { online, offline } = require("../configs/emojis.json"),
      { owner, prefix } = require("../configs/config.json"),
      { connection } = require("mongoose"),
      { botlogs } = require('../configs/channels.json'),
      remind = require("../models/reminds");

module.exports = async(client) => {
    console.log(`Connecté en tant que ${blue(`${client.user.tag}`)}`);
    
    /* botlogs verification */
    if (!client.channels.cache.get(botlogs)) {
       console.log(red("[ERROR]") + " L'identifiant du salon de logs est invalide.")
        setTimeout(() => {
            client.destroy()
        }, 100)
    }
    client.channels.cache.get(botlogs).send({ content: `**${online} ➜ Je suis maintenant connecté !**` });

    /* mongoose verification */
    connection.on("disconnected", () => {
        console.log(red("[DATABASE] MongoDB déconnecté !"))
        client.channels.cache.get(botlogs).send("**" + offline + " ➜ La base de donnée est déconnectée !**")
    });
    connection.on("connected", () => {
        console.log(green("[DATABASE] MongoDB reconnecté ! !"))
        client.channels.cache.get(botlogs).send("**" + online + " ➜ La base de donnée est reconnectée !**")
    });
    
/* owner’s verification */
    if (!client.users.fetch(owner)) {
        console.log(red("[ERROR]") + " L'identifiant de l'owner est invalide.")
        client.channels.cache.get(botlogs).send(client.no + ` ➜ Impossible de retrouver un utilisateur portant l'identifiant \`${owner}\` !`)
        setTimeout(() => {
            client.destroy()
        }, 100)
    }

    /* Bot’s Activity */
    const activities = [`${prefix}help | Version ${client.version}`,'By Nolhan#2508'];
    setInterval(async () => {
        await client.user.setActivity(activities[Math.floor(Math.random() * activities.length)]);
    }, 120000);

    setInterval(async () => {
        const reminds = await remind.find({});
        if (!reminds || reminds.length == 0) return;
        reminds.forEach(x => {
            if (endsAt <= Date.now()) {
                const user = client.users.cache.get(x.userId);
                if (!user) return await remind.deleteOne({ userId: x.userId });

                client.channels.cache.get(x.chanId).send({
                    content: `<@${x.userId}>, je vous ai rappelé pour que vous puissiez bumper le serveur.`
                });
                await remind.deleteOne({ userId: x.userId });
            }
        });
    }, 5000);
};
