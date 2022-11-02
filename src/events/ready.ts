import { blue } from 'colors';
import {existsSync, readFileSync, unlink, writeFile} from 'fs';
import moment from 'moment';
import { join } from 'path';
import Class from '..';
import {users, avis, bots, counter, suggests, tickets, verificators } from "../models"

moment.locale("fr");

export = async (client: Class) => {

  if (existsSync("./dbBackup.json")) {
    const dbBackup = require("../../dbBackup.json")

    console.log("[SAVE] Chargement de la base de données...")
    dbBackup.bots.forEach(async (data: { botID: string, prefix: string, ownerID: string, verified: boolean, serverInvite?: string, site?: string, desc?: string }) => {
      new bots({
        botId: data.botID,
        prefix: data.prefix,
        ownerId: data.ownerID,
        verified: data.verified,
        supportInvite: data.serverInvite,
        site: data.site,
        description: data.desc,
        likes: 0,
        latestLikeDate: null,
        team: [],
        checked: true
      }).save()
    })
    let totalCountNumber = 0;

    dbBackup.counter.forEach(async (data: { number: number }) => {
      totalCountNumber = totalCountNumber + data.number
    })

    new counter({
      counter:totalCountNumber,
      lastCountUser: client.user!.id
    }).save()

    dbBackup.users.forEach(async (user: { verifications?: number, userID: string, ticketsbl: boolean, cmdbl: boolean}) => {
      let warns:any[] = [],
          totalNumbers = dbBackup.counter.find((x:any) => x.userID === user.userID)

      dbBackup.sanctions.forEach(async (sanction: any) => {
        if (sanction.userID !== user.userID) return;

        warns.push({
          id: sanction.wrnID,
          userId: sanction.userID,
          modId: sanction.modID,
          type: sanction.type === "MUTE" ? "TIMEOUT" : sanction.type,
          reason: sanction.reason,
          duration: 0,
          finishOn: 0,
          date: sanction.date,
          deleted: false,
          historyLogs: []
        })
      })

      new users({
        userId: user.userID,
        cmdbl: false,
        ticketsbl: false,
        warns: warns,
        totalNumbers: totalNumbers ? totalNumbers.number : 0
      }).save()

      if (user.verifications && user.verifications > 0) {
        new verificators({
          userId: user.userID,
          verifications: user.verifications
        })
      }
    })
    console.log("[SAVE] Base de données synchronisée.")

    unlink("./dbBackup.json", (err) => {
      if (err) console.log(err);
    })

    setTimeout(() => process.exit(), 5000)
  }

  if (!existsSync("./dbBackup.json")) {
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
}