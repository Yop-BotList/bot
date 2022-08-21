import { Message } from "discord.js";
import Class from "../..";
import { roles } from "../../configs";
import Command from "../../utils/Command";

class Invitegen extends Command {
    constructor() {
        super({
            name: 'invitegen',
            category: 'Staff',
            description: 'Générer une invitation.',
            aliases: ["igen"],
            usage: 'invitegen <id>',
            example: ["invitegen 692374264476860507"],
            cooldown: 5,
            minArgs: 1,
            requiredRole: roles.verificator
        });
    }
    
    async run(client: Class, message: Message, args: string[]) {
        let member;
        try {
            member = await client.users.fetch(args[0]);
        } catch (error) {
            return message.reply(`**${client.emotes.no} ➜ Veuillez entrer un identifiant valide.**`);
        }
        
        if (!member.bot) return message.reply(`**${client.emotes.no} ➜ Cet utilisateur n’est pas un robot.**`);
        
        message.reply({
            embeds: [
                {
                    title: "Générateur de liens d’invitation :",
                    thumbnail: {
                        url: member.displayAvatarURL()
                    },
                    timestamp: new Date().toISOString(),
                    color: client.config.color.integer,
                    description: `Pour obtenir le lien d’invitation de ${member.tag}, [cliquez ici](https://discord.com/oauth2/authorize?client_id=${member.id}&permissions=0&scope=bot%20applications.commands)`
                }
            ] 
        });
    }
}

export = new Invitegen;