# Création de la base de données

***

Salut à toi ! Dans ce chapitre, nous allons créer à ton robot une base de données. Cela lui permettra de sauvegarder toutes sorte d'informations qui lui seront nécessaire.

> ⚠ Attention ! Cette étape est un peu plus longue et complexe que les autres, c'est pourquoi je te conseille de bien prendre le temps de lire l'entièreté du tutoriel.

***

## Création de l'environnement

***

En premier lieu, nous allons nous rendre sur le site de [MongoDB](https://www.mongodb.com) et nous allons nous connecter/créer un compte.

![Page d'acceuil de MongoDB](https://i.imgur.com/wJ5wMxR.png)

Deuxièmement, nous allons créer un nouveau projet :

![Créer un nouveau projet](https://i.imgur.com/t2yLPz3.png)

Ajouter un nom à notre base de données :

![Ajouter un nom](https://i.imgur.com/dmQ1T2z.png)

Sur la page suivante, cliques sur le bouton `Build a database` qui apparaît. Puis sélectionnes l'offre qui te convient et sélectionnes un lieu.

> 💡 Astuce ! Plus le lieu sélectionné est proche de là où ton robot sera hébergé, plus ce dernier sera rapide !
## Création des indentifiants d'accès

***

Ta base de données est créée. C'est bien beau, mais il va falloir que notre robot puisse y accéder !

Sur la page qui s'est affichée lors de la dernière étape, nous allons définir un nom d'utilisateur et un mot de passe.

![Définition d'un nom d'utilisateur et d'un mot de passe](https://i.imgur.com/sgTxB3a.png)

Puis, dans la barre de navigation à gauche, rendons-nous sur `Network Access`. Cliques sur `Add IP Adress` puis `ALLOW ACCESS FROM ANYWHERE` et enfin, `Confirm`.

![Ajout de l'IP d'accès](https://i.imgur.com/xOMnRPn.png)
## Création de l'URL d'accès

***

Ton robot a dorénavant un identifiant et un mot de passe. Mais comme il ne fait jamais tout comme tout le monde, il se servira d'une adresse URL pour se connecter à sa base de données !

Dans le menu de gauche, rendons-nous donc dans `Database` puis cliques sur le bouton `Connect`

> ⚠ Attention ! Il se pourrait que tu ne puisses pas cliquer sur ce bouton. Pas de panique, il te suffit juste de patienter, c'est juste que ta base de données n'est pas encore créée !

Sélectionnes l'option ci-dessous :

![Création de l'URL d'accès](https://i.imgur.com/S08OUMZ.png)

Copies l'URL qui s'affiche et ouvres `Visual Studio Code` (le logiciel que l'on a installé dans le chapitre précédent). Cliques sur `Fichier`, `Ouvrir` puis sélectionnes le dossier où se situe le code de ton robot.
## Enregistrement de l'URL dans le code du robot

***

Voici donc venue l'étape la plus simple ! Nous allons simplement commencer à remplir les fichiers de configuration de ton robot avec l'URL que nous avons copiée juste avant.

Via l'explorateur de fichiers se situant sur la partie gauche de `Visual Studio Code`, ouvre le dossier `src`, `configs`, et enfin, le fichier `config.ts`. 

![Explorateur de fichiers](https://i.imgur.com/iXWxezw.png)

C'est dans ce fichier que seront stockés les paramètres les plus importants, mais nous n'allons pour le moment compléter que la valeur `mongooseConnectionString`.

![Ajout de l'URL dans le fichier de configuration](https://i.imgur.com/8cz9QB7.png)

> ⚠ Attention ! Pensez à remplacer le `<password>` qui se trouve dans votre URL par le mot de passe que vous avez défini plus tôt !

***

Voilà donc pour cette partie de l’installation de YopBot. Si tu as des questions dessus ou que tu n’as pas compris quelque chose, n’hésites surtout pas à [ouvrir une issue](https://github.com/Nonolanlan1007/Yop-Bot/issues/new), nous nous ferons un plaisir de te répondre !

***

Si tu le veux, je t’invite à passer à l’étape suivante qui est : [la création d'un compte Discord à ton robot]() pour permettre à ton robot de se connecter à Discord et d'avoir la classe avec un profil rien qu'à lui 😎
