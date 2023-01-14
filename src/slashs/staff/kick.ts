import { CommandInteraction, GuildMember, ChannelType, PermissionsBitField, Message, CommandInteractionOptionResolver } from "discord.js";
import Class from "../..";
import { newInfraction } from "../../utils/InfractionService";
import { config, emotes, channels, roles } from "../../configs";
import Slash from "../../utils/Slash";
import { bots, users, verificators } from "../../models"

class Kick extends Slash {
  constructor() {
    super({
      name: "kick",
      description: "Exclure un membre du serveur.",
      description_localizations: {
        "en-US": "Exclude a member from the server."
      },
      options: [
        {
          type: 6,
          name: "membre",
          name_localizations: {
            "en-US": "member"
          },
          description: "Membre que vous souhaitez exclure.",
          description_localizations: {
            "en-US": "Member you want to exclude."
          },
          required: true
        },
        {
          type: 3,
          name: "raison",
          name_localizations: {
            "en-US": "reason"
          },
          description: "Raison de l'exclusion du membre.",
          description_localizations: {
            "en-US": "Member expulsion reason."
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

    const a = interaction.options.getUser('membre')!.id
    const member = interaction.guild!.members.cache.get(`${a}`) || await interaction.guild!.members.fetch(`${a}`).catch(() => { });

    if (!member || !member.user) return interaction.reply({ content: `**${client.emotes.no} ➜ Veuillez entrer un membre valide.**`, ephemeral: true });

    // @ts-ignore
    if (member?.roles?.highest.position >= interaction.member!.roles.highest.position) return interaction.reply({ content: `**${client.emotes.no} ➜ Ce membre est au même rang ou plus haut que vous dans la hiérarchie des rôles de ce serveur. Vous ne pouvez donc pas le sanctionner.**`, ephemeral: true });

    if (member?.user.bot) return interaction.reply({ content: `**${client.emotes.no} ➜ Pour exclure un robot listé, veuillez utiliser la commande \`/delete\` et pour un robot non listé, veuillez effectuer l'exclusion manuellement.**`, ephemeral: true });

    const reason = interaction.options.get("raison")?.value
    if (!reason) return interaction.reply({ content: `**${client.emotes.no} ➜ Veuillez entrer une raison.**`, ephemeral: true });

    await newInfraction(client, member.user, <GuildMember>interaction.member!, interaction.guild!, "KICK", reason.toLocaleString(), 0).then(async (res: any) => {
      if (res) await interaction.reply(res)
  })
  }
}

export = new Kick;