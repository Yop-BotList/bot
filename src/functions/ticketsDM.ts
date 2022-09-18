import { ButtonInteraction, GuildTextBasedChannel, InteractionCollector, Message, SelectMenuInteraction, User } from "discord.js";
import Class from "..";
import { channels, roles } from "../configs";
import { tickets, users } from "../models";

export default class TicketsDM {
    client: Class;
    message: Message<boolean>;
    
    constructor(client: Class, message: Message) {
        this.client = client;
        this.message = message;
        
        if (!this.client.isReady()) throw new Error("Le bot discord n'est pas en ligne.");
    }
    
    async clientSide() {
        if (this.message.author.bot) return;
        
        const getTicket = await tickets.findOne({ userId: this.message.author.id });
        
        if (!getTicket) {
            this._noTicket();
        }
        else {
            const ticketChannel = this.client.channels.cache.get(`${getTicket.channelId}`) as GuildTextBasedChannel;
            
            if (!ticketChannel) return this._noTicket();
            
            const guild = await this.client.guilds.cache.get(this.client.config.mainguildid);
            
            const webhooks = await guild!.channels.fetchWebhooks(ticketChannel.id);
            
            const hook = webhooks.first();
            
            if (this.message.attachments) {
                if (this.message.content) await hook!.send({
                    content: this.message.content,
                    files: [...this.message.attachments.values()]
                }).catch(() => {});
                else await hook!.send({
                    content: null,
                    files: [...this.message.attachments.values()]
                }).catch(() => {});
            } else await hook!.send({
                content: this.message.content
            }).catch(() => {});
            
            return this.message.react("📨");
        }
    }
    
