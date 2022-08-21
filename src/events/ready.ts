import { blue } from 'colors';
import Class from '..';

export = async (client: Class) => {
  console.log(blue(`[BOT] Connecté en tant que ${client.user?.tag}`));
  client.postSlashs(client.slashs);
  
  const activities = [`${client.config.prefix}help`, `Version ${client.version}`,'By Nolhan#2508 and ValDesign#6507'];
  await client.user!.setActivity("Démarrage en cours...", { type: 1, url: "https://twitch.tv/discord" });
  
  setInterval(async () => {
    await client.user!.setActivity(activities[Math.floor(Math.random() * activities.length)], { type: 1, url: "https://twitch.tv/discord" });
  }, 120000);
}