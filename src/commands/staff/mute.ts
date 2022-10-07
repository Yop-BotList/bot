import { Message } from "discord.js";
import Class from "../..";
import Command from "../../utils/Command";
import { newInfraction } from "../../utils/InfractionService";
import ms from 'ms';

class Mute extends Command {
    constructor() {
        super({
            name: 'warn',
            category: 'Staff',
            description: 'Rendre un membre muet.',
            usage: 'mute <utilisateur> [durée] <raison>',
            botPerms: ["EmbedLinks", "SendMessages", "ReadMessageHistory", "ModerateMembers"],
            perms: ["ModerateMembers"],
            minArgs: 2
        });
    }
    
    async run(client: Class, message: Message, args: string[]) {
        const member = message.mentions.members!.first() || message.guild!.members.cache.get(args[0]) || await message.guild!.members.fetch(args[0]).catch(() => null);
        if (!member || !member.user) return message.reply(`**${client.emotes.no} ➜ Veuillez entrer un membre valide.**`)
        if (member.user.bot) return message.reply(`**${client.emotes.no} ➜ Le saviez-vous, il est impossible de rendre muet un bot.**`)
        if (member.roles?.highest.position >= message.member!.roles?.highest.position) return message.reply(`**${client.emotes.no} ➜ Ce membre est au même rang ou plus haut que vous dans la hiérarchie des rôles de ce serveur. Vous ne pouvez donc pas le sanctionner.**`)
        if (!member?.moderatable) return message.reply(`**${client.emotes.no} ➜ Zut alors ! Je ne peux pas rendre muet ce membre ! Essaie peut-être de mettre mon rôle un peu plus haut dans la hiérarchie du serveur :p**`)

        const reason = args.slice(2).join(" ") || null;

	    if (!reason) return message.reply(`**${client.emotes.no} ➜ Veuillez entrer une raison.**`)

        const duration = args[1] && ms(args[1]) ? ms(args[1].toLowerCase()) : ms("1d");

        message.reply(`**${client.emotes.yes} ➜ ${member.user.tag} a été rendu muet avec succès !**`)

        await newInfraction(client, member.user, message.member!, message.guild!, "TIMEOUT", reason, duration)

        message.reply(`**${client.emotes.yes} ➜ ${member.user.tag} a été rendu muet avec succès !**`)
    }
}

export = new Mute;
