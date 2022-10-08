import { Message } from "discord.js";
import Class from "../..";
import Command from "../../utils/Command";
import { newInfraction } from "../../utils/InfractionService";

class Kick extends Command {
    constructor() {
        super({
            name: 'kick',
            category: 'Staff',
            description: 'Exclure un membre.',
            usage: 'kick <utilisateur> <raison>',
            botPerms: ["EmbedLinks", "SendMessages", "ReadMessageHistory", "KickMembers"],
            perms: ["KickMembers"],
            minArgs: 2
        });
    }
    
    async run(client: Class, message: Message, args: string[]) {
        const member = message.mentions.members!.first() || message.guild!.members.cache.get(args[0]) || await message.guild!.members.fetch(args[0]).catch(() => {});
        if (!member || !member.user) return message.reply({ content: `**${client.emotes.no} ➜ Veuillez entrer un membre valide.**` });
        
        if (member?.roles?.highest.position >= message.member!.roles.highest.position) return message.reply({ content: `**${client.emotes.no} ➜ Ce membre est au même rang ou plus haut que vous dans la hiérarchie des rôles de ce serveur. Vous ne pouvez donc pas le sanctionner.**` });
        if (member?.user.bot) return message.reply({ content: `**${client.emotes.no} ➜ Pour exclure un robot listé, veuillez utiliser la commande \`${client.config.prefix}delete\` et pour un robot non listé, veuillez effectuer l'exclusion manuellement.**` });
        
        const reason = args.slice(1).join(" ") || null;
        
        if (!reason) return message.reply(`**${client.emotes.no} ➜ Veuillez entrer une raison.**`);
        
        await newInfraction(client, member.user, message.member!, message.guild!, "KICK", reason, 0).then(async (res: any) => {
            if (res) await message.reply(res)
        })
    }
}

export = new Kick;
