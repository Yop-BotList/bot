import {
  ChatInputCommandInteraction, Message,
  PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ActionRowComponent
} from "discord.js";
import Class from "../..";
import { channels, config, roles } from "../../configs";
import Slash from "../../utils/Slash";
import { users } from "../../models"
import { title } from "process";

class Notifs extends Slash {
  constructor() {
    super({
      name: "notifs",
      description: "Activé ou non les mp de Yop Bot.",
      description_localizations: {
        "en-GB": "Enabled or not Yop Bot PMs"
      },
      dm_permission: false,
      default_member_permissions: PermissionsBitField.Flags.SendMessages,
    }
    )
  }

  async run(client: Class, interaction: ChatInputCommandInteraction) {

    const user = await users.findOne({ userId: interaction.user.id })



    let options = [
      {
        label: "Suggestion",
        value: "suggestion",
        description: 'Activé/Désactivé les suggest',
        default: false,
        emoji: { name: "🔄" }
      }, {
        label: "Reverification",
        value: "reverification",
        description: 'Activé/Désactivé les vérifications',
        default: false,
        emoji: { name: "🎈" }
      }, {
        label: "Newbugs",
        value: "newbugs",
        description: 'Activé/Désactivé les newbugs',
        default: false,
        emoji: { name: "🎆" }
      }, {
        label: "Sanction",
        value: "sanction",
        description: 'Activé/Désactivé les sanction',
        default: false,
        emoji: { name: "🎇" }
      }, {
        label: "Counter",
        value: "counter",
        description: 'Activé/Désactivé les counter',
        default: false,
        emoji: { name: "🧨" }
      }
    ];

    for (const notif of user!.notifs) {
      const opt = options.find(option => option.label.toLowerCase() === notif.name);
      if (notif.acquired) opt!.default = true;
    }

    let msg = await interaction.reply({
      embeds: [{
        title: "Rôle notifs",
        description: `Veuillez choisir les rôles de notifications que vous voulez dans le menu déroulant ci-dessous.`,
        footer: { text: `${client.user!.username}` }
      }],
      components: [{
        type: 1,
        components: [{
          type: 3,
          custom_id: "notifs_mps",
          max_values: 5,
          min_values: 0,
          options: options
        }]
      }]
    })
  }
}

export = new Notifs();