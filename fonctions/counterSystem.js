const counter = require("../models/counter"),
      { counterChannel } = require("../configs/channels.json");

module.exports = async (message) => {
    const { channelId, content, author } = message;
    if (message.channelId !== counterChannel) return;
    if (author.bot) return;
    
    const number = parseInt(content),
          get = await counter.findOne();
    
    if (get.lastUser === author.id) { 
        await message.reply({
            content: "Tu ne peux pas envoyer deux nombres à la suite.",
            ephemeral: true
        });
        return message?.delete();
    }
    
    if (!isNaN(number)) {
        await message.reply({
            content: "Tu n'as pas envoyé de nombre ou ton message contient du texte.",
            ephemeral: true
        });
        return message?.delete();
    }
    
    if ((get.lastNumber + 1) !== number)) {
        await message.reply({
            content: `Le nombre suivant est ${get.lastNumber + 1}, il ne peut pas être un autre.`,
            ephemeral: true
        });
        return message?.delete();
    }
    
    await counter.findOneAndUpdate({
        lastNumber: get.lastNumber
    }, {
        $set: {
            lastNumber: number,
            lastUser: author.id
        }
    }, {
        upsert: true
    });
}
