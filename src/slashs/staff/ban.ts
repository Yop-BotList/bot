import { CommandInteraction, GuildMember, ChannelType, PermissionsBitField, Message, CommandInteractionOptionResolver } from "discord.js";
import Class from "../..";
import { newInfraction } from "../../utils/InfractionService";
import { config, emotes, channels, roles } from "../../configs";
import Slash from "../../utils/Slash";
import { bots, users, verificators } from "../../models"
import ms from 'ms';

class Ban extends Slash {
  constructor() {
    super({
      name: "ban",
      description: "Bannir un membre du serveur.",
      description_localizations: {
        "en-US": "Ban a member from the server."
      },
      options: [
        {
          type: 6,
          name: "membre",
          name_localizations: {
            "en-US": "member"
          },
          description: "Membre que vous souhaitez bannir.",
          description_localizations: {
            "en-US": "Member you want to ban."
          },
          required: true
        },
        {
          type: 3,
          name: "raison",
          name_localizations: {
            "en-US": "reason"
          },
          description: "Raison du bannissement du membre.",
          description_localizations: {
            "en-US": "Reason for banning member."
          },
          required: true
        },
        {
          type: 10,
          name: "duree",
          name_localizations: {
            "en-US": "duration"
          },
          description: "Durée du bannissement.",
          description_localizations: {
            "en-US": "Ban Duration."
          },
          required: false
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

    if (member.user.bot) return interaction.reply({ content: `**${client.emotes.no} ➜ Le saviez-vous, il est impossible de bannir un bot.**`, ephemeral: true });

    // @ts-ignore
    if (member.roles?.highest.position >= interaction.member!.roles?.highest.position) return interaction.reply({ content: `**${client.emotes.no} ➜ Ce membre est au même rang ou plus haut que vous dans la hiérarchie des rôles de ce serveur. Vous ne pouvez donc pas le sanctionner.**`, ephemeral: true });

    if (!member?.moderatable) return interaction.reply({ content: `**${client.emotes.no} ➜ Zut alors ! Je ne peux pas rendre muet ce membre ! Essaie peut-être de mettre mon rôle un peu plus haut dans la hiérarchie du serveur :p**`, ephemeral: true });

    const valueduration = interaction.options.get("duree")?.value
    const duration = valueduration && ms(Number(valueduration)) ? ms(String(valueduration)) : 0;
    const reason = interaction.options.get("raison")?.value
    if (!reason) return interaction.reply({ content: `**${client.emotes.no} ➜ Veuillez entrer une raison.**`, ephemeral: true });

    await newInfraction(client, member.user, <GuildMember>interaction.member!, interaction.guild!, "BAN", reason.toLocaleString(), Number(duration)).then(async (res: any) => {
      if (res) await interaction.reply(res)
  })
  }
}

export = new Ban;