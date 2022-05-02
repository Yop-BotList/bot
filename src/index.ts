import { green, red } from "colors";
import Discord, { Client, Collection } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { config, emotes, channels } from "./configs";
import mongoconnection from "./functions/mongoose";

class Class extends Client {
    config: { token: string; prefix: string; mongooseConnectionString: string; color: string; autokick: boolean; staffGuildId: string; owners: string[]; mainguildid: string; antiinvite: boolean; };
    emotes: { yes: string; no: string; bof: string; offline: string; online: string; streaming: string; idle: string; dnd: string; boost: string; loading: string; sort: string; entre: string; alerte: string; };
    version: any;
    cooldowns: Collection<string, any>;
    commands: Collection<string, any>;
    
    constructor(token: string) {
        super({
            partials: ["USER","CHANNEL","GUILD_MEMBER","MESSAGE","REACTION"],
            intents: ["GUILDS","GUILD_MEMBERS","GUILD_BANS","GUILD_EMOJIS_AND_STICKERS","GUILD_INTEGRATIONS","GUILD_INVITES","GUILD_VOICE_STATES","GUILD_PRESENCES","GUILD_MESSAGES","GUILD_MESSAGE_REACTIONS","GUILD_MESSAGE_TYPING","DIRECT_MESSAGES","DIRECT_MESSAGE_REACTIONS","DIRECT_MESSAGE_TYPING"]
        });
        
        this.config = config;
        this.emotes = emotes;
        this.version = require("../package.json").version;
        this.cooldowns = new Collection();
        this.commands = new Collection();
        mongoconnection.init();
    }
    
    /**
     * @param {String} commandName - Event file name without .ts or .js
     * @return {Promise<String>}
     */
    reloadCommand(commandName: string): Promise<String> {
        return new Promise((_resolve) => {
            const folders = readdirSync(join(__dirname, "commands"));
            for (let i = 0; i < folders.length; i++) {
                const commands = readdirSync(join(__dirname, "commands", folders[i]));
                if (commands.includes(`${commandName}.${__dirname.endsWith("src") ? "ts": "js"}`)) {
                    try {
                        delete require.cache[require.resolve(`./commands/${folders[i]}/${commandName}.${__dirname.endsWith("src") ? "ts": "js"}`)];
                        const command = require(`./commands/${folders[i]}/${commandName}.${__dirname.endsWith("src") ? "ts": "js"}`);
                        this.commands.set(command.name, command);
                        console.log(`${green('[COMMANDS]')} Commande ${commandName} rechargée avec succès !`);
                        const channel = this.channels.cache?.get(channels.botlogs);
                        if (channel?.type !== "GUILD_TEXT") throw new Error("Le salon de logs n'est pas un salon textuel !");
                        channel.send(`**${emotes.yes} ➜ Commande \`${commandName}\` rechargée avec succès !**`);
                        _resolve(`**${emotes.yes} ➜ Commande \`${commandName}\` rechargée avec succès !**`);
                    } catch (error: any) {
                        console.log(`${red('[COMMANDS]')} Une erreur est survenue lors du rechargement de la commande ${commandName} : ${error.stack || error}`);
                        _resolve(`**${emotes.no} ➜ Impossible de recharger la commande \`${commandName}\` !**`);
                    }
                }
            }
            
            _resolve(`**${emotes.no} ➜ Commande introuvable !**`);
        });
    }
    
    /**
     * @param {String} eventName - Event file name without .ts or .js
     * @return {Promise<String>}
     */
    reloadEvent(eventName: string): Promise<String> {
        return new Promise((_resolve) => {
            const files = readdirSync(join(__dirname, "events"));
            files.forEach((event) => {
                try {
                    const fileName = event.split('.')[0];
                    if(fileName === eventName) {
                        const file = require(join(__dirname, "events", event));
                        this.off(fileName, file.default);
                        this.on(fileName, file.bind(null, this));
                        delete require.cache[require.resolve(join(__dirname, "events", event))];
                        console.log(`${green('[EVENTS]')} Évenèment ${eventName} rechargé avec succès !`);
                        const channel = this.channels.cache?.get(channels.botlogs);
                        if (channel?.type !== "GUILD_TEXT") throw new Error("Le salon de logs n'est pas un salon textuel !");
                        channel.send(`**${emotes.yes} ➜ Évènement \`${eventName}\` rechargé avec succès !**`);
                        _resolve(`**${emotes.yes} ➜ Évènement \`${eventName}\` rechargé avec succès !**`);
                    }
                } catch (error: any) {
                    console.log(`${red('[EVENTS]')} Une erreur est survenue lors du rechargement de l’évènement ${event} : ${error.stack || error}`);
                    _resolve(`**${emotes.no} ➜ Impossible de recharger l’évènement \`${eventName}\` !**`);
                }
            });
            _resolve(`**${emotes.no} ➜ Évènement \`${eventName}\` introuvable !**`);
        })
    }
}