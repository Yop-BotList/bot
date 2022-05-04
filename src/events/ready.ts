import { blue } from 'colors';
import { Client } from 'discord.js';

module.exports = async (client: Client) => {
  console.log(blue(`[BOT] Connecté en tant que ${client.user?.tag}`));
  client.postSlashs(client.slashs);
}