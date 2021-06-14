const { blue } = require('colors'),
      { botlogs } = require('../configs/channels.json'),
      { online } = require('../configs/emojis.json');

module.exports = (client) => {
    console.log(blue(`- Connexion de ${client.user.tag} réussie.\n- Base de données connectée.`) + "\n==================================================================")
    client.channels.cache.get(botlogs).send("**" + online + " | Je viens tout juste de me connecter !**")
    
    client.user.setActivity('hémerger d\'un profond sommeil...');
    const activities = [`${client.prefix}help | By Nolhan#2508`, `Version 1.8 | By Nolhan#2508`];
    setInterval(async () => {
            await client.user.setActivity(activities[Math.floor(Math.random() * activities.length)]);
            }, 120000);
}