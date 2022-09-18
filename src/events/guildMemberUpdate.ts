import { red } from "colors";
import { GuildMember } from "discord.js";
import Class from "..";
import { roles } from "../configs";
import bots from "../models/bots";

export = async (client: Class, oldMember: GuildMember, newMember: GuildMember) => {
    if (!oldMember && !newMember) return;

    if (!newMember.guild.roles.cache.get(roles.premium) || !newMember.guild.roles.cache.get(roles.premiumbot)) return console.error(red("Please enter a valid id for premium and premiumbot role in the configuration file."));
    
    if (oldMember.roles.cache.has(roles.premium) && !newMember.roles.cache.has(roles.premium)) {
        toggleRole(newMember, false);
    }
    
    if (!oldMember.roles.cache.has(roles.premium) && newMember.roles.cache.has(roles.premium)) {
        toggleRole(newMember, true);
    }
}

async function toggleRole(newMember: GuildMember, toggle: boolean) {
    const userBots = await bots.find({ ownerId: newMember.user.id });
    
    if (userBots.length < 1) return;
    
    userBots.forEach(bot => {
        const botMember = newMember.guild.members.cache.get(`${bot.botId}`);
        
        if (!botMember) return
        
        toggle === true ? botMember.roles.add(roles.premiumbot) : botMember.roles.remove(roles.premiumbot);
    });
}