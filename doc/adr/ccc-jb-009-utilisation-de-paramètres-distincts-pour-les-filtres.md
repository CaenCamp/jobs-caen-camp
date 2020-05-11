# 9. utilisation de paramètres distincts pour les filtres

Date: 2020-05-07

- Décideurs:
  - [Alexis Janvier](https://github.com/alexisjanvier)
  - [Emmanuel Bosquet](https://github.com/Keksoj)
- Ticket.s concerné.s: [issue 57](https://github.com/CaenCamp/jobs-caen-camp/issues/57)
[La pull request dédiée](https://github.com/CaenCamp/jobs-caen-camp/pull/69)

## Statut

<!-- les statuts sont en anglais : proposed/accepted/done/deprecated/superseded -->
2020-05-07 proposed

## Contexte et énoncé du problème

Dans la continuité de la refonte de la [pagination](https://github.com/CaenCamp/jobs-caen-camp/pull/62) et du [tri](https://github.com/CaenCamp/jobs-caen-camp/pull/66) de l'api, ll semble judicieux d'extraire chaque filtre en tant que paramètre de requête à part entière.

## Les motivations

* Se rapprocher des [bonnes pratiques](https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#advanced-queries)
* Employer des [opérateurs](https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/#filtering) pour systématiser le comportement des filtres
* Documenter le tout dans le contrat openAPI

## Options envisagées

* Adopter des *RHS Colons* avec le format `key(:operator)=value` rendrait l'opérateur `:in` plus facilement implémentable à l'avenir
* Adopter des *RHS Colons* avec le format `key=value(:operator)` permet une validation stricte du contrat openAPI
* Employer un filtre générique `q` pour appliquer une recherche de type `%LIKE%` sur plusieurs champs à la fois
* Appliquer des opérateurs par défaut, par exemple `%LIKE%` pour le filtre `title`


## Résultat de la décision

1. Les *RHS Colons* de format `key=value(:operator)`
2. Le traitement des filtres séparément et avec ces opérateurs permet de définir des **opérateurs par défaut** qui rendent un filtre générique en `%LIKE%`  moins crucial.
3. Pas de filtre générique `q`
4. Pas d'opérateurs par défaut.

### Conséquences positives

- Clarté du code
- Documentabilité des filtres et des opérateurs

### Conséquences négatives

- Il faut mettre à jour React-admin ([issue 71](https://github.com/CaenCamp/jobs-caen-camp/issues/71))

