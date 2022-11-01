import { blue } from 'colors';
import { existsSync, readFileSync, writeFile } from 'fs';
import moment from 'moment';
import { join } from 'path';
import Class from '..';

moment.locale("fr");

export = async (client: Class) => {
  const lasts = existsSync("./logs/" + "connectionHistory.txt") ? readFileSync("./logs/connectionHistory.txt") : null

  const newText = lasts !== null ? lasts + `\n[${moment(Date.now()).format("DD/MM/YYYY kk:mm:ss")}]` : `[${moment(Date.now()).format("DD/MM/YYYY kk:mm:ss")}]`

  writeFile("./logs/connectionHistory.txt", newText, (err) => {
    if (err) console.log(err.stack);
  });

  console.log(blue(`[BOT] Connecté en tant que ${client.user?.tag}`));
  client.postSlashs(client.slashs);

  const activities = [`${client.config.prefix}help`, `Version ${client.version}`, 'By Nolhan#2508 and ValDesign#6507'];
  await client.user!.setActivity("Démarrage en cours...", { type: 1, url: "https://twitch.tv/discord" });

  setInterval(async () => {
    await client.user!.setActivity(activities[Math.floor(Math.random() * activities.length)], { type: 1, url: "https://twitch.tv/discord" });
  }, 12000);
}