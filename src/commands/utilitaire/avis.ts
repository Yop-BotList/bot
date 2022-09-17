import { Message } from "discord.js";
import Class from "../..";
import Command from "../../utils/Command";
import { channels } from "../../configs";
import { avis } from "../../models";

class Avis extends Command {
    constructor() {
        super({
            name: 'avis',
            category: 'Utilitaire',
            description: 'Envoyer/Modifier un avis sur le serveur.',
            usage: 'avis <send/edit> <avis>',
            example: ["avis send Super staff et merci d'avoir vérifié mon robot."],
            minArgs: 2
        });
    }

    async run(client: Class, message: Message, args: string[]) {
        if (!["send", "edit"].includes(args[0])) return message.reply(`**${client.emotes.no} ➜ Merci d'utiliser un des arguments suivants: \`send\` ou \`edit\`.\nPuis de mettre votre avis.**`);

        const avisChannel = client.channels.cache.get(channels.avischannel);

        if (!avisChannel || !avisChannel.isTextBased()) {
            message.reply(`**${client.emotes.no} ➜ Une erreur s'est produite lors de l'éxecution de la commande.**`);

            return new Error("La channel d'avis n'est pas un channel de texte ou n'existe pas.");
        }

        const avisMsg = args.slice(1).join(" ");
        const checkAvis = await avis.findOne({ userId: message.author.id });

        if (args[0] === "send") {
            if (checkAvis) return message.reply({ content: `**${client.emotes.no} ➜ Vous avez déjà envoyé un avis sur le serveur, vous pouvez le modifier avec \`${client.config.prefix}avis edit Nouveau avis\`**` });

            const msg = await avisChannel.send({
                embeds: [
                    {
                        title: `Avis de ${message.author.username} sur la vérification de son robot :`,
                        color: client.config.color.integer,
                        thumbnail: {
                            url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date().toISOString(),
                        description: `${avisMsg}`
                    }
                ]
            });

            new avis({
                avis: avisMsg,
                messageId: msg.id,
                userId: message.author.id
            }).save();

            message.reply({ content: `**${client.emotes.yes} ➜ Votre avis a bien été envoyé !**` });
        }

        if (args[0] === "edit") {
            const errorMsg = { content: `**${client.emotes.no} ➜ Vous n'avez pas encore envoyé d'avis sur le serveur, vous pouvez en envoyer un avec \`${client.config.prefix}avis send Nouveau avis\`**` };

            if (!checkAvis) return message.reply(errorMsg);

            const oldAvis = await avisChannel.messages.fetch(`${checkAvis!.messageId}`).catch(() => { });
            
            if (!oldAvis) return message.reply(errorMsg);
            oldAvis.delete();

            const msg = await avisChannel.send({
                embeds: [
                    {
                        title: `Avis de ${message.author.username} sur la vérification de son robot :`,
                        color: client.config.color.integer,
                        thumbnail: {
                            url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date().toISOString(),
                        description: `${avisMsg}`
                    }
                ]
            });

            checkAvis.avis = avisMsg;
            checkAvis.messageId = msg.id;
            checkAvis.save();

            message.reply({ content: `**${client.emotes.yes} ➜ Votre avis a bien été modifié !**` });
        }
    }
}

export = new Avis;