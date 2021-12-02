const counter = require("../models/counter"),
      { counterChannel } = require("../configs/channels.json");

module.exports = async (message) => {
    const { channelId, content, author } = message;
    if (message.channelId !== counterChannel) return;
    
    const number = parseInt(content),
          get = await counter.findOne();
    
    if (get.lastUser === author.id) return await message.reply({
        content: "Tu ne peux pas envoyer deux nombres à la suite.",
        ephemeral: true
    });
    
    if (!isNaN(number)) return await message.reply({
        content: "Tu n'as pas envoyé de nombre ou ton message contient du texte.",
        ephemeral: true
    });
    
    if ((get.lastNumber + 1) !== number)) return await message.reply({
        content: `Le nombre suivant est ${get.lastNumber + 1}, il ne peut pas être un autre.`,
        ephemeral: true
    });
    
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
