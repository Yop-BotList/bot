const { Client, Message, MessageEmbed } = requier("discord.js")

module.exports = {
    name: "leaderboard",
    categories: "info",
    permissions: "everyone",
    description: "Afficher les différents classements du serveur.",
    aliases: ["top", "lb"]
}