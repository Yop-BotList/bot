const { Client, Message, MessageEmbed } = require('discord.js'),
    users = require("../../models/avis"),
    { avischannel } = require("../../configs/channels.json"),
    { isclient } = require("../../configs/roles.json"),
    { prefix } = require("../../configs/config.json");

module.exports = {
    name: 'avis',
    aliases: ["rate", "review"],
    categories : 'utils', 
    permissions: isclient, 
    description: 'Donner un avis sur la vérification de votre robot.',
    cooldown : 5,
    usage: 'avis <avis>',
    /** 
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const userGet = await users.findOne({ userId: message.author.id, avis: true }),
              text = args.join(" ");
    
        if (userGet) return message.reply({ content: `**${client.no} ➜ Tu ne peux pas donner d'avis car tu en a déjà donné un.**` });
    
        if (!text) return message.reply({ content: `**${client.no} ➜ Tu dois entrer un avis : \`${prefix}avis [avis]\`**`});

        const msg = await client.channels.cache.get(avischannel).send({
            content: null,
            embeds: [
                new MessageEmbed()
                .setTitle(`Avis de ${message.author.username} sur la vérification de son robot :`)
                .setColor(client.color)
                .setThumbnail(message.author.displayAvatarURL())
                .setTimestamp(new Date())
                .setDescription(`\`\`\`py\n"${text}"\`\`\``)
            ]
        });
        msg.react('💜');
        message.reply({ content: `**${client.yes} ➜ Votre avis a bien été envoyé !**` });
        
        await users.findOneAndUpdate({
            userId: message.author.id
        }, {
            avis: true
        }, {
            new: true
        })
    }
}
