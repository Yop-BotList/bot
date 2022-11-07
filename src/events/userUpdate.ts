import { User } from "discord.js";
import Class from "..";
import bots from "../models/bots";

export = async(client: Class, oldUser: User, newUser: User) => {
    if (oldUser.bot && newUser.bot) {
        if (oldUser.username !== newUser.username) {
            let botGet = await bots.findOne({ botId: newUser.id });

            if (!botGet) return;
            
            botGet.username = newUser.username
            botGet.save()

            const memberGet = client.guilds.cache.get(client.config.mainguildid)?.members.cache.get(`${botGet.botId}`);

            if (!memberGet) return;

            memberGet.setNickname(`[${botGet.prefix}] ${newUser.username}`);
        }
        if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) {
            let botGet = await bots.findOne({ botId: newUser.id });

            if (!botGet) return;
            
            botGet.avatar = newUser.displayAvatarURL()
            botGet.save()
        }
    }
}