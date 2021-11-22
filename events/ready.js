'use strict';

const { blue, red, green } = require('colors'),
      { online } = require("../configs/emojis.json"),
      { owner, prefix } = require("../configs/config.json"),
      { botlogs } = require('../configs/channels.json'),
      remind = require("../models/reminds"),
      botconfig = require("../models/botconfig");

module.exports = async(client) => {
    console.log(`${green('[BOT]')} Joue à : ${blue('Démarrage en cours...')}`);

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
     
         /* botsconfig verification */
         const db = await botconfig.findOne()
         if (!db) new botconfig({ suggests: 0, warns: 0 }).save();
     
         /* Bot’s Activity */
         const activities = [`${prefix}help`, `Version ${client.version}`,'By Nolhan#2508'];
         await client.user.setActivity("Démarrage en cours...", { type: "STREAMING", url: "https://twitch.tv/discord" });
         console.log(green("[BOT]") + ` Connecté en tant que ${blue(`${client.user.tag}`)}`);
         setInterval(async () => {
             await client.user.setActivity(activities[Math.floor(Math.random() * activities.length)], { type: "STREAMING", url: "https://twitch.tv/discord" });
             
             
     
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
};
