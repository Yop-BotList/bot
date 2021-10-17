'use strict';

const SlashCommand = require("../../structure/SlashCommand.js");

class Stats extends SlashCommand {
    constructor() {
        super({
            name: 'stats',
        });
    }

    async run(client, interaction) {
           const [GlobalUsersInfo] = await client.db.query(`SELECT * FROM users WHERE guildid = "${interaction.guild_id}"`)
    const [GlobalEmojiInfo] = await client.db.query(`SELECT * FROM emote WHERE guildid = "${interaction.guild_id}"`)
    let TotalUserTalk = [], TotalUserUsedEmoji = [], TotalEmojiPublished = 0, TotalDifferentEmojiPublish = [], TotalCustomEmojiPublish = [],TotalEmojiPublish = [], TotalAnimatedEmojiPublish = [], GlobalEmojiStat = [], GlobalUserStats = [];
    for(let i = 0;i<GlobalUsersInfo.length;i++){
        if(GlobalUsersInfo[i].message >= 1){
            if(!TotalUserTalk.includes(GlobalUsersInfo[i].id)){
                TotalUserTalk.push(GlobalUsersInfo[i].id)
            }
        }
    let index = GlobalUserStats.findIndex((find) => find.id === GlobalUsersInfo[i].id);
        if(index === -1){
            GlobalUserStats.push(GlobalUsersInfo[i])
        }else{
          GlobalUserStats[index].message += GlobalUsersInfo[i]
        GlobalUserStats[index].message_delete+= GlobalUsersInfo[i].message_delete
        GlobalUserStats[index].message_update+= GlobalUsersInfo[i].message_update
        GlobalUserStats[index].link+= GlobalUsersInfo[i].link
        GlobalUserStats[index].discord_link+= GlobalUsersInfo[i].discord_link
        GlobalUserStats[index].image_link+= GlobalUsersInfo[i].image_link
        GlobalUserStats[index].video_link+= GlobalUsersInfo[i].video_link
        GlobalUserStats[index].audio_link+= GlobalUsersInfo[i].audio_link
        GlobalUserStats[index].file+= GlobalUsersInfo[i].file
        GlobalUserStats[index].image_file+= GlobalUsersInfo[i].image_file
        GlobalUserStats[index].audio_file+= GlobalUsersInfo[i].audio_file
        GlobalUserStats[index].video_file+= GlobalUsersInfo[i].video_file
        GlobalUserStats[index].invite_create+= GlobalUsersInfo[i].invite_create
        GlobalUserStats[index].invite_used+= GlobalUsersInfo[i].invite_used
        GlobalUserStats[index].invite_join += GlobalUsersInfo[i].invite_join
        GlobalUserStats[index].invite_leave+= GlobalUsersInfo[i].invite_leave
        GlobalUserStats[index].emote+= GlobalUsersInfo[i].emote
        GlobalUserStats[index].custom_emote+=GlobalUsersInfo[i].custom_emote
        GlobalUserStats[index].reaction_add+= GlobalUsersInfo[i].reaction_add
        GlobalUserStats[index].reaction_remove+= GlobalUsersInfo[i].reaction_remove
        }

    }
    for(let i = 0;i<GlobalEmojiInfo.length;i++){
        TotalEmojiPublished += GlobalEmojiInfo[i].count;
        if(!TotalUserUsedEmoji.includes(GlobalEmojiInfo[i].userid)){
            TotalUserUsedEmoji.push(GlobalEmojiInfo[i].userid)
        }
      if(GlobalEmojiInfo[i].id === "0"){
        if(!TotalEmojiPublish.includes(GlobalEmojiInfo[i].name)){
            TotalEmojiPublish.push(GlobalEmojiInfo[i].name)
            }
        }else{
            let currentEmote = client.emojis.cache.get(GlobalEmojiInfo[i].id);
                if(currentEmote.animated === true){
                    if(!TotalAnimatedEmojiPublish.includes(currentEmote.id)){
                        TotalAnimatedEmojiPublish.push(currentEmote.id)
                    }
                }else{
                     if(!TotalCustomEmojiPublish.includes(currentEmote.id)){
                        TotalCustomEmojiPublish.push(currentEmote.id)
                    }
                }
        }
    let index = GlobalEmojiStat.findIndex((find) => find.id === GlobalEmojiInfo[i].id && find.name === GlobalEmojiInfo[i].name);
        if(index === -1){
            GlobalEmojiStat.push(GlobalEmojiInfo[i])
        }else{
            GlobalEmojiStat[index] += GlobalEmojiInfo[i].count
        }
    }
setTimeout(() =>{
    const resumeUser = {
        usercount: TotalUserTalk.length,
        usersdata: GlobalUserStats
    }
    const resumeEmoji = {
        usercount: TotalUserUsedEmoji.length,
        globalemojicount: TotalEmojiPublished - (TotalEmojiPublish.length + TotalAnimatedEmojiPublish.length),
        customemojicount: TotalEmojiPublish.length,
        animatedemojicount: TotalAnimatedEmojiPublish.length,
        emojicount: TotalEmojiPublished,
        emojiData: GlobalEmojiStat
    }
    const Embed = {
        description: "Voici les statistiques du serveur depuis mon ajout dessus ! ",
        fields:[{
            name: "Utilisateurs ayant écrit au moins 1 message",
            value: resumeUser.usercount,
            inline: false
        },
        {
            name: "Utilisateurs ayant envoyé au moins 1 emoji",
            value: resumeEmoji.usercount,
            inline: false
        },
        {
            name: "Nombre d'émoji global envoyé",
            value: resumeEmoji.globalemojicount,
            inline: false
        },
        {
            name: "Nombre d'émoji custom (et non animé) envoyé",
            value: resumeEmoji.customemojicount,
            inline: false
        },
        {
            name: "Nombre d'émoji custom et animé envoyé",
            value: resumeEmoji.animatedemojicount,
            inline: false
        },
        {
            name: "Nombre d'émoji total envoyé",
            value: resumeEmoji.emojicount,
            inline: false
        }]
}
client.api.interactions(interaction.id, interaction.token).callback.post({data: {
  type: 4,
  data: {
    embeds: [Embed]
  }
}})
            },1000)
    }
}

module.exports = new Stats;