'use strict';

const Command = require("../../structure/Command.js"),
      { verificator, isclient, botintests, listedbot } = require("../../configs/roles.json"),
      { autokick } = require("../../configs/config.json"),
      { botslogs } = require("../../configs/channels.json"),
      { MessageEmbed } = require("discord.js"),
      bots = require("../../models/bots");

class Delete extends Command {
    constructor() {
        super({
            name: 'delete',
            category: 'staff',
            description: 'Supprimer un bot de la liste.',
            usage: "delete <id> <raison>",
            example: ["delete 692374264476860507 Spam"],
            perms: "ADMINISTRATOR",
            cooldown: 120,
            botPerms: ["EMBED_LINKS", "SEND_MESSAGES", "READ_MESSAGES", "KICK_MEMBERS"]
        });
    }

    async run(client, message, args) {
        if (!args[0]) return message.reply({ content: `**${client.no} ➜ Merci de me donner une ID de bot.**`});
        let botGet = await bots.findOne({ botID: args[0], verified: true });
        if (!botGet) return message.reply({ content: `**${client.no} ➜ Le bot ${member.user.tag} ne peut pas être supprimé car il n'est pas vérifié !**` });
        const member = await message.guild.members.fetch(botGet.botID);
        


        if (!args.slice(1).join(" ")) return message.reply({ content: `**${client.no} ➜ Vous n'avez pas donné de raison de suppresion.` });
        
        
        client.channels.cache.get(botslogs).send({
            content: `<@${botGet.ownerID}>`,
            embeds: [
                new MessageEmbed()
                .setTitle("Suppression...")
                .setTimestamp(new Date())
                .setThumbnail(member.user.displayAvatarURL())
                .setColor("#FF0000")
                .setFooter(`Vous pensez que c'est une erreur ? Envoyez-moi un Message Privé !`)
                .setDescription(`<@${message.author.id}> vient juste de supprimer le bot ${member.user.username} pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\``)
            ]
        });

        message.channel.send({ content: `${client.yes} ➜ Le bot ${member.user.username}#${member.user.discriminator} vient bien d'être supprimé pour la raison suivante :\n\`\`\`${args.slice(1).join(' ')}\`\`\`` });

        await bots.deleteOne({ botID: args[0] });

        if (autokick === true) member.kick();
    }
}

module.exports = new Delete;