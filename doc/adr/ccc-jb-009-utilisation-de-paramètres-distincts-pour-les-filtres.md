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

* Adopter des *RHS Colons* avec le format `key=value(:operator)`
* Adopter des *RHS Colons* avec le format `key(:operator)=value`
* Employer un filtre générique `q` pour appliquer une recherche de type `%LIKE%` sur plusieurs champs à la fois


## Résultat de la décision

1. Les *RHS Colons* de format `key(:operator)=value` rendront l'opérateur `:in` plus facilement implémentable à l'avenir
2. Le traitement des filtres séparément et avec ces opérateurs permet de définir des **opérateurs par défaut** qui rendent un filtre générique en `%LIKE%`  moins crucial.

### Conséquences positives

- Clarté du cod
- Documentabilité des filtres et des opérateurs
- Possibilité d'implémenter l'opérateur `:in` à l'avenir

### Conséquences négatives

- L'interface de swagger ne permet pas d'acoller les opérateurs aux paramètres de la requête (mais faisable avec postman)


## Liens <!-- facultatif -->

* [Type de lien] [Lien vers l'ADR] <!-- exemple : Raffiné par [ADR-0005](0005-exemple.md) -->
* ... <!-- le nombre de liens peut varier -->
