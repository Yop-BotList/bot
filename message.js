const config = require('../configs/config.json');

module.exports = (client, message) =>  {
    if (message.content.indexOf(client.prefix) !== 0) return;
    const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.aliases.get(command);
    if (!cmd) return message.channel.send(client.no + ' | Désolé, mais je ne trouve pas cette commande.');
    if (cmd) {
        if (message.author.bot && config.botsAllowed === false) return message.channel.send('**' + client.no + ' | Désolé, mais je suis configuré pour ne pas répondre aux autres bots.**');
        if (message.channel.type === 'dm') return message.channel.send(client.no + " | Désolé, mais mes commandes sont utilisables uniquement dans un serveur.")
        cmd.run(client, message, args)
    }
}