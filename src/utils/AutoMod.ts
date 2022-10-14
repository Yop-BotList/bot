import { Message } from "discord.js";
import Class from "..";

export default class AutoMod {
    client: Class;
    message: Message<boolean>;

    constructor(client: Class, message: Message) {
        this.client = client;
        this.message = message;

        if (this.message.author.bot && this.client.config.automod.ignoreBots === true) return;

        this._badWords();
        this._links();
        this._invites();
        this._spam();
        this._massMentions();
    }

    private async _badWords() {}
    private async _links() {}
    private async _invites() {}
    private async _spam() {}
    private async _massMentions() {}
}