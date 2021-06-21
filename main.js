const { Client, Collection } = require('discord.js'),
      client = new Client(),
      config = require('./configs/config.json'),
      fs = require('fs'),
      { green, red, magenta, blue, underline } = require('colors'),
      { no, yes } = require('./configs/emojis.json'),
      { botslogs } = require('./configs/channels.json'),
      { verificator } = require('./configs/roles.json'),
      Database = require('easy-json-database'),
      likesdb = new Database('./database/likes.json'),
      descdb = new Database('./database/description.json'),
      propriodb = new Database('./database/proprio.json'),
      prefixdb = new Database('./database/prefix.json'),
      sitedb = new Database('./database/siteweb.json'),
      supportdb = new Database('./database/support.json'),
      verifstatutdb = new Database('./database/verifstatut.json'),
      ticketsdb = new Database('./database/tickets.json');
      

client.prefix = config.prefix;
client.color = config.color;
client.yes = yes;
client.no = no;
client.botAllowed = config.botAllowed;
client.commands = new Collection();
client.events = new Collection();
client.botlogs = botslogs;
client.verificator = verificator;
client.version = "2.1";

// database
client.dbLikes = likesdb;
client.dbDesc = descdb;
client.dbProprio = propriodb;
client.dbSupport = supportdb;
client.dbSite = sitedb;
client.dbPrefix = prefixdb;
client.dbVerifStatut = verifstatutdb;
client.dbTickets = ticketsdb;

["aliases", "categories"].forEach(x => { client[x] = new Collection() });

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
        if (!file.endsWith('.js')) return undefined;
        const props = require(`./commands/${file}`),
              cmdName = file.split('.')[0];
        if (props.help.aliases) {
            props.help.aliases.forEach(alias => {
                client.aliases.set(alias, props);
            });
        }
        if (props.help.category) {
            client.categories.set(props.help.category, props);
        }
        console.log(`${green('[COMMANDS]')} Commande ${underline(cmdName)} chargée avec succès !`)
        client.commands.set(cmdName, props);
    })
});

fs.readdir("./events/", (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
        if (!file.endsWith('.js')) return undefined;
        const event = require(`./events/${file}`),
              eventName = file.split('.')[0];
        console.log(`${magenta('[EVENTS]')} Évènement ${eventName} chargé avec succès !`)
        client.events.set(eventName, event);
        client.on(eventName, event.bind(null, client));
    })
});
setTimeout(() => {
    console.log('==================================================================' + '\n' + blue(`Récapitulatif : ${client.commands.size} commandes chargées et ${client.events.size} évènements chargés`) + '\n' + '==================================================================')
}, 500)


client.login(config.token)
