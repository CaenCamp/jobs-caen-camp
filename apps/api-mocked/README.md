# Site des offres d'emploi des CaenCamp: l'API simulée

L'architecture du projet se base donc sur une [API](../api/README.md) qui sera utilisée par une [application web](../front/README.md). Afin de faciliter le démarrage du projet (par exemple de commencer le dev de l'application web sans attendre que l'API soit codée), nous avons mis en place un serveur d'API _mocké_.

Ce serveur utilise [json-server](https://github.com/typicode/json-server), et le modèle est défini dans le fichier `db.json`.

## Schemas

-   [Organization](http://schema.org/Organization)
-   [Offer](http://schema.org/JobPosting)