    async _createTicket(reason: string, firstMessage: string, locale: string): Promise<void> {
        const guild = await this.client.guilds.cache.get(this.client.config.mainguildid);
        
        const newTicketChannel = await guild!.channels.create({
            name: `🎫・ticket-${this.message.author.discriminator}`,
            topic: this.message.author.id,
            parent: channels.ticketcategory,
            type: 0,
            permissionOverwrites: [
                {
                    id: guild!.id,
                    deny: ["ViewChannel"]
                }, {
                    id: roles.ticketsaccess,
                    allow: ["AddReactions", "AttachFiles", "EmbedLinks", "ReadMessageHistory", "SendMessages", "UseExternalEmojis", "UseExternalStickers", "ViewChannel"]
                }
            ],
        });
        
        new tickets({
            channelId: newTicketChannel!.id,
            userId: this.message.author.id,
            reason: reason
        }).save();
        
        newTicketChannel.send({
            content: "@here",
            embeds: [
                {
                    title: `${this.client.emotes.discordicons.tag} New ticket of ${this.message.author.tag} (${this.message.author.id})`,
                    fields: [
                        {
                            name: "➜ Reason :", 
                            value: "```md\n# " + reason + "```"
                        }, {
                            name:`➜ Language of ${this.message.author.username}'s Discord Client :`,
                            value: "```md\n# " + locale + "```"
                        }
                    ],
                    color: this.client.config.color.integer,
                    footer: {
                        text: 'YopBot V' + this.client.version
                    }
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 2,
                            emoji: {
                                name: "🔁"
                            },
                            custom_id: "buttonTransfer",
                            label: "➜ Transfer to admins"
                        }, {
                            type: 2,
                            style: 4,
                            emoji: {
                                name: "🗑"
                            },
                            custom_id: "buttonClose",
                            label: "➜ Close ticket"
                        }
                    ]
                }
            ]
        }).then((msg) => msg.pin());
        
        const ticketsLogs = this.client.channels.cache.get(channels.ticketslogs) as GuildTextBasedChannel;
        
        ticketsLogs.send({
            content: null,
            embeds: [
                {
                    title: `New ticket of ${this.message.author.username}#${this.message.author.discriminator}`,
                    timestamp: new Date().toISOString(),
                    color: this.client.config.color.integer,
                    fields: [
                        {
                            name: `:id: ID :`,
                            value: `\`\`\`${this.message.author.id}\`\`\``
                        }, {
                            name: `:newspaper: Reason :`,
                            value: `\`\`\`${reason}\`\`\``
                        }
                    ]
                }
            ]
        });
        
        const hook = await newTicketChannel.createWebhook({
            name: this.message.author.username,
            avatar: this.message.author.displayAvatarURL()
        });
        
        setTimeout(async () => {
            if (this.message.attachments) {
                if (this.message.content) await hook.send({
                    content: this.message.content,
                    files: [...this.message.attachments.values()]
                }).catch(() => {});
                else await hook.send({
                    content: null,
                    files: [...this.message.attachments.values()]
                }).catch(() => {});
            } else await hook.send({
                content: this.message.content
            }).catch(() => {});
        }, 1000);
    }
    
    async _noTicket(): Promise<void> {
        const msg = await this.message.reply({
            embeds: [
                {
                    title: "Contacter le support / Contact support",
                    thumbnail: {
                        url: this.client.user!.displayAvatarURL()
                    },
                    timestamp: new Date().toISOString(),
                    color: this.client.config.color.integer,
                    fields: [
                        {
                            name: "🇫🇷 ➜ Français :",
                            value: `Bonjour/Bonsoir et bienvenue dans le service de support de PubTool. Pour confirmer votre entrée en contact avec l'équipe administrative, veuillez cliquer sur le bouton ci-dessous. En cliquant dessus, vous acceptez que je collecte la langue de votre client Discord. Vous acceptez aussi d'utiliser ce système à bon esscient sous peine de sanctions.`
                        }, {
                            name: "🇺🇸 ➜ English :",
                            value: `Hi and welcome to the PubTool's support service. To confirm your contact, please click the button bellow. By clicking on it, you agree that I collect the language of your Discord client. You also agree to use this system properly.`
                        }
                    ]
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            custom_id: "buttonDetectLang",
                            style: 3,
                            emoji: {
                                name: "✅"
                            }
                        }
                    ]
                }
            ]
        });
        
        const filter = (x: any) => x.user.id === this.message.author.id;
        const collector = msg.createMessageComponentCollector({ filter: filter, time: 120000 });
        
        collector.on("collect", async (interaction: ButtonInteraction | SelectMenuInteraction) => {
            await interaction.deferUpdate();
            
            const getUser = await users.findOne({ userId: this.message.author.id });
            
            if (!getUser) new users({
                readFaq: false,
                totalNumbers: 0,
                warns: [],
                userId: interaction.user.id,
                locale: interaction.locale,
                ticketsbl: false,
                cmdbl: false
            }).save();
            else {
                getUser.locale = interaction.locale;
                getUser.save();
            }
            
            if (interaction.isButton()) {
                if (interaction.customId === "buttonDetectLang") {
                    msg.edit({
                        content: "**🇫🇷 ➜ Veuillez sélectionner un raison.\n🇺🇸 ➜ Please select a reason.**",
                        embeds: [],
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 3,
                                        custom_id: "menuReason",
                                        options: [
                                            {
                                                label: "Signaler un bug / Report a bug",
                                                emoji: {
                                                    name: "🐛"
                                                },
                                                value: "A"
                                            }, {
                                                label: "Recevoir de l'aide / Get help",
                                                emoji: {
                                                    name: "🆘"
                                                },
                                                value: "B"
                                            }, {
                                                label: "Autre / Other",
                                                emoji: {
                                                    name: "☎"
                                                },
                                                value: "C"
                                            }
                                        ],
                                        placeholder: "Raison / Reason"
                                    }
                                ]
                            }
                        ]
                    })
                }
            }
            
            if (interaction.isSelectMenu()) {
                
                if (interaction.values[0] === "A") this._handleTicket(msg, collector, interaction, "Signaler un bug / Report a bug");
                
                if (interaction.values[0] === "B") this._handleTicket(msg, collector, interaction, "Recevoir de l'aide / Get help");
                
                if (interaction.values[0] === "C") this._handleTicket(msg, collector, interaction, "Autre / Other");
            }
        });
        
        collector.on("end", (collected) => {
            if (collected.size === 0) msg.edit({
                content: "**🇫🇷 ➜ Français : Contact du support annulé.\n🇺🇸 ➜ English : Support contact canceled.**",
                embeds: [],
                components: []
            });
        });
    }
    
    async _checkUser(user: User, type: string): Promise<boolean> {
        const getUser = await users.findOne({ userId: user.id });
        if (type === "inDb") {
            return getUser ? true : false;
        }
        if (type === "blacklist") {
            if (!getUser) return false;
            
            return getUser.ticketsbl === true ? true : false;
        }
        
        return false;
    }
    
    async _handleTicket(msg: any, collector: InteractionCollector<SelectMenuInteraction | ButtonInteraction>, interaction: SelectMenuInteraction, reason: string): Promise<void> {
        const checkResult = await this._checkUser(this.message.author, "inDb");
        
        if (checkResult) {
            const checkBlacklist = await this._checkUser(this.message.author, "blacklist");
            
            if (checkBlacklist) {
                msg.delete();
                this.message.reply(`**${this.client.emotes.no}\n🇫🇷 ➜ Désolé, mais vous êtes dans la liste noire, donc vous ne pouvez pas ouvrir de tickets.\n🇺🇸 ➜ Sorry, but you're blacklisted, so you can't open tickets.**`);
                return collector.stop();
            }
        } else new users({
            readFaq: false,
            totalNumbers: 0,
            warns: [],
            userId: interaction.user.id,
            locale: interaction.locale,
            ticketsbl: false,
            cmdbl: false
        }).save();
        
        msg.delete();
        
        const firstMessage = this.message.content;
        
        this.message.reply({
            content: "**🇫🇷 ➜ Ticket ouvert avec succès !\n🇺🇸 ➜ Ticket opened with success!**"
        });
        
        this._createTicket(reason, firstMessage, interaction.locale);
        
        collector.stop();
    }
    
    async serverSide() {
        if (this.message.author.bot) return;
        
        const currentChannel = this.message.channel;
        
        if (currentChannel.type !== 0) return;
        
        const user = await this.client.users.fetch(`${currentChannel.topic}`);
        
        if (this.message.content.startsWith("!")) return
        if (this.message.guild!.id !== this.client.config.mainguildid) return;
        
        if (!this.message.member!.roles.cache.has(roles.ticketsaccess)) {
            this.message.react("❌");
            return this.message.author.send(`**${this.client.emotes.no} ➜ You aren't allowed to do that.**`);
        }
        
        if (this.message.attachments) {
            if (this.message.content) await user?.send({
                content: `**${this.client.emotes.boost} ➜ ${this.message.author.username} :** ${this.message.content}`,
                files: [...this.message.attachments.values()]
            }).catch(() => {});
            else await user?.send({
                content: `**${this.client.emotes.boost} ➜ ${this.message.author.username} :** ${this.message.content}`,
                files: [...this.message.attachments.values()]
            }).catch(() => {});
        } else await user?.send({
            content: `**${this.client.emotes.boost} ➜ ${this.message.author.username} :** ${this.message.content}`
        }).catch(() => {});
        
        return this.message.react("📨");
    }
    
    async transcript() { }
}