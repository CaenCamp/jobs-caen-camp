# 8. Sécurisation de l'Administration

Date: 2020-04-09

- Décideurs: [Alexis Janvier](https://github.com/alexisjanvier)
- Ticket.s concerné.s: [Sécurisation de l’administration #47](https://github.com/CaenCamp/jobs-caen-camp/issues/47)
- Pull Request:

## Statut

2020-04-09 proposed

## Contexte et énoncé du problème

Pour la première mise en ligne du site JobBoard, l'application publique se contentera d'afficher la liste des offres d'emploi disponible en base de données. Mais pour pouvoir ajouter et mettre à jours ces offres, nous avons dû mettre en place une administration (en react-admin). Pour le moment, c'est interfcae d'administration est tout aussi publique que la liste publique ... Il faut donc mettre en place une authentification permettant de sécuriser l'administration.

## Moteurs de décision

Question des comptes utilisateurs et de la propriété de la data très forte
Solution devant être rapide à mettre en place
Dans les règles de l'art

## Options envisagées

1) un unique compte en dur
2) des comptes en base de données

## Résultat de la décision

Option choisie : "option 2: gestion de comptes en base de données", parce que cela permettra de proprement stocker des mots de passe cryptés et de facilement ajouter des comptes.

### Conséquences positives

- Une administration protégée !

### Conséquences négatives

- une gestion de comptes possiblement différentes de la gestion des utilisateurs. Mais ce n'est en fait pas forcement négatif.

## Détails sur la solution choisie

## Liens

- articles de référence
- post de blog récapitulatif
