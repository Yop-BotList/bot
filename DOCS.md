# DOCUMENTATION ENCORE EN COURS DE RÉDACTION !!

# YopBot
Robot Discord capable de gérer n'importe quel serveur de type BotList étant uniquement sur Discord.

* * *

# Introduction
Grâce à YopBot, vous allez pouvoir rendre votre serveur encore mieux. Il est équipé de pleins des dernières nouveautés de Discord tels que les boutons, ou *bientôt* les commandes slash ! Bien évidemment, le robot est toujours en amélioration, et ne possède pas que ses fonctionnalités de botlist. Il est équipé d'autres systèmes tels que les commandes fun, un systèmem de modération complet. Son système de tickets extrêment performant permettra à vos membres de parler avec votre équipe en toute sécurité !

* * *

# Préparation

***

### Prérequis
Pour l'installation, la configuration et la mise en service de YopBot, vous devrez être équipé(e) des logiciels suivants :

* [NodeJS Version 16](https://nodejs.org/dist/v16.13.1/node-v16.13.1-x64.msi)
* [GIT](https://github.com/git-for-windows/git/releases/download/v2.34.1.windows.1/Git-2.34.1-64-bit.exe)
* [Visual Studio Code](https://code.visualstudio.com/) ou un tout autre éditeur de code.
* Posséder Windows 8.1 *(pour les utilisateurs de Windows)*  ou une version supérieure *(NodeJS V16 ne fonctionne que sur ces versions là)*.

> Les liens que je vous ai mis sont des liens d'installation pour Windows !!
> 

* * *

## Téléchargement
Une fois les logiciels intallés, nous allons installer les fichiers de YopBot ainsi que les modules npm nécessaires à son bon fonctionnement.

* * *

 **- Installation des fichiers du bot :**
  Nous allons tout d'abord ouvrir une invite de commandes.
  Pour cela, nous allons faire *Win + R*.
  Une fenêtre comme cell-ci vas s'ouvrir :
  ![Alt text](https://i.imgur.com/QKET6E0.png)
  Une fois ouverte, tapez `cmd` dans la zone de texte.
  ![Alt text](https://i.imgur.com/mRqGkbN.png)
  Nous voici donc sur l'invite de commandes !
  
  Dans cet invite de commandes, nous allons taper ceci :
  `cd Desktop`
  
  Puis : 
  `git clone https://github.com/Nonolanlan1007/Yop-Bot.git`
  Patientez quelques secondes...
  Retournez sur votre bureau...
  Et voilà, un dossier nommé `Yop-Bot` a été créé !
  

* * *


   **- Installation des modules npm :**
   Retournez sur votre Invite de Commandes, et tapez-y les commandes suivantes :
   `cd Desktop`
   `npm install`
   Elle vous permettra d'installer tous les modules nécessaires, avec la bonne version !
   > Cela risque d'être un peu long en fonction de la rapidité de votre connexion internet ^^
   
   Lorsque vous êtes invité(e) à entrer une nouvelle commande, c'est que vos modules sont installés !
   
   ## Configuration
   Dans cette section, nous allons configurer YopBot pour qu'il puisse fonctionner sur votre serveur.
   Vous allez donc tout d'abord ouvrir le dossier `Yop-Bot` avec votre éditeur de codes.
   > Menu en haut de la fenêtre ➜ Fichier ➜ Ouvrir le dossier
   
   ### config.json
   
   Ensuite, ouvrez le fichier `config.ts` se trouvant dans le dossier `src/configs`
   Il devrai ressembler à cela :
   
```ts
export default {
    token: "token",
    prefix: "y!",
    mongooseConnectionString: "mongourl",
    color: "#f2ac34",
    autokick: true,
    staffGuildId: "784122752315555860",
    owners: [
        "692374264476860507",
        "650664078649458699"
    ],
    mainguildid: "782644006190055486",
    antiinvite: true
};

```
> Si vous ne comprenez rien, c'est normal. Je vais tout vous expliquer :3

* * *

Nous allons commencer par compléter la valeur `token`. C'est l'un des valeurs les plus importantes. Elle va permettre à votre robot de se connecter à Discord *(comme vous avec votre adresse mail et votre mot de passe)*.

 **- Création de l'application et récupération du token :**
 Pour créer une application, vous allez devoir vous rendre sur le [Portail Développeurs de Discord](https://discord.com/developers/applications).
 Vous allez vous connecter, et cliquer sur ce bouton :
 ![Alt text](https://i.imgur.com/LyH7WGh.png)
 Le pop-up suivant va apparaître :
 ![Alt text](https://i.imgur.com/5ZV2dVT.png)
 Entrez le nom de votre robot et cliquez sur `Create`.
 
 Vous pouvez modifier la photo de profil de votre robot ainsi que la section "à propos de moi" de son profil !
 ![Alt text](https://i.imgur.com/6gnYMEP.png)
 
 Une fois qu'il est personnalisé, cliquez sur `Bot` puis `Add Bot`. Validez l'action...
 
 Voilà, votre robot a un compte Discord !!
 Copiez le token en cliquant sur : 
 ![Alt text](https://i.imgur.com/WMuJj2q.png)
 Et collez-le à la place de `token` dans votre fichier `config.ts` !
 
![ok ok bizarre](https://i.imgur.com/YAlzgkN.png)

* * *

Le préfixe de commandes `y!` ne vous convient pas ? Vous pouvez très bien le changer en changeant la valeur `prefix` !

***

Nous allons maintenant connecter notre robot à MongoDB. MongoDB, c'est une application vous permettant de créer des bases de données pour à peu près tout. 
> Attention, cette étape est crutiale, mais un peu longue. Je vous invite à bien prendre le temps ;)

***
Nous allons donc nous rendre sur [MongoDB](https://mongodb.com) et nous connecter en cliquant sur `Login` ou en créant un compte en cliquant sur `Try Free`.

Créez un projet :
![Alt text](https://i.imgur.com/y2B9Fnp.png)
Cliquez sur `next` puis sur `Create Project`.

Vous arriver donc sur cette page :
![Alt text](https://i.imgur.com/gsiyV55.png)
Cliquez sur `Build a Database` puis choisissez votre offre :
![Alt text](https://i.imgur.com/gDkHGXL.png)
Choisissez l'entreprise de votre choix, puis un pays et cliquez sur `Create Cluster` :
![Alt text](https://i.imgur.com/cjBusdJ.png)
> Plus le pays choisi est proche de chez vous, plus la connexion à la base de données sera rapide ;)
 
 Définissez à votre robot un nom d'utilisateur et un mot de passe :
 ![Alt text](https://i.imgur.com/f3zSeRl.png)
 Dans le menu de droite, cliquez sur `Network Access` puis `Add an IP Adress` : 
 ![Alt text](https://i.imgur.com/XfnaFmf.png)
 Cliquez sur `Allow Access From Anywhere` et confirmez :
 ![Alt text](https://i.imgur.com/WOhWQYs.png)
 Dans le menu de droite, retournez sur `Database` et cliquez sur `Connect` :
 ![Alt text](https://i.imgur.com/V400ktE.png)
 Dans le pop-up qui vient de s'ouvrir, cliquez sur `Connect Your Application` : 
 ![Alt text](https://i.imgur.com/bewY97i.png)
 Copiez l'URL qui s'affiche :
 ![Alt text](https://i.imgur.com/XtWcHdY.png)
 Et collez-là dans le fichier `config.json` en remplaçant `<password>` par le mot de passe défini un peu plus tôt à la place de la valeur `mongooseConnectionString` :
 ![Alt text](https://i.imgur.com/4sihlHc.png)
 Trop cool, votre robot est équipé d'une base de données !
 
  ***
  
Pour modifier la couleur des embeds du bots, veuillez remplacer la valeur de `color` par un code couelur hexadécimal.
> Astuce : Mettez la couleur principale du logo de votre bot ou celle de son rôle le plus haut sur votre serveur 😉

***

La fonctionnalité autokick vous permet d'expulser automatiquement les robots de votre serveur lorsque :

* Le robot en question a été rejeté par un vérificateur.
* Le robot en question a été supprimé par un administrateur.
* Le propriétaire du robot a quitté votre serveur.

Pour la désactiver, remplacer la valeur `true` par `false`.

***

Si vous tester les bots sur un autre serveur que le serveur principal, remplacer la valeur de `staffguildid` par l'identifiant du serveur en question. Si vous n'en avez pas, ne mettez rien mais laisser les guillemets.

***

La valeur de `owner` vous permettra d'accéder aux commandes de gérance du bot. Vous y mettrez donc votre identifiant. Pour autoriser une autre personne à y accéder, vous pouvez le rajouter dans l'array `owners`.

***

Dans la valeur `mainguildid`, vous placerez l'identifiant de votre serveur. Cela permettra à votre robot de le reconnaître.

***

Et enfin pour finir sur ce fichier `config.ts`, le système de l'anti-invitation. Ce système vous permettra quiquonque hormis vous d'inviter quelqu'un sur le serveur de test des robots. Vous pouvez le désactiver en remplaçant la valeur `true` par `false`.