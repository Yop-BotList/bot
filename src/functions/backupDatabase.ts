import { Storage } from 'megajs';
import Class from "..";
import {writeFile, existsSync, readFileSync} from "fs";
import * as models from "../models";
import moment from "moment/moment";

export default async function backupDatabase(client: Class) {

    if (client.config.mega.email === "" || client.config.mega.password === "") return;

    addToLogs("Connexion à l'API de Mega...")
    const storage = await new Storage({
        email: client.config.mega.email,
        password: client.config.mega.password
    }).ready
    addToLogs("Connexion à l'API de Mega réussie.")
    addToLogs("Récupération des données de la base de données...")
    const json = await databaseToJson()
    addToLogs("Données de la base de données récupérées.")
    addToLogs("Préparation à l'envoi...")
    const stringJson = JSON.stringify(json, null, 4)

    const file = await storage.upload(`${moment(Date.now()).format('DD_MM_YYYY')}.json`, stringJson).complete
    addToLogs("Envoi réussi. Fichier enregistré sous le nom : " + file.name)
}

async function databaseToJson () {
    addToLogs("Récupération des données des avis...")
    const avis = await models.avis.find();
    addToLogs("Données des avis récupérées. Nombre d'entrées : " + avis.length)

    addToLogs("Récupération des données des robots...")
    const bots = await models.bots.find();
    addToLogs("Données des robots récupérées. Nombre d'entrées : " + bots.length)

    addToLogs("Récupération des données du compteur...")
    const counter = await models.counter.find();
    addToLogs("Données du compteur récupérées. Nombre d'entrées : " + counter.length)

    addToLogs("Récupération des données des suggestions...")
    const suggests = await models.suggests.find();
    addToLogs("Données des suggestions récupérées. Nombre d'entrées : " + suggests.length)

    addToLogs("Récupération des données des tickets...")
    const tickets = await models.tickets.find();
    addToLogs("Données des tickets récupérées. Nombre d'entrées : " + tickets.length)

    addToLogs("Récupération des données des utilisateurs...")
    const users = await models.users.find();
    addToLogs("Données des utilisateurs récupérées. Nombre d'entrées : " + users.length)

    addToLogs("Récupération des données des vérificateurs...")
    const verificators = await models.verificators.find();
    addToLogs("Données des vérificateurs récupérées. Nombre d'entrées : " + verificators.length)

    return {
        avis: avis,
        bots: bots,
        counter: counter,
        suggests: suggests,
        tickets: tickets,
        users: users,
        verificators: verificators
    }
}

function addToLogs (txt: string) {
    const oldLogs = existsSync(`./logs/databaseBackup/${moment(Date.now()).format('DD_MM_YYYY')}.txt`) ? readFileSync(`./logs/databaseBackup/${moment(Date.now()).format('DD_MM_YYYY')}.txt`, { encoding: "utf-8" }) : null;

    const newText = oldLogs !== null ? oldLogs + `\n[${moment(Date.now()).format("kk:mm:ss")}] ${txt}` : `[${moment(Date.now()).format("kk:mm:ss")}] ${txt}`

    console.log(newText)

    writeFile("./logs/databaseBackup/" + `${moment(Date.now()).format('DD_MM_YYYY')}.txt`, newText, { encoding: "utf-8" }, (err) => {
        if (err) console.log(err.stack);
    });
}