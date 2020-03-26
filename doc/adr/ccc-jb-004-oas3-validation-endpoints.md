# 4. Utilisation d'oas3 pour valider les points d'entrées et de sorties de l'API

Date: 2020-03-13

-   Décideurs: [Alexis Janvier](https://github.com/alexisjanvier)
-   Ticket.s concerné.s: -
-   Pull Request: [#34](https://github.com/CaenCamp/jobs-caen-camp/pull/34)

## Statut

2020-03-25 accepted

## Contexte et énoncé du problème

Au moment de l'implémentation des routes de CRUD sur les entreprises et les offres d'emploi, il faut mettre en place des validateurs sur les objets envoyés à l'API pour créer des entités sauvegardées, et s'assurer que les retours de l'API sont valides. Nous avons mis en place un contrat OpenAPI justement pour définir ces entrées et sorties. Il faut donc mettre en place un système afin de s'assurer que le contrat OpenAPI est bien respecté.

## Options envisagées

-   Créer les validateurs à la main sur toutes les routes
-   Mettre en place un générateur de validateurs à partir du contrat OpenAPI, et les implémenter sur les routes d'API
-   Utiliser un middleware capable de lire le contrat d'API et d'automatiquement en valider les routes en entrée et/ou sortie.

## Résultat de la décision

Option choisie : "Utiliser un middleware", parce que le contrat OpenAPI étant déjà en place, c'est la solution la plus rapide pour s'assurer que le comportement de l'API soit en phase avec son contratI. Nous avons choisi [koa-oas3](https://github.com/atlassian/koa-oas3), car c'est certes l'un des seuls disponible pour [Koa](https://koajs.com/), mais aussi parce qu'il est maintenu par [Atlassian](https://www.atlassian.com/), ce qui devrait nous garantir sa stabilité.

### Conséquences positives

-   On s'assure que la documentation de l'API - et donc plus globalement le contrat qu'elle présente aux utilisateurs - corresponde toujours à l'implémentation réelle des routes.
-   Il faudra bien maintenir les tests fonctionnels sur les endpoints pour éviter les mauvaise surprises de mise en production !

### Conséquences négatives

-   On impose une grosse dépendance entre le contrat d'API et le code de l'API. Il faudra toujours maintenir le contrat OpenAPI en parallèle de son implémentation lors de l'évolution du projet. En vrai, c'est une bonne chose, voir le but recherché. Mais c'est plus de travail !
