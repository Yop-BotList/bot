const { Client, Collection } = require("discord.js"),
  { readdirSync } = require("fs"),
  { version } = require("./package.json"),
  { yes, no } = require("./configs/emojis.json"),
  { token, mongooseConnectionString, color } = require("./configs/config.json"),
  { connect } = require("mongoose")

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


["command"].forEach((handler) => {
  require(`./utils/${handler}`)(client);
});

client.login(token);
