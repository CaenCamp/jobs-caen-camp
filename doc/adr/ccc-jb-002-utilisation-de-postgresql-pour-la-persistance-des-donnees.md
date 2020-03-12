# 2. Utilisation de PostgreSQL pour la persistance des données

Date: 2020-03-05

-   Décideurs: [Alexis Janvier](https://github.com/alexisjanvier)
-   Ticket.s concerné.s: -
-   Pull Request: [#33](https://github.com/CaenCamp/jobs-caen-camp/pull/33)

## Statut

2020-03-05 proposed

## Contexte et énoncé du problème

Après avoir défini le modèle de données via la contrat d'API en OpenAPI, il fallait décider du mode de persistance des données du projet.

## Options envisagées

-   Base de données relationnelle
-   Base de données de type noSQL
-   Base de données en mode SAAS

## Résultat de la décision

Option choisie : "Base de données relationnelle", parce que c'est une solution connue et éprouvée. Que c'est une solution possédant beaucoup d'outillage et qui est facile à mettre en place aussi bien en locale que sur un serveur distant. Et enfin, en utilisant [PostgreSQL](https://www.postgresql.org/), nous ne nous privons pas d'une approche "document" grace à l'utilisation du jsonb.

### Conséquences positives

-   On pourra persister de la donnée :)
-   On ne se coupe pas de la possibilité d'une approche documents.
-   Le SQL est une techno globalement bien partagée et dans tous les cas très bien documentée. On peut donc espérer que cela facilitera la prise en main du projet par le plus grand nombre.

### Conséquences négatives

-   Il nous faudra un serveur pour la mise en production du projet.
-   On alourdi un peu le projet, les volumes de données traitées ne nécessitant probablement pas un outils aussi puissant que PostgreSQL.
