# Contribuer au site d'offres d'emploi des CaenCamp.s

### Sommaire

-   [Code de conduite](#code-de-conduite)
-   [Qu'est ce que je peux faire ?](#quest-ce-que-je-peux-faire)
    -   [Contribuer au design](#contribuer-au-design)
    -   [Contribuer au code](#contribuer-au-code)
    -   [Rapporter des bugs](#rapporter-des-bugs)
    -   [Suggérer des améliorations ou de nouvelles fonctionnalités](#suggestions)
-   [Installer le projet](#installer-le-projet)
    -   [Les prérequis](#installer-le-projet)
    -   [L'organisation du code](#lorganisation-du-code)
-   [Faire une Pull Request](#faire-une-pull-request)
    -   [Le git flow](#le-git-flow)
    -   [Les tests](#les-tests)
    -   [Les bonnes pratiques](#les-bonnes-pratiques)
-   [Trouver de l'aide](#trouver-de-laide)
    -   [Dans une issue](#dans-une-issue)
    -   [Au cours d'une pull request](#au-cours-dun-pull-request)
    -   [Sur Slack](#sur-slack)
    -   [Le wiki](#le-wiki)
    -   [Aux Coding CaenCamp.s](#aux-coding-caencamps)
-   [Notes additionnelles](#notes-additionnelles)
    -   [La roadmap](#la-roadmap)

## Code de conduite

En participant, vous devez respecter le [code de conduite du projet](CODE_OF_CONDUCT.md).

## Qu'est ce que je peux faire

Beaucoup de choses, l’écriture de code n’étant pas l'unique manière de contribuer au projet !

### Contribuer au design

Concernant le design, tout est à faire. Nous pouvons certainement partir sur un look _à la bootstrap_, mais si certains d'entre vous se sentent inspirés, ce sera un gros plus.

Pour l'instant, nous n'avons qu'un logo qui d'ailleurs ne demande qu'à évoluer.

![CaenCamp Logo](logo.png)

Cela peut-être une occasion de collaboration entre développeurs/intégrateur/designer/ergonome/...

Les issues concernant le design sont associées au tag [`design`](https://github.com/CaenCamp/new-website/issues?q=is%3Aopen+is%3Aissue+label%3Adesign).

### Contribuer au code

Lors de l'édition #7 des Coding CaenCamp, nous avons choisi en commun les technos sur lesquelles nous allons démarrer le projet. Et pour une question de simplicité, nous avons choisi le Javascript. La partie back/API devrait donc être réalisée en s'appuyant sur [Koa](https://koajs.com/) et la partie front sur [Svelte](https://svelte.dev/).

### Rapporter des bugs

Il parait que chaque bug relevé sauve un chaton. En tout cas, la technique du [ZBSD (Zero-Bug Software Development)](https://medium.com/quality-functions/the-zero-bug-policy-b0bd987be684) semble porter ses fruits, comme le rapporte [Andrew Fulton](https://medium.com/@andrew.fulton/how-we-got-to-zero-bugs-and-implemented-a-zero-bug-policy-c77ee3f2e50b).
Donc, si à chaque bug rencontré quelqu'un [ouvre une issue](#ouvrir-une-issue) avec le label `bug`, ce seront des familles entières de chats qui seront sauvées.

<h3 id="suggestions">Suggérer des améliorations ou de nouvelles fonctionnalités</h3>

Dans ce cas, ouvrez une nouvelle issue de type `feature` ou `improvement` en décrivant bien votre idée.

## Installer le projet

Quelle que soit votre type d'implication, ce peut-être une bonne chose que d'installer le projet sur votre machine pour pouvoir visualiser votre contribution avant de la proposer sur Github.

### Prérequis

Tout d'abord vous devez avoir un compte GitHub ainsi que [git installé](https://help.github.com/articles/set-up-git/) sur votre ordinateur.
Ensuite vous devez ["_forker_"](https://guides.github.com/activities/forking/) le dépôt du projet et le cloner localement si vous ne faites pas partie de la team codingCaenCamp. Vous venez au CodingCaenCamp ? N'oubliez pas de demander un un mebre de vous ajouter à l'équipe, afin de pouvoir intervenir directement sur le repo, sans passer par la case fork.

Enfin, vous devez faire un choix :

-   Soit vous décidez d'installer [Node.js](https://nodejs.org/en/download/) en version 12.14 (LTS) sur votre ordinateur. Node est un environnement d'exécution JavaScript .js (comme l'est un navigateur). C'est un bon choix, mais les recettes du fichier `Makefile` utilisent Docker ! Vous devrez donc lancer les différents serveurs "à la main" en utilisant les scripts des fichiers `package.json`. \*\*Le projet utilise [workspaces Yarn](https://yarnpkg.com/lang/en/docs/workspaces/). Vous devez donc également installer [Yarn](https://yarnpkg.com/fr/) et l'utiliser comme gestionnaire de dépendances sur le projet à la place de `npm`.
-   Soit vous préférez ne pas installer Node.js, et dans ce cas, vous devrez installer [Docker](https://docs.docker.com/engine/installation/). Docker va vous permettre d'exécuter Node.js au sein d'un container (une sorte de machine virtuelle). C'est aussi un bon choix. En plus de Docker, vous devrez aussi installer [Docker Compose](https://docs.docker.com/compose/) afin de lancer les diffentes applications en même temps.

Si vous ne savez pas que choisir, Docker présente l'avantage de bien isoler les dépendances du projet de votre OS ainsi que de rendre un peu plus facile le lancement des différentes applications en parallèle ou l'exécution des tests.

### Sans Docker

Vous avez donc décidez d'installer Node.js et Yarn. La première chose à faire est d'installer les dépendances du projet :

```bash
yarn
```

Ensuite, vous devez lancer le serveur de developpement de l'application web :

```bash
cd apps/front
yarn dev
```

Ainsi que le serveur d'API dans une seconde console :

```bash
cd apps/api
yarn dev
```

Vous pouvez ainsi acceder à :

-   l'api sur <http://localhost:3001>
-   l'application web sur <http://localhost:5000>

Dans les premières phases de développement du projet, nous utiliserons un _faux_ serveur d'API afin de mettre en place rapidement et facilement le modèle du projet. Ce serveur _"mocked"_ d'api doit être lancer en plus des autres applications :

```bash
cd apps/api-mocked
yarn start
```

L'API simulée est alors disponible sur <http://localhost:3000>

### Avec Docker

Si vous avez choisi Docker, vous pouvez utiliser les recettes du fichier `makefile` pour lancer les commandes du projet.

La première commande à lancer permettant d'installer les dépendances du projet est :

```bash
make install
```

Ensuite, voici les deux principales commandes à connaitre :

```bash
make start
```

Vous pouvez ainsi accéder à :

-   l'application web sur <http://localhost:8000>
-   l'api sur <http://localhost:8001>
-   l'api _mockée_ sur <http://localhost:8002>

Pour arrêter le projet, faites un:

```bash
make stop
```

**Tips** : Vous pouvez voir toutes les commandes disponibles en tappant juste `make`.

### L'organisation du code

Voici l'organisation des principaux répertoires du projet :

-   **.github** : On trouve ici les fichiers d'aide sur le projet et les templates pour Github.
-   **apps/front** : On trouve ici le code de l'application web.
-   **apps/api** : On trouve ici le code de l'api.
-   **apps/api-mocked** : On trouve ici le code de l'api _simulée_ du projet. Si au moment ou vous lisez ces lignes ce répertoire - qui ne sera présent que lors de la phase de lancement du projet - n'est plus présent, un PR destinée à supprimer cette ligne sera la bienvenue ;)

## Faire une Pull request

Si vous n'avez encore jamais fait de Pull Request (PR), la lecture du tutorial Github [Understanding the GitHub Flow](https://guides.github.com/introduction/flow/) est sûrement un bon point de départ.

Si vous n'aviez pas encore de compte Github, en voici une [bonne introduction](https://flaviocopes.com/github-guide/).

### le git flow

Pour le projet, nous utilisons le workflow suivant :

-   Le projet principal ne possède qu'une branche `master`.
-   Chaque participant réalise un [fork](https://guides.github.com/activities/forking/) du dépôt principal puis ouvre une [branche](https://help.github.com/articles/creating-and-deleting-branches-within-your-repository/) depuis son fork pour chaque nouvelle feature.
-   Une [PR](https://help.github.com/articles/about-pull-requests/) est créée depuis la branche du fork vers la branche `master` du dépôt principal.

![Git Flow](gitflow.png)

Si vous vous sentez un peu perdu.e, la lecture de [Using the Fork-and-Branch Git Workflow](https://blog.scottlowe.org/2015/01/27/using-fork-branch-git-workflow/) devrait vous rendre plus serein.ne.

### La convention de codage (coding style)

Le code suit le style de code basé sur [ESLint](https://eslint.org/docs/rules/) et [Prettier](https://prettier.io/).
Nous vous conseillons d'utiliser [l'integration du linter avec votre ide](https://eslint.org/docs/user-guide/integrations), d'autant plus qu'un [pre-commit Hook git](https://github.com/okonet/lint-staged) validera le formatage de votre code avant de pouvoir ajouter vos modifications à l'index git.

### La convention de message de commit

Nous utilisons la convention de commit dîte conventionnelle provenant de [conventionalcommits.org](Conventionnels) initiée par Angular.

Ils doivent être écrits en français et respecter la convention.

Tout comme la convention de codage, le formatage de commit est validé par un [hook git](https://commitlint.js.org/#/).

### Les tests

Afin de facililiter l'intégration (le merge) de vos PR, surtout si elles contiennent du code, celle-ci devront contenir les tests couvrant vos propositions.

Il y a deux grands types de tests sur le projet:

-   des tests unitaires lancés par [Jest](https://facebook.github.io/jest/) ,
-   des tests [e2e](https://blog.kentcdodds.com/write-tests-not-too-many-mostly-integration-5e8c7fff591c) dont l'outil reste encore à définir (cypress ?).

Le dépôt du projet est/sera branché sur la plateforme d'intégration continue de Github via les [Github actions](https://github.com/features/actions).

### Les bonnes pratiques

La bonne pratique, c'est de **faire des PR**, et puis c'est tout.

Mais voici quelques conseils qui peuvent les rendre encore meilleures :

-   Faites des commits [courts et bien commentés](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).
-   Faites des [PR courtes](https://dev.to/bosepchuk/optimal-pull-request-size-600), toute une tache (une issue) n'a pas forcement besoin d'être adressée dans une seule PR.
-   Faites référence à l'issue que la PR adresse.
-   N'hésitez pas à joindre des captures d'écran, fixes ou animées.
-   Ajouter une description et une _todo list_ en ouvrant la PR.
-   N'attendez pas que la PR soit terminée pour l'ouvrir : la communauté viendra plus facilement en aide en découvrant tôt la PR.
-   Utilisez les labels `WIP` (Work In Progress) et `RFR` (Ready For Review) pour indiquer l'avancement de la PR.
-   dernier point : normalement, toute les _textes_ (titre, description, commentaires, ...) sont fait en anglais. Si vous n'êtes pas à l'aise, écrivez en français. Mais le norme en opensource, c'est l'anglais.

## Trouver de l'aide

### Dans une issue

Le [système d'issues du Github](https://guides.github.com/features/issues/) est très bien pensé et permet de facilement réagir, commenter, noter... Donc si une issue vous intéresse mais qu'elle ne vous semble pas claire, c'est directement dans l'issue que vous pouvez poser des questions.

### Au cours d'une pull request

Si vous avez commencé une PR, mais que vous êtes bloqué, vous pouvez écrire un commentaire dessus décrivant votre problème et ajouter le label `help wanted`.

### Sur Slack

Il existe un channel **coding-caen-camps** sur le slack [Web@Caen](http://webcaen.slack.com). N'hésitez pas à [demander une invitation](mailto:contact@alexisjanvier.net) puis à y poser vos questions.
L'une des tâches de cette refonte concerne d'ailleur la mise en place d'un sytème d'invitation simplifié pour rejoindre le Slack des CaenCamp.s .

### Le wiki

Le wiki d'un projet est souvent difficile à maintenir. C'est portant une manière simple et efficace de noter des "astuces" et autres commentaires documentant la vie du projet. Vous pouvez aller y jeter un coup d'oeil, quelquefois qu'une bonne âme se serait donné la peine d'y noter quelque chose.

### Aux Coding CaenCamp.s

Nous nous réunissons une fois par mois pour passer quelques heures ensemble. Pour être tenu au courant des prochaines sessions, le plus simple est de s'inscrire sur la [newsletter des CaenCamp](http://eepurl.com/gEWFkv) et de nous suivre sur [Tweeter](https://twitter.com/caencamp)

## Notes additionnelles

### La Roadmap

Ce projet est un projet uniquement lié aux bonnes volontés. Tous nous travaillons et il n'est donc pas question de mettre en place un Roadmap.

**Mais**, ce serait chouette de voir une première version en ligne pour 2020 ;)
