const { Client, Collection } = require("discord.js"),
  { readdirSync } = require("fs"),
  { version } = require("./package.json"),
  { yes, no } = require("./configs/emojis.json"),
  { token, mongooseConnectionString, color } = require("./configs/config.json"),
  { connect } = require("mongoose"),
  { join } = require("path"),
  { red, green } = require("colors"),
  { botlogs } = require("./configs/channels.json");
client = new Client({
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  shards: "auto",
  allowedMentions: {
    parse: ["roles", "users", "everyone"],
    repliedUser: true,
  },
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"],
});
module.exports = client;

// MongoDB
connect(mongooseConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(console.log("MongoDB Connecté.."))
.catch(err => new Error(err));

["commands", "aliases", "events", "cooldowns", "slashCommands"].forEach(x => client[x] = new Collection());
client.categories = readdirSync("./commands/");
client.color = color;
client.version = version;
client.yes = yes;
client.no = no;
        //Reload Command Function
        /**
         * @param {String} reload_command - Command file name without .js
         * @return {Promise<String>}
         */
        client.reloadCommand = function(reload_command) {
            return new Promise((resolve) => {
                const folders = readdirSync(join(__dirname, "commands"));
                for (let i = 0; i < folders.length; i++) {
                    const commands = readdirSync(join(__dirname, "commands", folders[i]));
                    if (commands.includes(`${reload_command}.js`)) {
                        try {
                            delete require.cache[require.resolve(join(__dirname, "commands", folders[i], `${reload_command}.js`))]
                            const command = require(join(__dirname, "commands", folders[i], `${reload_command}.js`));
                            client.commands.delete(command.name)
                            client.commands.set(command.name, command);
                            console.log(`${green('[COMMANDS]')} Commande ${reload_command} rechargée avec succès !`)
                            client.channels.cache.get(botlogs).send(`**${yes} ➜ Commande \`${reload_command}\` rechargée avec succès !**`);
                            resolve(`**${yes} ➜ Commande \`${reload_command}\` rechargée avec succès !**`)
                        } catch (error) {
                            console.log(`${red('[COMMANDS]')} Une erreur est survenue lors du rechargement de la commande ${reload_command} : ${error.stack || error}`)
                            resolve(`**${no} ➜ Impossible de recharger la commande \`${reload_command}\` !**`)
                        }
                    }
                }
                resolve(`**${no} ➜ Commande introuvable !**`)
            })
        }
        /**
         * @param {String} reload_event - Event file name without .js
         * @return {Promise<String>}
         */
        client.reloadEvent = function(reload_event) {
            return new Promise((resolve) => {
                const files = readdirSync(join(__dirname, "events"));
                files.forEach((e) => {
                    try {
                        const fileName = e.split('.')[0];
                        if(fileName === reload_event) {
                            const file = require(join(__dirname, "events", e));
                            const res = client.listeners(fileName)
                            client.off(fileName, res[0]);
                            client.on(fileName, file.bind(null, this));
                            delete require.cache[require.resolve(join(__dirname, "events", e))];
                            console.log(`${green('[EVENTS]')} Évenèment ${reload_event} rechargé avec succès !`)
                            client.channels.cache.get(botlogs).send(`**${yes} ➜ Évènement \`${reload_event}\` rechargé avec succès !**`);
                            resolve(`**${yes} ➜ Évènement \`${reload_event}\` rechargé avec succès !**`)
                        }
                    } catch (error) {
                        console.log(`${red('[EVENTS]')} Une erreur est survenue lors du rechargement de l’évènement ${e} : ${error.stack || error}`)
                        resolve(`**${no} ➜ Impossible de recharger l’évènement \`${reload_event}\` !**`)
                    }
                });
                resolve(`**${no} ➜ Évènement \`${reload_event}\` introuvable !**`)
            })
        }
        client.reloadAllCommands = function() {
            return new Promise((resolve) => {
                let count = 0;
                const folders = readdirSync(join(__dirname, "commands"));
                for (let i = 0; i < folders.length; i++) {
                    const commands = readdirSync(join(__dirname, "commands", folders[i]));
                    count = count + commands.length;
                    for(const c of commands){
                        try {
                            client.reloadCommand(c.replace('.js',''));
                        } catch (error) {
                            console.log(`${red('[Commands Reload]')} Failed to reload command ${c}: ${error.stack || error}`)
                            throw new Error(`${red('[Commands Reload]')} Failed to load event ${e}: ${error.stack || error}`)
                        }
                    }
                }
                console.log(`${green('[Commands Reload]')} Reloaded ${client.commands.size}/${count} commands`);
                resolve(`> Reloaded \`${client.commands.size}\`/\`${count}\` commands`)
            })
        }
        client.reloadAllEvents = function() {
            return new Promise((resolve) => {
                let count = 0;
                const files = readdirSync(join(__dirname, "events"));
                files.forEach((e) => {
                    try {
                        count++;
                        const fileName = e.split('.')[0];
                        client.reloadEvent(fileName);
                    } catch (error) {
                        throw new Error(`${red('[Events Reload]')} Failed to load event ${e}: ${error.stack || error}`)
                    }
                });
                console.log(`${green('[Events Reload]')} Loaded ${count}/${files.length} events`);
                resolve(`> Reloaded \`${count}\`/\`${files.length}\` events`)
            })
        }

["command"].forEach((handler) => {
  require(`./utils/${handler}`)(client);
});

client.login(token);
