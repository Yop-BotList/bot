import { blue, green, red } from "colors";
import { ChannelType, Client, Collection, Partials } from "discord.js";
import { readdirSync } from "fs";
import { cpus, loadavg, totalmem } from "os";
import { join } from "path";
import { text } from "figlet";
import { config, emotes, channels } from "./configs";
import mongoconnection from "./functions/mongoose";

class Class extends Client {
    version: string;
    cooldowns: Collection<string, any>;
    commands: Collection<string | undefined, any>;
    slashs: Collection<string | undefined, any>;
    config: { token: string; prefix: string; mongooseConnectionString: string; color: { hexa: string; integer: number; }; autokick: boolean; staffGuildId: string; owners: string[]; mainguildid: string; antiinvite: boolean; };
    emotes: { yes: string; no: string; bof: string; offline: string; online: string; streaming: string; idle: string; dnd: string; boost: string; loading: string; sort: string; entre: string; alerte: string; notif: string; question: string; cadena: string; badges: { verifieddevelopper: string; balance: string; mod: string; bravery: string; bughuntergold: string; bughunter: string; brillance: string; hypesquadevent: string; partner: string; staff: string; earlysupporter: string; verifiedbot: string; system: string; badges: string; }; discordicons: { list: string; bot: string; textchannel: string; wave: string; entre: string; game: string; id: string; hierarchie: string; key: string; man: string; img: string; tag: string; clyde: string; horloge: string; }; };
    
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
                "DirectMessageTyping",
                "MessageContent"
            ],
            allowedMentions: {
                repliedUser: false
            }
        });
        
        this.config = config;
        this.emotes = emotes;
        this.version = require("../package.json").version;
        this.cooldowns = new Collection();
        this.commands = new Collection();
        this.slashs = new Collection();
        mongoconnection.init();

        try {
            this.launch().then(() => { console.log(blue('Tout est prêt, connexion à Discord !')); })
        } catch (error: any) {
            throw new Error(error)
        }

        this.login(token);
    }

    async launch(): Promise<any> {
        console.log(green(`[BOT]`) + " Bot prêt !");
        this._commandsHandler();
        this._slashHandler();
        this._eventsHandler();
        this._processEvent();
        this._startingMessage();
    }

    async postSlashs(slashsArray: any): Promise<void> {
        if (this.isReady() !== true) throw new Error("Le client n'est pas connecté");

        const guild = this.guilds.cache?.get(this.config.mainguildid);
        if (!guild) throw new Error("Impossible de trouver le serveur de slashs commands test."); 

        const clientSlashs = slashsArray.filter((slash: any) => slash?.guildOnly !== true).toJSON();
        const guildSlashs = slashsArray.filter((slash: any) => slash?.guildOnly === true).toJSON();

        try {
            await this?.application?.commands.set(clientSlashs);
            await guild.commands.set(guildSlashs);
        } catch (error: any) {
            throw new Error(error);
        }

        console.log(`${green("[Success]")} Slashs Commands Posted\nClient Commands: ${this?.application?.commands.cache.size}\nGuild Commands: ${guild.commands.cache.size}`);
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
     * @param {String} slashCommand - Slash file name without .ts or .js
     * @return {Promise<String>}
     */
    reloadSlashCommand(slashCommand: string): Promise<String> {
        return new Promise((_resolve) => {
            const folders = readdirSync(join(__dirname, "slashs"));
            for (let i = 0; i < folders.length; i++) {
                const commands = readdirSync(join(__dirname, "slashs", folders[i]));
                if (commands.includes(`${slashCommand}.${__dirname.endsWith("src") ? "ts": "js"}`)) {
                    try {
                        delete require.cache[require.resolve(join(__dirname, "slashs", folders[i], `${slashCommand}.${__dirname.endsWith("src") ? "ts": "js"}`))]
                        const command = require(join(__dirname, "slashs", folders[i], `${slashCommand}.${__dirname.endsWith("src") ? "ts": "js"}`));
                        this.slashs.delete(command.name)
                        this.slashs.set(command.name, command);
                        console.log(`${green('[SLASHCOMMANDS]')} Commande slash ${slashCommand} rechargée avec succès !`)
                        _resolve(`**${emotes.yes} ➜ Commande slash \`${slashCommand}\` rechargée avec succès !**`)
                    } catch (error: any) {
                        console.log(`${red('[SLASHCOMMANDS]')} Une erreur est survenue lors du rechargement de la commande ${slashCommand}: ${error.stack || error}`)
                        _resolve(`**${emotes.no} ➜ Impossible de recharger la commande \`${slashCommand}\` !**`)
                    }
                }
            }
            _resolve(`**${emotes.no} ➜ Commande slash introuvable !**`)
        })
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

    reloadAllSlashCommands(): Promise<String> {
        return new Promise((_resolve) => {
            let count = 0;
            const folders = readdirSync(join(__dirname, "slashs"));
            for (let i = 0; i < folders.length; i++) {
                const commands = readdirSync(join(__dirname, "slashs", folders[i]));
                count = count + commands.length;
                for(const c of commands){
                    try {
                        this.reloadSlashCommand(c.split('.')[0]);
                    } catch (error: any) {
                        throw new Error(`${red('[SLASHCOMMANDS]')} Une erreur est survenue lors du rechargement de la commande ${c}: ${error.stack || error}`)
                    }
                }
            }
            console.log(`${green('[SLASHCOMMANDS]')} ${this.slashs.size}/${count} commandes slash rechargée(s)`);
            _resolve(`**${emotes.yes} ➜ \`${this.slashs.size}\`/\`${count}\` commande(s) slash rechargée(s) !**`)
        })
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

    _eventsHandler(): any {
        let count = 0;
        const files = readdirSync(join(__dirname, "events"));
        files.forEach((event) => {
            try {
                count++;
                const file = require(join(__dirname, "events", event));
                this.on(event.split('.')[0], file.bind(null, this));
                delete require.cache[require.resolve(join(__dirname, "events", event))];
            } catch (error: any) {
                throw new Error(`${red('[EVENTS]')} Une erreur est survenue lors du chargement de l'évènement ${event} : ${error.stack || error}`)
            }
        });
        console.log(`${green('[EVENTS]')} ${count}/${files.length} évènements chargé(s) !`)
    }

    _processEvent() {
        process.on('unhandledRejection', (error: any) => {
            if(error.code === 50007) return;
            console.error(green('Une erreur est survenue : ') + red(error.stack));
            const channel = this.channels.cache?.get(channels.botlogs);
            if (channel?.type === ChannelType.GuildText) channel.send({
                content: `${this.config.owners.map(owner => `<@${owner}> `)}`,
                embeds: [{
                    description: `🔺 **Une erreur est survenue :**\n\`\`\`js\n${error}\`\`\``,
                    color: this.config.color.integer,
                    fields: [
                        {
                            name: "🔺 Détails :",
                            value: `\`\`\`js\n${error.stack}\`\`\``
                        }
                    ]
                }]
            });
        });
    }

    _startingMessage() {
        const cpuCores = cpus().length;
        //Custom Starting Message
        text('Yop-Bot', {
            font: "Standard"
        }, function(err, data) {
            if (err) {
                console.log('Quelque chose ne va pas...');
                console.dir(err);
                return;
            }
            const data2 = data;
            text('A botlist manager', {
            }, function(err, data) {
                if (err) {
                    console.log('Quelque chose ne va pas...');
                    console.dir(err);
                    return;
                }
                console.log("================================================================================================================================"+"\n"+
                                data2+"\n\n"+ data +"\n"+
                            "================================================================================================================================"+ "\n"+
                                `CPU: ${(loadavg()[0]/cpuCores).toFixed(2)}% / 100%` + "\n" +
                                `RAM: ${Math.trunc((process.memoryUsage().heapUsed) / 1000 / 1000)} MB / ${Math.trunc(totalmem() / 1000 / 1000)} MB` + "\n" +
                                //`Discord WebSocket Ping: ${this.ws.ping}` + "\n" +
                            "================================================================================================================================"
                );
            });

        });
    }
}

export = Class;

new Class(config.token);