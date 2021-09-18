const { Message, Client } = require("discord.js"),
    bumps = require("../models/bumps"),
    client = require("../index");

/**
 * @param {Message} message
 */
bumpChecker = module.exports = async (message) => {
    if (message.author.id !== "302050872383242240") return;

    const desc = message.embeds[0].description;

    if (desc.includes("avant que le serveur puisse être bumpé !")) return message.channel.send({ content: `**${client.no} ➜ Zut alors ! Quelqu'un a déjà bumpé avant toi. Mais n'hésites surtout pas à retenter ta chance !**`});

    let user_id = desc.substr(2, 18),
        userGet = await bumps.findOne({ userId: user_id });

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
}