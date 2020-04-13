# Le site des offres d’emploi des CaenCamp.s

![](https://github.com/CaenCamp/jobs-caen-camp/workflows/test/badge.svg) ![GitHub top language](https://img.shields.io/github/languages/top/CaenCamp/jobs-caen-camp.svg) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) ![github contributors](https://img.shields.io/github/contributors/CaenCamp/jobs-caen-camp.svg) ![web-myna.svg](https://img.shields.io/github/license/CaenCamp/jobs-caen-camp.svg) ![prs welcome](https://img.shields.io/badge/prs-welcome-brightgreen.svg)

Les [CaenCamp.s](https://www.caen.camp) sont une série de rencontres caennaises organisées par, animées par et à destination des développeurs. Cette initiative existe depuis 2012.

Les rencontres ont lieu une fois par mois, et c’est très chouette. Mais pour aller plus loin, nous nous réunissons aussi régulièrement pour mettre les mains dans le code lors des [Coding CaenCamp](https://www.caen.camp/coding-caen-camp).

Ce projet de site d’offres d’emploi web est l’un de nos projets communs mis en place lors de ces rencontres.

## Démarrage rapide

Le [guide du contributeur](./.github/CONTRIBUTING.md#installer-le-projet) détaille les pré-requis et les différents mode d’installation du projet. Mais en partant du postulat que _Docker_ et _Docker Compose_ sont installés sur votre environnement, vous pouvez lancer l’installation du projet avec la commande

```bash
make install
```

et lancer les différentes applications avec :

```bash
make start
```

Vous pouvez ainsi accéder à :

-   l’application web sur <http://localhost:8000>
-   l’api sur <http://localhost:8001>
-   la documentation de l'API sur <http://localhost:8001/documentation>
-   Une interface d'administration sur <http://localhost:8002>

En utilisant la commande

```bash
make storybook
```

Vous lancerez le storybook (documentation des composants Svelte) sur <http://localhost:6006/>

Lors du premier lancement du projet, vous devrez également initialiser la base de données :

```bash
make migrate-latest
make import-fixed-fixtures
```

Vous devrez également créer un premier utilisateur pour pouvoir vous connecter à l'interface d'administration. Pour cela, vous devrez definir sont `username` ansi que sont `password` (respectant la definition d'un [mot de passe sécurisé de OWASP](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/migrated_content) via des variables d'environement _temporaires_. Par exemple :

```
USERNAME=myFirstUser PASSWORD=n33dToB3+Str0ng node ./cli/create-user.js
```

_Remarque: Si vous utilisez Docker, vous devrez être dans le conteneur du service api pour lancer cette commende._

## Vous souhaitez participer

Merci à vous :+1:

Et c’est très simple :

-   Si vous ne savez pas trop par où commencer, vous pouvez jeter un coup d’œil aux [issues](https://github.com/CaenCamp/jobs-caen-camp/issues): elles décrivent les taches à réaliser classées par type (code, design, integration, etc.),
-   Une fois que vous savez quoi faire, vous pouvez consulter le [**guide du contributeur**](.github/CONTRIBUTING.md) pour vous lancer.

Et si vous ne trouvez toujours pas quoi faire dans les issues existantes et/ou que vous avez d’autres idées, n’hésitez pas à créer une nouvelle issue.

## License

jobs-caen-camp est sous license [GNU GPLv3](LICENSE)
