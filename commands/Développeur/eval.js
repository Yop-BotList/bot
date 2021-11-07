'use strict';

const { MessageEmbed } = require("discord.js");
const Command = require("../../structure/Command.js")

class Eval extends Command {
    constructor() {
        super({
            name: 'eval',
            category: 'utils',
            description: 'Évaluer un code.',
            aliases: ["e"],
            example: ["e client.color"],
            perms: 'owner',
            usage: 'eval <code>'
        });
    }

    async run(client, message, args) {
        if (!args[0]) return message.channel.send(`\`\`\`${client.config.prefix}eval <code>\`\`\``)
    	if (message.content.toLowerCase().match(`token`)) return message.channel.send({ content: "**" + client.no + " ➜ Attention ! J'ai détecté le mot `token` dans ton message. Évite cela si tu veux garder ton accès à cette commande.**" });
        if (message.content.toLowerCase().match('client.destroy()')) return message.channel.send({ content: "**" + client.no + " ➜ Attention ! J'ai détecté le mot `client.destroy()` dans ton message. Évite cela si tu veux garder ton accès à cette commande.**" });
        if (message.content.toLowerCase().match('roles.remove')) return message.channel.send({ content: "**" + client.no + " ➜ Attention ! J'ai détecté le mot `roles.remove` dans ton message. Évite cela si tu veux garder ton accès à cette commande.**" });
        if (message.content.toLowerCase().match("roles.add")) return message.channel.send({ content: "**" + client.no + " ➜ Attention ! J'ai détecté le mot `roles.add` dans ton message. Évite cela si tu veux garder ton accès à cette commande.**" });
        if (message.content.toLowerCase().match("mongooseConnectionString")) return message.channel.send({ content:"**" + client.no + " ➜ Attention ! J'ai détecté le mot `mongooseConnectionString` dans ton message. Évite cela si tu veux garder ton accès à cette commande.**" });

        let code;
        try {
            const coded = await eval(args.join(" "))
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

        message.channel.send({ content: null, embeds: [e] });
    }
}

module.exports = new Eval;