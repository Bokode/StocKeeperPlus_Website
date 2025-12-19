# StocKeeper+ Website

Bienvenue sur la documentation du frontend de **StocKeeper+**. Cette application est un dashboard qui permet de gérer l'intégralité des données de l'applicqtion StocKeeper+

## Fonctionnalités Principales

* **Tableau de Bord Interactif** : Vue d'ensemble des stocks et alertes visuelles sur les dates de péremption (Calendrier).
* **Cartographie** : Localisation des magasins et visualisation des points de vente via des cartes interactives.
* **Gestion de Contenu** : Tableaux dynamiques pour consulter, trier et filtrer les aliments et les recettes.
* **Interface CRUD Modale** : Création, lecture et modification des éléments via des fenêtres pop-up sans rechargement de page.
* **Authentification Sécurisée** : Gestion de la session utilisateur, protection des routes privées et redirection automatique.

## Technologies Utilisées

* **Build Tool & Serveur de Dev** : [Vite](https://vitejs.dev/)
* **Framework UI** : [React](https://react.dev/)
* **Bibliothèque de Composants** : [Material UI (MUI)](https://mui.com/)
* **Routage** : [React Router DOM](https://reactrouter.com/)
* **Gestion des Dates** : [Day.js](https://day.js.org/)
* **Icônes** : [FontAwesome](https://fontawesome.com/)
* **Requêtes HTTP** : Fetch API (avec gestion des identifiants/cookies)

## Prérequis

Pour lancer ce projet dans le cadre de la solution globale, vous avez uniquement besoin de :

* **Docker Desktop** (ou Docker Engine + Docker Compose) installé et lancé sur votre machine.

*L'application frontend est conteneurisée et servie via Vite à l'intérieur de l'environnement Docker.*

## Installation & Démarrage

### Lancement

Ouvrez un terminal à la racine du dossier StocKeeperPlusProject (le dossier parent contenant `api` et `website`) et exécutez la commande :

```bash
docker compose up --build

```

*Le conteneur du site web sera construit et lancé automatiquement en parallèle de l'API et de la base de données.*

### Vérification

Une fois le démarrage terminé :

* **Frontend (Site Web)** : Accessible à l'adresse [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)

## Scripts Disponibles

* `npm run dev` : Lance le serveur de développement local (nécessite Node.js installé localement).
