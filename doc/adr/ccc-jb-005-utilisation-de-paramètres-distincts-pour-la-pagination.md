# 5. Utilisation de paramètres distincts pour la pagination

Date: 2020-04-12

- Décideurs: [Alexis Janvier](https://github.com/alexisjanvier)
- Ticket.s concerné.s: [!55](https://github.com/CaenCamp/jobs-caen-camp/issues/55)
- Pull Request: [#62](https://github.com/CaenCamp/jobs-caen-camp/pull/62)

## Statut

2020-04-12 accepted

## Contexte et énoncé du problème

La pagination est actuellement interprétée via un tableau fournit en paramètre des requêtes ce qui pose plusieurs problèmes.

Voici un exemple de pagination : `[10, 1]`

Premièrement, ce format manque de lisibilité et n'est pour le moins pas explicite.
Deuxièmement, le format utilisé et "stringyfié" rends incomptable son utilisation par React Admin du fait de sa spécification dans le contrat OpenApi.

Une première solution s'offrait alors à nous, celle de ne plus utiliser un tableau mais tout simplement une chaine de caratères mais cela avait un impact négatif et significatif sur les tests couvrant le fonctionnement de la pagination.

Or si l'on regarde les bonnes pratiques concernant la conception d'API REST on s'aperçoit qu'une meilleure implémentation est possible.

## Moteurs de décision

* Rendre plus explicite et lisible l'utilisation de la pagination
* Coller à un modèle de pagination provenant de "bonnes pratiques"

## Options envisagées

- Utiliser une chaine de caractères à la place d'un tableau
- Remplacer le paramètre unique par deux paramètres distincts : `perPage` et `currentPage`

## Résultat de la décision

Le remplacement du paramètre unique par deux paramètres distincs a été choisi car cela réponds à l'ensemble des problématiques citées ci-dessus.

### Conséquences positives

* Lisibilité des paramètres de pagination
* Poursuivre sur la voie de la conception d'une API robuste et cohérente

## Liens

* [Ressources] [Best Practices for Designing a Pragmatic RESTful API - Pagination](https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#pagination)
* [Ressources] [REST API Design: Filtering, Sorting, and Pagination - Pagination](https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/#pagination)
