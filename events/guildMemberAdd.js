const { welcomechannel } = require("../configs/channels.json"),
      { botintests, botrole } = require("../configs/roles.json"),
      { mainguildid } = require("../configs/config.json"),
      bots = require("../models/bots"),
      client = require("../index"),
      { MessageEmbed } = require("discord.js");

client.on("guildMemberAdd", async(client, member, guild) => {
    if (guild.id !== mainguildid) return;
    if (!member.user.bot) {
        client.channels.cache.get(welcomechannel).send(`**<a:entre:838336027616739338> ➜ Un \`${member.user.username}\` sauvage tape l'incruste dans le serveur !**`)
        const e = new MessageEmbed()
        .setTitle("Bienvenue / Welcome")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setColor(client.color)
        .setTimestamp(new Date())
        .setDescription(`🇫🇷 ➜ Bienvenue à toi **${member.user.username}** sur **${guild.name}** !\n • Pense à __lire__ <#782659401672425482> et à faire fonctionner notre <#782659487706120192>.\n • Si tu est **développeur de bots**, jette un coup d’œil au <#782659940678369350>.\n\n • Passe un bon moment avec nous !\n\n🇺🇸 ➜ Welcome to you **${member.user.username}** on **${guild.name}** !\n • Think __to read__ the <#782659401672425482> and use the <#782659487706120192>.\n • If you’re a **bot developer**, read the <#782659940678369350>.\n\n • Have a good moment with us !`)
        client.users.cache.get(member.user.id).send({ embeds: [e] });
    }
    if (member.user.bot) {
        const db = await bots.findOne({ botID: member.user.id })
        // roles
        if (db) member.roles.add(botintests);
        member.roles.add(botrole);
        // autorename
        if (db) member.setNickname(`[${db.prefix}] ${member.user.username}`)
        // message
        client.channels.cache.get(welcomechannel).send(`**<a:entre:838336027616739338> ➜ Oh non, de la concurrance <:Panda_horrible:838335972931272745> ! Nan, je rigole ! Bienvenue à toi <@${member.user.id}> :wink:**`)
    }
})