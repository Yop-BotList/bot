const Discord = require('discord.js'),
      config = require('../configs/config.json'),
      { cyan, underline } = require('colors');

exports.run = async (client, message, args) => {
    if (message.author.id !== config.owner) return message.channel.send(client.no + " | Vous n'avez pas la permission d'utiliser cette commande.")
    if (!args[0]) return message.channel.send('```y!reload-cmd <commande>```')

    const cmdName = args[0].toLowerCase();

    try {
        delete require.cache[require.resolve(`./${cmdName}.js`)]
        client.commands.delete(cmdName)
        const pull = require(`./${cmdName}.js`)
        client.commands.set(cmdName, pull)
    } catch(e) {
        return message.channel.send(client.no + ` | Je n'ai pas réussi à recharger la commande \`${args[0]}\``)
    }
    message.channel.send(client.yes + ` | La commande \`${args[0]}\` a bien été rechargé !`)
    console.log(`${cyan("[RELOAD]")} ${message.author.tag} viens de recharger la commande ${underline(cmdName)}`)
};

exports.help = {
    name: "reload-cmd",
    category: "owner",
    aliases: ["rc"],
    description: "Recharger une commande.",
    usage: "reload-cmd <commande>",
    example: ["reload-cmd help"]
}