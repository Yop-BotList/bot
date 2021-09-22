const { blue, red } = require('colors'),
      { online } = require("../configs/emojis.json"),
      { owner, prefix } = require("../configs/config.json"),
      checkConnection = require("../fonctions/checkConnection"),
      { botlogs } = require('../configs/channels.json'),
      remind = require("../models/reminds"),
      client = require("../index");

client.on("ready", async () => {
    console.log(`Connecté en tant que ${blue(`${client.user.tag}`)}`);
    
    /* botlogs verification */
    if (!client.channels.cache.get(botlogs)) {
       console.log(red("[ERROR]") + " L'identifiant du salon de logs est invalide.")
            return client.destroy()
    }
    client.channels.cache.get(botlogs).send({ content: `**${online} ➜ Je suis maintenant connecté !**` });
    
    /* owner’s verification */
    if (!client.users.fetch(owner)) {
        console.log(red("[ERROR]") + " L'identifiant de l'owner est invalide.")
        client.channels.cache.get(botlogs).send({ content: client.no + ` ➜ Impossible de retrouver un utilisateur portant l'identifiant \`${owner}\` !` })
            return client.destroy()
    }

    /* Bot’s Activity */
    const activities = [`${prefix}help | Version ${client.version}`,'By Nolhan#2508'];
    setInterval(async () => {
        await client.user.setActivity(activities[Math.floor(Math.random() * activities.length)]);
        
        checkConnection(client);

        /* reminds */
        const reminds = await remind.find();
        if (!reminds || reminds.length == 0) return;
        reminds.forEach(async x => {
            if (x.endsAt <= Date.now()) {
                const user = client.users.cache.get(x.userId);
                if (!user) return await remind.deleteOne({ userId: x.userId });

                client.channels.cache.get(x.chanId).send({
                    content: `<@${x.userId}>, je vous ai rappelé pour que vous puissiez bumper le serveur.`
                });
                await remind.deleteOne({ userId: x.userId });
            }
        });
    }, 120000);
});
