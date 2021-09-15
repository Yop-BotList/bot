const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'eval',
    aliases: ['e'],
    categories : 'owner', 
    permissions : 'owner', 
    description: 'Évaluer un code.',
    cooldown : 5,
    usage: 'eval <code>',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        if (!args[0]) return message.channel.send("```y!eval <code>```")
    	if (message.content.toLowerCase().match(`token`)) return message.channel.send(client.no + " | Attention ! J'ai détecté le mot `token` dans ton message. Évite cela si tu veux garder ton accès à cette commande.")
        if (message.content.toLowerCase().match('client.destroy()')) return message.channel.send(client.no + " | Attention ! J'ai détecté le mot `client.destroy()` dans ton message. Évite cela si tu veux garder ton accès à cette commande.")
        if (message.content.toLowerCase().match('roles.remove')) return message.channel.send(client.no + " | Attention ! J'ai détecté le mot `roles.remove` dans ton message. Évite cela si tu veux garder ton accès à cette commande.")
        if (message.content.toLowerCase().match("roles.add")) return message.channel.send(client.no + " | Attention ! J'ai détecté le mot `roles.add` dans ton message. Évite cela si tu veux garder ton accès à cette commande.")

        let code;
        try {
            const coded = eval(args.join(" "))
            code = coded
        }
        catch (err) {
            code = err.message
        }
        const e = new MessageEmbed()
        .setColor(client.color)
        .setThumbnail(message.author.displayAvatarURL())
        .setTitle(`Évaluation d'un code en Javascript :`)
        .setTimestamp(Date())
        .addField("➜ Entrée :", `\`\`\`js\n${args.join(" ")}\`\`\``)
        .addField("➜ Sortie :", `\`\`\`js\n${code}\`\`\``)

        message.channel.send({ embeds: [e] })
    }
}