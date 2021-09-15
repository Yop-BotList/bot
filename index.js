const { Client, Message, MessageEmbed, Collection } = require("discord.js");
const colors = require("colors");
const fs = require("fs");
const { version } = require("./package.json"),
      { yes, no } = require("./configs/emojis.json");
const client = new Client({
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
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGES"],
});
module.exports = client;

const config = require("./configs/config.json");
// MongoDB
const mongoose = require("mongoose");
mongoose
  .connect(config.mongooseConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("MongoDB Connecté.."));

const prefix = config.prefix;
const token = config.token;


client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.cooldowns = new Collection();
client.slashCommands = new Collection();
client.categories = fs.readdirSync("./commands/");
client.color = config.color;
client.version = version;
client.yes = yes;
client.no = no;


["command"].forEach((handler) => {
  require(`./handler/${handler}`)(client);
});

client.login(token);
