# 7. utilisation de paramètres distincts pour le tri

Date: 2020-04-22

Décideurs: [Alexis Janvier](https://github.com/alexisjanvier)
Ticket.s concerné.s: [!56](https://github.com/CaenCamp/jobs-caen-camp/issues/56)
Pull Request: [#66](https://github.com/CaenCamp/jobs-caen-camp/pull/66)

## Statut

2020-04-22 proposed

## Contexte et énoncé du problème

Comme le précise l'[issue 55](https://github.com/CaenCamp/jobs-caen-camp/issues/55),
une mise à jour de React-admin a mis en question le format des paramètres
de pagination et de tri.


Le paramètre de tri actuel est alors un tableau stringifié de la forme `['title', 'ASC']`,
ce qui donne des requêtes de la forme :

```
/api/organizations?sort=%5B%22title%22%2C%22DESC%22%5D
```

Comment parser un tableau stringifié sans aller à l'encontre des
[bonnes pratiques](https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/) ?






Le tri est traité comme le paramètre `sort`, c'est un tableau stringifié,
ici `["title", "DESC"]`.
Pour simplifier la syntaxe des requêtes depuis le front-end, nous avons scindé ce paramètres en deux paramètres, sortBy et orderBy.

Ce parti-pris améliore la lisibilité du contrat OpenAPI et simplifie la rédaction de la requête pour le front-end.

[Décrivez le contexte et l'énoncé du problème, par exemple, sous forme libre en deux ou trois phrases. Vous pouvez vouloir articuler le problème sous forme de question].


## Options envisagées

Scinder le paramètre de tri `sort` en deux paramètres distincts : `sortBy` et `orderBy`.
La requête sera de la forme :

```
api/organizations?sortBy=title&orderBy=DESC
```


## Résultat de la décision

Cette scission des paramètres est retenue.

### Conséquences positives

* Contrat OpenAPI plus lisible => interface swagger améliorée
* Simplification du code (pas besoin de parser un tableau)


### Conséquences négatives

Après la [refonte des paramètres de pagination](https://github.com/CaenCamp/jobs-caen-camp/pull/62)
et cette refonte du tri, la
[refonte des filtres de l'API](https://github.com/CaenCamp/jobs-caen-camp/issues/57)
est désormais quasi-nécessaire, par souci d'harmonisation.


## Liens

-   [Ressources][best practices for designing a pragmatic restful api - pagination](https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#pagination)
-   [Ressources][rest api design: filtering, sorting, and pagination - pagination](https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/#pagination)
