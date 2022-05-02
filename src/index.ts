import Discord, { Client, Collection } from "discord.js";
import { config, emotes } from "./configs";

class Class extends Client {
    config: { token: string; prefix: string; mongooseConnectionString: string; color: string; autokick: boolean; staffGuildId: string; owners: string[]; mainguildid: string; antiinvite: boolean; };
    emotes: { yes: string; no: string; bof: string; offline: string; online: string; streaming: string; idle: string; dnd: string; boost: string; loading: string; sort: string; entre: string; alerte: string; };
    version: any;
    cooldowns: Collection<string, any>;

    constructor(token: string) {
        super({
            partials: ["USER","CHANNEL","GUILD_MEMBER","MESSAGE","REACTION"],
            intents: ["GUILDS","GUILD_MEMBERS","GUILD_BANS","GUILD_EMOJIS_AND_STICKERS","GUILD_INTEGRATIONS","GUILD_INVITES","GUILD_VOICE_STATES","GUILD_PRESENCES","GUILD_MESSAGES","GUILD_MESSAGE_REACTIONS","GUILD_MESSAGE_TYPING","DIRECT_MESSAGES","DIRECT_MESSAGE_REACTIONS","DIRECT_MESSAGE_TYPING"]
        });

        this.config = config;
        this.emotes = emotes;
        this.version = require("../package.json").version;
        this.cooldowns = new Collection();
    }
}