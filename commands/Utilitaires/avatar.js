'use strict';

const { MessageEmbed } = require("discord.js");
const Command = require("../../structure/Command.js")

class Avatar extends Command {
    constructor() {
        super({
            name: 'avatar',
            category: 'utils',
            description: 'Voir l\'avatar d\'un autre utilisateur.',
            usage: 'avatar [utilisateur]',
            example: ["avatar <@692374264476860507>"],
            aliases: ['pp']
        });
    }

    async run(client, message, args) {
        
    let user = message.mentions.users.first() || message.author;
    let avs = new MessageEmbed()
      .setAuthor(
        `Avatar de : ${user.tag}`,
        user.displayAvatarURL({ dynamic: true }),
        "https://discord.gg/3dQeTg9Vz3"
      )
      .setColor(client.color)
      .addField(
        "➜ PNG",
        `[\`Lien\`](${user.displayAvatarURL({ format: "png" })})`,
        true
      )
      .addField(
        "➜ JPEG",
        `[\`Lien\`](${user.displayAvatarURL({ format: "jpg" })})`,
        true
      )
      .addField(
        "➜ WEBP",
        `[\`Lien\`](${user.displayAvatarURL({ format: "webp" })})`,
        true
      )
      .setURL(
        user.displayAvatarURL({
          dynamic: true,
        })
      )
      .setImage(
        user.displayAvatarURL({
          dynamic: true,
          size: 512,
        })
      );

      message.channel.send({embeds : [avs]})
    }
}

module.exports = new Avatar;