# 6. Remplacement de l'en-tête Content-Range par X-Total-Count et Link

Date: 2020-04-13

- Décideurs: [Alexis Janvier](https://github.com/alexisjanvier)
- Ticket.s concerné.s: [!55](https://github.com/CaenCamp/jobs-caen-camp/issues/55)
- Pull Request: [#62](https://github.com/CaenCamp/jobs-caen-camp/pull/62)

## Statut

2020-04-13 accepted

## Contexte et énoncé du problème

L'utilisation de l'en-tête `Content-Range` pour fournir des informations concernant la pagination selon les [spécifications](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) est inappropriée car celui-ci est normalement utilisé dans l'objectif de fournir une réponse partielle d'un contenu associé à une code de retour spécifique ([206 - Partial Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206)).

Il faut donc trouver un moyen alternif de fournir ces informations.

## Moteurs de décision

* Faire une utilisation correcte des en-têtes conformément aux spécifications

## Options envisagées

* Introduire les objets `meta` et `links` dans le corps de la réponse
* Ajouter les en-têtes `X-Total-Count` et `Link`

## Résultat de la décision

L'ajout des en-têtes a été choisi car elle n'altère pas le corps de la réponse et permet de continuer à fournir les informations de pagination via les en-têtes comme ce qui était le cas initialement.

## Liens

* [Ressources] [Content-Range - Mozilla Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range)
* [Ressources] [Link - RFC5988](http://tools.ietf.org/html/rfc5988#page-6)
