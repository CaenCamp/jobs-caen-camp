# Tests e2e de l'application jobBoard

Il ne s'agit pas ici d'une application, mais de l'ensemble des tests e2e effectué sur l'application jobBoard.

## Le build

Les tests e2e sont lancés sur une application (le front en fait) buildée. Le build s'effectue avec la commande `make build`.

Cela permet de démarrer un environnement de test se rapprochant des conditions de production. Cet environnement se lance avec la commande `make test-env-start` et s'arrête avec `make test-env-stop`.

## Les tests e2e sur l'API

Les tests sur l'API sont lancés avec `jest` mais utilise le framework de test [frisby.js](https://www.frisbyjs.com/) qui permet en plus de lancer une requête http afin de créer des `expect` sur le retour, de valider le format du retour grâce à l'utilisation de [Joi](https://github.com/hapijs/joi#readme).

Pour le moment, il faut forcement executer ces tests dans un conteneur Docker, l'url de test étant en "dur".

## Les tests e2e sur le Front

Pour les tests front, c'est [cypress](https://www.cypress.io/) qui est utilisé conjointement avec [Testing Library](https://testing-library.com/docs/cypress-testing-library/intro) déjà utilisé pour tester les composants Svelte.

Pour le moment les tests cypress ne peuvent être lancer que depuis l'environnement locale afin de profiter de l'interface de visualisation des tests.

Il faut sans doute attendre d'en savoir plus sur ce que sera l'environnement final pour décider de la bonne stratégie de lancement des tests Cypress sur la CI ...

Voici quelques liens interessants sur les bonnes pratiques concernant les tests avec Cypress :

-   [Cypress tips and tricks](https://glebbahmutov.com/blog/cypress-tips-and-tricks)
-   [Notes of Best Practices for writing Cypress tests](https://ruleoftech.com/2019/notes-of-best-practices-for-writing-cypress-tests)
-   [The Hitchhikers Guide to Cypress End-To-End Testing](https://blog.alec.coffee/the-hitchhikers-guide-to-cypress-end-to-end-testing)

> A noter qu'il est possible de mettre en place des tests utilisant la syntaxe [cucumber/gherkin pour cypress](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor).
