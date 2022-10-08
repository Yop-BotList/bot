import { Message } from "discord.js";
import Class from "../..";
import Command from "../../utils/Command";
import { newInfraction } from "../../utils/InfractionService";
import ms from 'ms';

class Ban extends Command {
    constructor() {
        super({
            name: 'ban',
            category: 'Staff',
            description: 'Bannir un membre.',
            usage: 'ban <utilisateur> [durée] <raison>',
            botPerms: ["EmbedLinks", "SendMessages", "ReadMessageHistory", "BanMembers"],
            perms: ["BanMembers"],
            minArgs: 2
        });
    }
    
    async run(client: Class, message: Message, args: string[]) {
        const member = message.mentions.members!.first() || message.guild!.members.cache.get(args[0]) || await message.guild!.members.fetch(args[0]).catch(() => {});

        if (!member || !member.user) return message.reply(`**${client.emotes.no} ➜ Veuillez entrer un membre valide.**`);

        if (member.user.bot) return message.reply(`**${client.emotes.no} ➜ Le saviez-vous, il est impossible de bannir un bot.**`);

        if (member.roles?.highest.position >= message.member!.roles?.highest.position) return message.reply(`**${client.emotes.no} ➜ Ce membre est au même rang ou plus haut que vous dans la hiérarchie des rôles de ce serveur. Vous ne pouvez donc pas le sanctionner.**`);

        if (!member?.moderatable) return message.reply(`**${client.emotes.no} ➜ Zut alors ! Je ne peux pas rendre muet ce membre ! Essaie peut-être de mettre mon rôle un peu plus haut dans la hiérarchie du serveur :p**`);

        const duration = args[1] && ms(args[1]) ? ms(args[1].toLowerCase()) : 0;

        
        const reason = !ms(args[1]) ? args.slice(1).join(" ") : args.slice(2).join(" ");

	    if (!reason) return message.reply(`**${client.emotes.no} ➜ Veuillez entrer une raison.**`);

        await newInfraction(client, member.user, message.member!, message.guild!, "BAN", reason, duration).then(async (res: any) => {
            if (res) await message.reply(res)
        })
    }
}

export = new Ban;
