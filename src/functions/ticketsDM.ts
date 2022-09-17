import { ChannelType, GuildTextBasedChannel, Message } from "discord.js";
import Class from "..";
import { channels } from "../configs";
import { tickets } from "../models";

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
            this.message.reply({
                content: null,
                embeds: [
                    {
                        title: "Contacter le support / Contact support",
                        thumbnail: {
                            url: this.client.user!.displayAvatarURL()
                        }
                    }
                ]
            });
        }
        else {
            const ticketChannel = this.client.channels.cache.get(`${getTicket.channelId}`) as GuildTextBasedChannel;
        
            if (!ticketChannel) {
                this._createTicket();
            }
        }
    }

    async _createTicket() {
        const newTicketChannel = await this.client.guilds.cache.get(this.client.config.mainguildid)?.channels.create({
            name: `🎫・ticket-${this.message.author.discriminator}`,
            topic: this.message.author.id,
            parent: channels.ticketcategory
        });

        new tickets({
            channelId: newTicketChannel!.id,
            userId: this.message.author.id
        }).save();
    }

    async serverSide() {
        const currentChannel = this.message.channel;

        if (currentChannel.type !== ChannelType.GuildText) return;

        currentChannel.name.startsWith("🎫・ticket-");
    }

    async transcript() { }
}