module.exports = class Command {
    name: string;
    category: string;
    description: string;
    usage: string;
    example: string[];
    aliases: string[];
    perms: string[];
    botPerms: string[];
    cooldown: number;
    disabled: boolean;

    constructor(info:any) {
        this.name = info.name;
        this.category = info.category;
        this.description = info.description;
        this.usage = info.usage || info.name;
        this.example = info.example || [];
        this.aliases = info.aliases || [];
        this.perms = info.perms || [];
        this.botPerms = info.botPerms || ["EMBED_LINKS", "SEND_MESSAGES", "READ_MESSAGES"];
        this.cooldown = info.cooldown || 0;
        this.disabled = info.disabled || false;
    }
}