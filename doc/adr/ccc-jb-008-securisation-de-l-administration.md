# 8. Sécurisation de l'Administration

Date: 2020-04-09

-   Décideurs: [Alexis Janvier](https://github.com/alexisjanvier)
-   Ticket.s concerné.s: [Sécurisation de l’administration #47](https://github.com/CaenCamp/jobs-caen-camp/issues/47)
-   Pull Request: [Sécurisation de l’administration #61](https://github.com/CaenCamp/jobs-caen-camp/pull/61)

## Statut

2020-04-09 proposed

## Contexte et énoncé du problème

Pour la première mise en ligne du site JobBoard, l'application publique se contentera d'afficher la liste des offres d'emploi disponible en base de données. Mais pour pouvoir ajouter et mettre à jours ces offres, nous avons dû mettre en place une administration (en react-admin). Pour le moment, c'est interfcae d'administration est tout aussi publique que la liste publique ... Il faut donc mettre en place une authentification permettant de sécuriser l'administration.

## Moteurs de décision

Question des comptes utilisateurs et de la propriété de la data très forte
Solution devant être rapide à mettre en place
Dans les règles de l'art

## Options envisagées

1. un unique compte en dur
2. des comptes en base de données

## Résultat de la décision

Option choisie : "option 2: gestion de comptes en base de données", parce que cela permettra de proprement stocker des mots de passe cryptés et de facilement ajouter des comptes.

### Conséquences positives

-   Une administration protégée !

### Conséquences négatives

-   une gestion de comptes possiblement différentes de la gestion des utilisateurs. Mais ce n'est en fait pas forcement négatif.

## Détails sur la solution choisie

### La table user_account

Tout d'abord, la table se nomme `user_account` car `user` est un nom réservé par postgreSQL. Pourquoi pas `users` ? Et bien parce que j'ai l'habitude de nommer les tables au singulier, et c'est ce qui a été fait sur les autres tables...

Ensuite, cette table est minimal :

-   pas d'email, et bien parce que l'on en a pas besoin (pas de mécanisme permettant de faire un reset de mot de passe par email par exemple)
-   pas de rôle. Il aurait fallut choisir le type de stockage des rôles... L'utilisation d'un `enum` semble approprié, mais l'utilisation des `type` `enum` natif de postgreSQL semble posé problème lors des migration avec `knex` (problème rencontré sur le projet `usinePartagee`. Du coup, comme l'utilisation des rôle ne se pose pas à ce moment du projet, il est urgent d'attendre d'en avoir besoin pour les implémenter.

Du coup, ne reste dans cette table :

-   id (uuid)
-   username (string)
-   password (hash)
-   created_at (datetime)

Il y a un index de type `UNIQUE` sur le `username`.

### L'objet user

1. Le `username` devra avoir entre 3 et 20 [caractères alphanumériques](https://fr.wikipedia.org/wiki/Caract%C3%A8re_alphanum%C3%A9rique), sans espace, avec éventuellement un `-`.
2. Le mot de passe devra être complexe suivant la norme [OWASP Guidelines for enforcing secure passwords](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/migrated_content). Pour cela, nous utiliserons le module [OWASP Password Strength Test](https://www.npmjs.com/package/owasp-password-strength-test).
3. Le mot de passe sera stocké en base sous forme d'un [hash BCrypt](https://fr.wikipedia.org/wiki/Bcrypt). Pour effectuer le hashage et pour tester les mots de passe lors de la connexion, nous utiliserons le module [bcrypt](https://www.npmjs.com/package/bcrypt).

### La table refresh_token

Afin de se calquer sur les bonnes pratiques, l'implementation de l'utilisation du [JSON Web Token(JWT)](https://tools.ietf.org/html/rfc7519) s'appuie sur les recommandations du post de blog [The Ultimate Guide to handling JWTs on frontend clients](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/).

Ce qu'il faut retenir de cette implementation, c'est que l'on considère que la meilleur manière de conserver le JWT côté client est de la conserver en mémoire. C'est ainsi qu'on minimisera au maximum le vol potentiel de ce jeton, jeton qui aura au demeurant une durée de vie assez courte (10 min). Mais pour pallier aux inconveniants de ne le maintenir qu'en mémoire (on perd le jeton en rafraichissant la page par exemple !), on va implémenter un mécanisme permettant de renouveller ce jeton en se basant sur un endpoint (`/refresh-token`) qui utilisera un cookie qui lui sera sécurisé. La table `refresh_token` est la table utilisée pour gérer ces jetons de rafraichissement de JWT.
