# Listes déroulantes liées en Ajax + appel API

## Le projet

1. A l'affichage de la page, la liste déroulante des régions administratives françaises est chargée en faisant appel à l'API [geo.gouv.fr](https://geo.api.gouv.fr), donc via une requête <abbr title="Asynchornous JavaScript and XML">Ajax</abbr> utilisant les instructions `fetch`, `async` et `await`. 
2. Quand l'utilisateur sélectionne une région, un nouvel appel à l'API retourne les départements de la région concernée et les affiche dans la seconde liste déroulante.  

## Précisions 

* Le framework CSS Bootstrap est utilisé en chargement <abbr title="Content Delivery Network">CDN</abbr>, ce qui peut nuire à la performance (_Core Web Vitals_). 
* De même les fichiers CSS et JS ne sont pas minifiés, afin de pouvoir observer le code. 
* Le formulaire n'a pas de destination (attribut `action`), donc par défaut un clic sur le bouton _Envoyer_ recharge la page ce qui efface les valeurs des listes déroulantes.  

## Installation 

Le projet ne contient que des fichiers HTML, CSS et Javascript : clonez le projet puis exécutez le fichier _index.html_ (ouverture dans votre navigateur par défaut). 