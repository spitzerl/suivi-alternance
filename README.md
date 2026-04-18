# Suivi d'Alternance 🚀

Application web fullstack pour centraliser et organiser mes recherches d'alternance.

## 🛠 Stack Technique
- **Frontend :** React (Vite), Axios, Tailwind CSS, Lucide React
- **Backend :** Node.js (Express), Prisma ORM, JWT, Helmet
- **Base de données :** PostgreSQL
- **Infrastructure :** Docker & Docker Compose

---

## 🚀 Installation Rapid (Mode Développement)

C'est le mode idéal pour travailler sur le projet localement avec rechargement automatique (Hot Reloading).

### 1. Prérequis
- Docker & Docker Compose installés.

### 2. Configuration
Copiez le fichier d'exemple pour créer votre environnement local :
```bash
cp .env.example .env
```

### 3. Lancement
```bash
# Lancer les services (Dashboard, API, DB)
docker compose up --build

# Initialiser la base de données (dans un autre terminal)
docker exec -it node_backend npx prisma migrate dev
```

- **Frontend** : `http://localhost:5173`
- **Backend (API)** : `http://localhost:5000/api`
- **Adminer (DB UI)** : `http://localhost:8080`

---

## 🌐 Déploiement (Mode Production / VPS)

Ce mode est optimisé pour les performances : le front-end est servi par Nginx et le back-end est minifié.

### 1. Préparation sur le serveur
```bash
git clone <votre-url-repo>
cd suivi-alternance
cp .env.example .env
```
> [!IMPORTANT]
> Changez impérativement la valeur de `JWT_SECRET` dans le `.env`.
> Mettez à jour `VITE_API_URL` avec l'adresse IP de votre serveur (ex: `http://votre-ip:5000/api`).

### 2. Lancement en production
```bash
# Utilise le fichier de configuration de production dédié
docker compose -f docker-compose.prod.yml up -d --build

# Appliquer les migrations sans mode interactif
docker exec -it prod_node_backend npx prisma migrate deploy
```

- **Accès Public** : `http://votre-ip` (Port 80 par défaut)
- **Logs** : `docker compose -f docker-compose.prod.yml logs -f`

---

## ✨ Fonctionnalités Clés
- **Tableau de Bord** : Vue d'ensemble de toutes les candidatures.
- **Auto-complétion** : Suggestions intelligentes basées sur vos saisies précédentes (Entreprises, Postes, Lieux, Sources).
- **Relance Dynamique** : Slider pour ajuster le seuil de relance et indicateurs visuels (cloche pulsante) pour les entreprises à recontacter.
- **Exports/Imports** : Gestion des données en JSON, CSV et Excel.
- **Sécurité** : Authentification par JWT, mots de passe hashés avec BCrypt, et headers HTTP sécurisés avec Helmet.

---

## 🗄️ Gestion de la Base de Données (Prisma)

Toute modification de la structure des données doit passer par Prisma. Voici les étapes à suivre :

### 1. Modifier le schéma
Éditez le fichier `backend/prisma/schema.prisma` pour ajouter ou modifier des champs/modèles.

### 2. Créer et appliquer une migration (Développement)
Une fois le schéma modifié, générez une nouvelle migration pour mettre à jour votre base de données locale :
```bash
docker exec -it node_backend npx prisma migrate dev --name nom_de_votre_migration
```
*Cette commande met également à jour le client Prisma automatiquement.*

### 3. Déploiement des changements (Production)
En production, on n'utilise pas `migrate dev`. On applique les migrations existantes :
```bash
docker exec -it prod_node_backend npx prisma migrate deploy
```

### 4. Outils Utiles
- **Prisma Studio** (Interface graphique pour voir les données) :
  ```bash
  docker exec -it node_backend npx prisma studio --browser none
  ```
  Ensuite, accédez à `http://localhost:5555`.
- **Régénérer le Client Prisma** (si besoin) :
  ```bash
  docker exec -it node_backend npx prisma generate
  ```
- **Réinitialiser la DB** (Attention : supprime toutes les données) :
  ```bash
  docker exec -it node_backend npx prisma migrate reset
  ```
