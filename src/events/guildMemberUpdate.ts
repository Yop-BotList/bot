import { red } from "colors";
import {Guild, GuildMember} from "discord.js";
import Class from "..";
import { roles } from "../configs";
import { bots, users } from "../models";

export = async (client: Class, oldMember: GuildMember, newMember: GuildMember) => {
    if (!oldMember && !newMember) return;

    if (!newMember.guild.roles.cache.get(roles.premium) || !newMember.guild.roles.cache.get(roles.premiumbot)) return console.error(red("Please enter a valid id for premium and premiumbot role in the configuration file."));
    if (oldMember.roles.cache.has(roles.premium) && !newMember.roles.cache.has(roles.premium)) await toggleRole(newMember, false);
    if (!oldMember.roles.cache.has(roles.premium) && newMember.roles.cache.has(roles.premium)) await toggleRole(newMember, true);


    if (!newMember.guild.roles.cache.get(roles.partner)) return console.error(red("Please enter a valid id for partner role in the configuration file."));
    if (oldMember.roles.cache.has(roles.partner) && !newMember.roles.cache.has(roles.partner)) await toggleBadge(newMember, false, 'partner')
    if (!oldMember.roles.cache.has(roles.partner) && newMember.roles.cache.has(roles.partner)) await toggleBadge(newMember, true, 'partner')

    if (!newMember.guild.roles.cache.get(roles.staffrole)) return console.error(red("Please enter a valid id for staff role in the configuration file."));
    if (oldMember.roles.cache.has(roles.staffrole) && !newMember.roles.cache.has(roles.staffrole)) await toggleBadge(newMember, false, 'staff')
    if (!oldMember.roles.cache.has(roles.staffrole) && newMember.roles.cache.has(roles.staffrole)) await toggleBadge(newMember, true, 'staff')

    if (!newMember.guild.roles.cache.get(roles.ticketsaccess)) return console.error(red("Please enter a valid id for ticketaccess role in the configuration file."));
    if (oldMember.roles.cache.has(roles.ticketsaccess) && !newMember.roles.cache.has(roles.ticketsaccess)) await toggleBadge(newMember, false, 'support')
    if (!oldMember.roles.cache.has(roles.ticketsaccess) && newMember.roles.cache.has(roles.ticketsaccess)) await toggleBadge(newMember, true, 'support')

    if (!newMember.guild.roles.cache.get(roles.verificator)) return console.error(red("Please enter a valid id for verificator role in the configuration file."));
    if (oldMember.roles.cache.has(roles.verificator) && !newMember.roles.cache.has(roles.verificator)) await toggleBadge(newMember, false, 'verificator')
    if (!oldMember.roles.cache.has(roles.verificator) && newMember.roles.cache.has(roles.verificator)) await toggleBadge(newMember, true, 'verificator')
}

async function toggleRole(newMember: GuildMember, toggle: boolean) {
    await toggleBadge(newMember, toggle, 'premium')

    const userBots = await bots.find({ ownerId: newMember.user.id });
    
    if (userBots.length < 1) return;
    
    userBots.forEach(bot => {
        const botMember = newMember.guild.members.cache.get(`${bot.botId}`);
        
        if (!botMember) return
        
        toggle ? botMember.roles.add(roles.premiumbot) : botMember.roles.remove(roles.premiumbot);
    });
}

async function toggleBadge(newMember: GuildMember, toggle: boolean, badge: "staff" | "partner" | "support" | "verificator" | "premium") {
    const userDB = await users.findOne({ userId: newMember.user.id });
    if (!userDB) return;

    userDB.badges = userDB.badges.filter((b: { id: string; acquired: boolean; }) => b.id !== badge);
    userDB.badges.push({ id: badge, acquired: toggle });
    userDB.save();
}