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
   
   Ensuite, ouvrez le fichier `config.json` se trouvant dans le dossier `configs`
   Il devrai ressembler à cela :
   
```json
{
    "token": "token",
    "prefix": "y!",
    "mongooseConnectionString": "mongourl",
    "color": "#f2ac34",
    "autokick": true,
    "staffGuildId": "784122752315555860",
    "owner": "692374264476860507",
    "owners": [
        "650664078649458699"
    ],
    "mainguildid": "782644006190055486",
    "antiinvite": true
}

```
> Si vous ne comprenez rien, c'est normal. Je vais tout vous expliquer :3

* * *
