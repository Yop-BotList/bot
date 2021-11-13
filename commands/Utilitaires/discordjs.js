'use strict';

const Command = require("../../structure/Command.js")
const axios = require("axios")

class DiscordJS extends Command {
    constructor() {
        super({
            name: 'discordjs',
            category: 'utils',
            description: 'Chercher une information sur la documentation de Discord.JS',
            aliases: ['djs', "docs"],
            usage: "discordjs <recherche>",
            exemple: ["djs Message", "djs Client#login()"],
            permission: "everyone"
        });
    }

    async run(client, message, args) {
                const uri = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(message.content)}`
    
                axios
                .get(uri)
                .then((embed) => {
                    const { data } = embed;
                    
                    if (data && !data.error) {
                        message.channel.send({ embeds: [data] })
                    }
                    else {
                        message.reply(`**${client.no} ➜ Zut, je ressors bredouille de cette longue recherche dans les méandres de discord.js ! Essaie peut-être autre chose.**`)
                    }
                })
    }
}

module.exports = new DiscordJS;