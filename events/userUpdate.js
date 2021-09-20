const bots = require("../models/bots");

module.exports = async (client, oldUser, newUser) => {
    if (oldUser.bot && newUser.bot) {
        if (oldUser.username !== newUser.username) {
            let botGet = await bots.findOne({ botID: newUser.id });

            if (!botGet) return;

            const memberGet = client.guilds.cache.get("782644006190055486")?.members.cache.get(botGet.botID);

            if (!memberGet) return;

            memberGet.setNickname(`[${botGet.prefix}] ${newUser.username}`);
        }
    }
}