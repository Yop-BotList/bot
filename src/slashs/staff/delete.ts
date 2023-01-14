import { CommandInteraction, GuildMember, ChannelType, PermissionsBitField, Message, CommandInteractionOptionResolver } from "discord.js";
import Class from "../..";
import { newInfraction } from "../../utils/InfractionService";
import { config, emotes, channels, roles } from "../../configs";
import Slash from "../../utils/Slash";
import { bots, users, verificators } from "../../models"

class Delete extends Slash {
  constructor() {
    super({
      name: "delete",
      description: "Supprimer un bot de la liste.",
      description_localizations: {
        "en-US": "Delete a bot from the list."
      },
      options: [
        {
          type: 6,
          name: "robot",
          name_localizations: {
            "en-US": "bot"
          },
          description: "Robot que vous-voulez supprimer de la liste.",
          description_localizations: {
            "en-US": "Bot you want to remove from the list."
          },
          required: true
        },
        {
          type: 3,
          name: "raison",
          name_localizations: {
            "en-US": "reason"
          },
          description: "Raison de la suppression du robot.",
          description_localizations: {
            "en-US": "Reason for bot deletion."
          },
          required: true
        }
      ]
    });
  }

  async run(client: Class, interaction: CommandInteraction) {
    // @ts-ignore
    if (!interaction.member!.roles!.cache.has(roles.verificator) && !client.config.owners.includes(interaction.user.id)) return interaction.reply({
      content: `**${client.emotes.no} ➜ Vous n'avez pas le rôle requis pour utiliser cette commande.**`,
      ephemeral: true
    })

    const a = interaction.options.getUser('robot')!.id
    const member = interaction.guild!.members.cache.get(`${a}`) || await interaction.guild!.members.fetch(`${a}`).catch(() => { });

    const getBot = await bots.findOne({ botId: member?.user.id, verified: true });

    if (!getBot || !member) return interaction.reply({ content: `**${client.emotes.no} ➜ Le bot ${member?.user.tag} ne peut pas être supprimé car il n'est pas vérifié ou n'est pas sur la liste !**`, ephemeral: true });

    const channel = interaction.guild?.channels.cache.get(channels.botslogs);

    if (channel?.type !== ChannelType.GuildText) return interaction.reply({ content: `**${client.emotes.no} ➜ Le salon de logs n'est pas un salon textuel !**`, ephemeral: true });

    const reason = interaction.options.get("raison")?.value
    if (!reason) return interaction.reply({ content: `**${client.emotes.no} ➜ Vous devez préciser une raison de suppresion !**`, ephemeral: true });

    await bots.deleteOne({ botId: member.user.id });

    if (client.config.autokick === true) member.kick().catch(() => { });

    channel.send({
      content: `<@${getBot.ownerId}>`,
      embeds: [
        {
          title: `Suppression ...`,
          color: 0xFF0000,
          timestamp: new Date().toISOString(),
          footer: {
            text: `Vous pensez que c'est une erreur ? Envoyez-moi un Message Privé !`
          },
          description: `${interaction.user} vient juste de supprimer le bot ${member.user.username} pour la raison suivante :\n\`\`\`${reason}\`\`\``,
          thumbnail: {
            url: member.user.displayAvatarURL()
          }
        }
      ]
    });

    interaction.channel!.send({ content: `${client.emotes.yes} ➜ Le bot ${member.user.username}#${member.user.discriminator} vient bien d'être supprimé pour la raison suivante :\n\`\`\`${reason}\`\`\`` });


    const ownerBots = await bots.find({ ownerId: getBot.ownerId });
    if (ownerBots.length === 0) {
      const owner = interaction.guild?.members.cache.get(`${getBot?.ownerId}`);
      if (owner) owner.roles.remove(roles.isclient);
    }
  }
}

export = new Delete;