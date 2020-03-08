# 3. Utilisation de Knex comme query builder

Date: 2020-03-08

-   Décideurs: [Alexis Janvier](https://github.com/alexisjanvier)
-   Ticket.s concerné.s: -
-   Pull Request: [#33](https://github.com/CaenCamp/jobs-caen-camp/pull/33)

## Statut

2020-03-08 proposed

## Contexte et énoncé du problème

Suite à la décision d'utiliser PostgreSQL comme base de données (voir l'ARD [Utilisation de PostgreSQL pour la persistance des données](ccc-jb-002-utilisation-de-postgresql-pour-la-persistance-des-donnees.md)) se posait la question de l'outil à utiliser pour interagir avec cette db depuis Node.

## Options envisagées

-   Utilisation d'un simple client PostgreSQL comme [pg](https://www.npmjs.com/package/pg) et écrire le SQL à la main
-   Utilisation d'un "query builder" facilitant et sécurisant la création des requêtes SQL.
-   Utilisation d'un ORM comme [Sequelize](https://sequelize.org/)

## Résultat de la décision

Option choisie : "Utilisation d'un query builder", en l'occurrence [Knex](https://knexjs.org), car cela fiabilise et accélère l'écriture des requêtes SQL tout en n'imposant pas la lourdeur et la magie d'un ORM. De plus, Knex permet de très facilement écrire des _vraies_ requêtes SQL dans les cas les plus compliqués, permettant d'obtenir la meilleure optimisation possible et exploiter au mieux les fonctionnalités propres à PostrgreSQL. Knex permet enfin de gérer les migrations.
