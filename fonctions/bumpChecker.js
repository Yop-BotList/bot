const { Message, MessageButton, MessageActionRow } = require("discord.js"),
    bumps = require("../models/bumps"),
    reminds = require("../models/reminds"),
    client = require("../index"),
    ms = require("ms"),
    reminder = new MessageButton()
    .setStyle(1)
    .setEmoji("🔔")
    .setCustomId("confirmRemind"),
    no = new MessageButton()
    .setStyle(4)
    .setEmoji("❌")
    .setCustomId("cancelRemind"),
    row = new MessageActionRow()
    .addComponents(reminder, no),
    emojis = require("../configs/emojis.json");

/**
 * @param {Message} message
 */
bumpChecker = module.exports = async (message) => {
    if (message.author.id !== "302050872383242240") return;

    let desc = message.embeds[0].description;

    let user_id = desc.substr(2, 18),
        userGet = await bumps.findOne({ userId: user_id });

    if (desc.includes("avant que le serveur puisse être bumpé !")) {
        message.channel.send({ content: `**${emojis.no} ➜ Zut alors ! Quelqu'un a déjà bumpé avant toi. Mais n'hésites surtout pas à retenter ta chance !**`});
        
        if (await reminds.findOne({ userId: user_id })) return;

        const msg = await message.channel.send({
            content: `Voulez vous vous faire rappeler par le bot quand vous pourrez à nouveau bumper le serveur ?\nSi oui appuyez sur le bouton 🔔.`,
            components: [row]
        });

        const filter = i => i.customId === "confirmRemind" || i.customId === "cancelRemind" && i.user.id === user_id;
        const collector = await msg.channel.createMessageComponentCollector({ filter, componentType: "BUTTON" });

        collector.on("collect", async (button) => {
            if (button.customId === "confirmRemind") {
                desc = desc.slice(39).substr(0, 3);
                if (desc.includes(" ")) {
                    desc = desc.substr(0, 2)
                    if (desc.includes(" ")) desc = desc.substr(0, 1)
                }
                desc = `${desc}m`;
            
                new reminds({
                    userId: user_id,
                    chanId: message.channel.id,
                    endsAt: Date.now() + ms(desc)
                }).save();
                await button.reply({
                    content: `${emojis.yes} ➜ Parfait, vous allez être rappelé dans ${desc} pour pouvoir bumper le serveur.`,
                    ephemeral: true
                });
                await msg.edit({ content: "Rappel activé.", components: [] });
                await collector.stop();
            }
            if (button.customId === "cancelRemind") {
                await button.reply({
                    content: `Vous avez annulé le rappel.`,
                    ephemeral: true
                });
                await msg.edit({ content: `Rappel annulé.`, components: [] });
                await collector.stop();
            }
        });
    }

    if (!desc.includes("Bump effectué !")) return;

    if (!userGet) {
        new bumps({
            userId: user_id,
            bumpCount: 1
        }).save();
    } else {
        await bumps.findOneAndUpdate({
            userId: user_id
        }, {
            bumpCount: userGet.bumpCount+1
        }, {
            new: true
        });
    }

    userGet = await bumps.findOne({ userId: user_id });

    message.channel.send({ content: `**${client.yes} ➜ Merci <@${user_id}> d'avoir bumpé le serveur, tu as maintenant **${userGet.bumpCount}** points de bump.**` });

    if (await reminds.findOne({ userId: user_id })) return;

    const msg = await message.channel.send({
        content: `Voulez vous vous faire rappeler par le bot quand vous pourrez à nouveau bumper le serveur ?\nSi oui appuyez sur le bouton 🔔.`,
        components: [row]
    });
    const filter = i => i.customId === "confirmRemind" || i.customId === "cancelRemind" && i.user.id === user_id;
    const collector = await msg.channel.createMessageComponentCollector({ filter, componentType: "BUTTON" });
    collector.on("collect", async (button) => {
        if (button.customId === "confirmRemind") {
            desc = `120m`;
        
            new reminds({
                userId: user_id,
                chanId: message.channel.id,
                endsAt: Date.now() + ms(desc)
            }).save();
            await button.reply({
                content: `${emojis.yes} ➜ Parfait, vous allez être rappelé dans ${desc} pour pouvoir bumper le serveur.`,
                ephemeral: true
            });
            await msg.edit({ content: "Rappel activé.", components: [] });
            await collector.stop();
        }
        if (button.customId === "cancelRemind") {
            await button.reply({
                content: `Vous avez annulé le rappel.`,
                ephemeral: true
            });
            await msg.edit({ content: `Rappel annulé.`, components: [] });
            await collector.stop();
        }
    });
}
