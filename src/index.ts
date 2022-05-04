import { green, red } from "colors";
import { ChannelType, Client, Collection, Partials } from "discord.js";
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
            partials: [
                Partials.User,
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.Reaction
            ],
            intents: [
                "Guilds",
                "GuildMembers",
                "GuildBans",
                "GuildEmojisAndStickers",
                "GuildIntegrations",
                "GuildInvites",
                "GuildVoiceStates",
                "GuildPresences",
                "GuildMessages",
                "GuildMessageReactions",
                "GuildMessageTyping",
                "DirectMessages",
                "DirectMessageReactions",
                "DirectMessageTyping"
            ]
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
                        if (channel?.type !== ChannelType.GuildText) return console.log("Le salon de logs n'est pas un salon textuel !");
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
                        if (channel?.type !== ChannelType.GuildText) return console.log("Le salon de logs n'est pas un salon textuel !");
                        channel.send(`**${emotes.yes} ➜ Évènement \`${eventName}\` rechargé avec succès !**`);
                        _resolve(`**${emotes.yes} ➜ Évènement \`${eventName}\` rechargé avec succès !**`);
                    }
                } catch (error: any) {
                    console.log(`${red('[EVENTS]')} Une erreur est survenue lors du rechargement de l’évènement ${event} : ${error.stack || error}`);
                    _resolve(`**${emotes.no} ➜ Impossible de recharger l’évènement \`${eventName}\` !**`);
                }
            });
            _resolve(`**${emotes.no} ➜ Évènement \`${eventName}\` introuvable !**`);
        });
    }

    reloadAllCommands(): Promise<String> {
        return new Promise((_resolve) => {
            let count = 0;
            const folders = readdirSync(join(__dirname, "commands"));
            for (let i = 0; i < folders.length; i++) {
                const commands = readdirSync(join(__dirname, "commands", folders[i]));
                count = count + commands.length;
                for(const command of commands){
                    try {
                        this.reloadCommand(command.split('.')[0]);
                    } catch (error: any) {
                        console.log(`${red('[COMMANDS]')} Impossible de recharger la commande ${command} : ${error.stack || error}`);
                    }
                }
            }
            console.log(`${green('[COMMANDS]')} ${this.commands.size}/${count} Commandes rechargées !`);
            _resolve(`**${emotes.yes} ➜ \`${this.commands.size}\`/\`${count}\` commandes rechargées !**`);
            const channel = this.channels.cache?.get(channels.botlogs);
            if (channel?.type !== ChannelType.GuildText) return console.log("Le salon de logs n'est pas un salon textuel !");
            channel.send(`**${emotes.yes} ➜ \`${this.commands.size}\`/\`${count}\` commandes rechargées !**`);
        });
    }
    
    reloadAllEvents(): Promise<String> {
        return new Promise((_resolve) => {
            const files = readdirSync(join(__dirname, "events"));
            let count = 0;
            files.forEach((event) => {
                try {
                    count++;
                    this.reloadEvent(event.split('.')[0]);
                } catch (error: any) {
                    console.log(`${red('[EVENTS]')} Impossible de recharger l’évènement ${event} : ${error.stack || error}`);
                }
            });
            console.log(`${green('[EVENTS]')} ${count}/${files.length} Évènements rechargés !`);
            _resolve(`**${emotes.yes} ➜ \`${count}\`/\`${files.length}\` évènements rechargés !**`);
            const channel = this.channels.cache?.get(channels.botlogs);
            if (channel?.type !== ChannelType.GuildText) return console.log("Le salon de logs n'est pas un salon textuel !");
            channel.send(`**${emotes.yes} ➜ \`${count}\`/\`${files.length}\` évènements rechargés !**`);
        });
    }

    async launch(): any {
        console.log(green(`[BOT]`) + " Bot prêt !");
        this.commands = new Collection();
        this.slashs = new Collection();
        this._commandsHandler();
        this._slashHandler();
        this._eventsHandler();
        this._processEvent();
        this._startingMessage();
    }

    _commandsHandler(): any {
        let count = 0;
        const folders = readdirSync(join(__dirname, "commands"));
        for (let i = 0; i < folders.length; i++) {
            const commands = readdirSync(join(__dirname, "commands", folders[i]));
            count = count + commands.length;
            for(const c of commands){
                try {
                    const command = require(join(__dirname, "commands", folders[i], c));
                    this.commands.set(command.name, command);
                } catch (error: any) {
                    console.log(`${red('[COMMANDS]')} Une erreur est survenue lors du rechargement de la commande ${c} : ${error.stack || error}`)
                }
            }
        }
        console.log(`${green('[COMMANDS]')} ${this.commands.size}/${count} commandes chargée(s) !`)
    }

    _slashHandler(): any {
        let count = 0;
        const folders = readdirSync(join(__dirname, "slashs"));
        for (let i = 0; i < folders.length; i++) {
            const slashs = readdirSync(join(__dirname, "slashs", folders[i]));
            count = count + slashs.length;
            for(const c of slashs){
                try {
                    const slash = require(join(__dirname, "slashs", folders[i], c));
                    this.slashs.set(slash.name, slash);
                } catch (error: any) {
                    console.log(`${red('[SLASHCOMMANDS]')} Une erreur est survenue lors du chargement de la commande ${c} : ${error.stack || error}`)
                }
            }
        }
        console.log(`${green('[SLASHCOMMANDS]')} ${this.slashs.size}/${count} commandes slash chargée(s)`)
    }

    _eventsHandler():  any {
        let count = 0;
        const files = readdirSync(join(__dirname, "events"));
        files.forEach((e) => {
            try {
                count++;
                const fileName = e.split('.')[0];
                const file = require(join(__dirname, "events", e));
                this.on(fileName, file.bind(null, this));
                delete require.cache[require.resolve(join(__dirname, "events", e))];
            } catch (error) {
                throw new Error(`${red('[EVENTS]')} Une erreur est survenue lors du chargement de l'évènement ${e} : ${error.stack || error}`)
            }
        });
        console.log(`${green('[EVENTS]')} ${count}/${files.length} évènements chargé(s) !`)
    }
}

module.exports = new Class(config.token);