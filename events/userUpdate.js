const bots = require("../models/bots"),
    { mainguildid } = require("../configs/config.json"),
    client = require("../index");

client.on("userUpdate", async (oldUser, newUser) => {
    if (oldUser.bot && newUser.bot) {
        if (oldUser.username !== newUser.username) {
            let botGet = await bots.findOne({ botID: newUser.id });

            if (!botGet) return;

            const memberGet = client.guilds.cache.get(mainguildid)?.members.cache.get(botGet.botID);

            if (!memberGet) return;

            memberGet.setNickname(`[${botGet.prefix}] ${newUser.username}`);
        }
    }
});
