'use strict';

module.exports = async(client, interaction) => {
    let command = interaction.commandName

    const slash = client.slashs.get(command);   
    if (!slash) {
        return ;
    }


    try {
        slash.run(client, interaction,interaction.options)
    } catch (err) {
       client.emit('error',err);
    }
};