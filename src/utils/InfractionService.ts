import{ User, GuildMember, Guild } from "discord.js";
import prettyMilliseconds from "pretty-ms";
import Class from "..";
import { roles, channels } from '../configs';
import { users } from '../models';

async function newInfraction(client: Class, user: User, mod: GuildMember, guild: Guild, type: string, reason: string, duration: number) {
    return new Promise(async (resolve) => {
        if (!guild.id) return new Error(`L'argument guild n'est pas valide. Veuillez entrer l'object Guild.`);
        
        if (!user) return new Error("L'argument user est requis");
        
        if (!mod) return new Error("L'argument mod est requis");
        if (!type || !["TIMEOUT", "KICK", "BAN", "WARN"].includes(type)) return new Error("L'argument type n'est pas valide.");
        
        const member = await guild.members.fetch(user.id).catch(() => null);
        
        if (roles.bypass && guild.roles.cache.get(roles.bypass) && member && member.roles.cache.has(roles.bypass)) return resolve(`**${client.emotes.no} ➜ Ce membre est immunisé contre les sanctions.**`);
        
        if (user.bot && type !== "KICK") return resolve(`**${client.emotes.no} ➜ Cette sanction ne peut être appliquée à un bot.**`);
        
        if (user.id === guild.ownerId) return resolve(`**${client.emotes.no} ➜ Vous ne pouvez pas sanctionner le propriétaire du serveur.**`);
        
        if (member && member.roles?.highest.position >= mod.roles?.highest.position && mod.id !== guild.ownerId) return resolve(`**${client.emotes.no} ➜ Ce membre est au même rang ou plus haut que vous dans la hiérarchie des rôles de ce serveur. Vous ne pouvez donc pas le sanctionner.**`);
        
        if (!reason) return resolve(`**${client.emotes.no} ➜ Veuillez entrer une raison.**`);
        
        if (!duration && type === "TIMEOUT" || !duration && type === 'BAN') return resolve(`**${client.emotes.no} ➜ Veuillez entrer une durée.**`);
        
        const dataUsers = await users.find();
        
        let warns = 0;
        
        dataUsers.forEach(async (x) => {
            if (x.warns && x.warns.length > 0) warns + x.warns.length;
        });
        
        const warnCode = warns + 1,
        endOn = duration && duration > 0 ? duration + Date.now() : undefined,
        REASON = reason ? reason : "Aucune raison indiquée.";
        
        const data = {
            id: warnCode,
            userId: user.id,
            modId: mod.user.id,
            type: type,
            reason: REASON,
            duration: duration,
            finishOn: endOn,
            date: Date.now(),
            deleted: false,
            historyLogs: []
        }
        
        let db = await users.findOne({ userId: user.id });

        if (!db) {
            new users({
                userId: user.id,
                avis: null,
                cmdbl: false,
                ticketsbl: false,
                warns: [],
                totalNumbers: 0
            }).save();
        }
        
        db = await users.findOne({ userId: user.id });
        
        db!.warns.push(data);
        db!.save();
        
        if (type === "BAN") {
            if (member && !member.bannable) return resolve(`**${client.emotes.no} ➜ Je ne peux pas bannir ce membre.**`);
            guild.bans.create(user.id, { reason: REASON });
        }
        if (type === "KICK") {
            if (!member || !member.kickable) return resolve(`**${client.emotes.no} ➜ Cet utilisateur n'est pas présent sur le serveur.**`);
            member.kick(REASON);
        }
        if (type === "TIMEOUT") {
            if (!member || !member.moderatable) return resolve(`**${client.emotes.no} ➜ Cet utilisateur n'est pas présent sur le serveur.**`);
            member.timeout(duration, REASON);
        }
        
        let fields = [
            { 
                name: `${client.emotes.discordicons.man} ➜ Utilisateur :`,
                value: "```md\n# " + user.tag + " (" + user.id + ")" + "```",
                inline: false
            },
            {
                name: `${client.emotes.badges.staff} ➜ Modérateur :`, 
                value: "```md\n# " + mod.user.tag + " (" + mod.id + ")" + "```",
                inline: false
            },
            {
                name: `${client.emotes.discordicons.tag} ➜ Type :`, 
                value: "```md\n# " + type + "```",
                inline: false
            },
            {
                name: `${client.emotes.badges.mod} ➜ Raison :`, 
                value: "```md\n# " + REASON + "```",
                inline: false
            }
        ];
        
        if (duration > 0) fields.push({
            name: `${client.emotes.discordicons.horloge} ➜ Durée :`, 
            value: "```md\n# " + prettyMilliseconds(duration, { compact: true }) + "```",
            inline: false
        });
        
        let embed = {
            title: 'Nouvelle infraction',
            color: client.config.color.integer,
            timestamp: new Date().toISOString(),
            thumbnail: {
                url: user.displayAvatarURL()
            },
            fields: fields
        }
        
        user.send({ embeds: [embed] }).catch(async() => fields.push({
            name: `:warning: ➜ Avertissement`,
            value: "```md\n# Je n'ai pas pu prévenir " + user.tag + " de sa sanction.```",
            inline: false
        }));
        
        embed = {
            title: 'Nouvelle infraction', 
            color: client.config.color.integer,
            timestamp: new Date().toISOString(),
            thumbnail: {
                url: user.displayAvatarURL()
            },
            fields: fields
        }
        
        const channel = client.channels.cache.get(channels.modlogs);
        
        if (channel && channel.isTextBased()) channel.send({ embeds: [embed] }).catch(() => {})
        
        resolve(`**${client.emotes.yes} ➜ Utilisateur sanctionné.**`);
    });
}

async function deleteInfraction(client: Class, user: User, code: Number) {
    return new Promise(async (resolve) => {
        const data = await users.findOne({ userId: user.id });

        if (!data) return resolve(`**${client.emotes.no} ➜ Utilisateur introuvable !**`);

        if (!data.warns || data.warns.filter(warn => warn.id === code && warn.deleted === false).length === 0) resolve(`**${client.emotes.no} ➜ Infraction introuvable pour cet utilisateur.**`);

        let infraction = data.warns.filter(warn => warn.id === code)[0];

        data.warns = data.warns.filter(warn => warn.id !== code);

        infraction.deleted = true;

        data.warns.push(infraction);
        data.save();
        
        return resolve(`**${client.emotes.yes} ➜ Infraction supprimée.**`);
    });
}

export {
    newInfraction,
    deleteInfraction
};