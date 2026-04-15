# Suivi d'Alternance

Application web fullstack pour centraliser et organiser mes recherches d'alternance.

## Stack Technique
- **Frontend :** React (Vite), Axios, Lucide React
- **Backend :** Node.js (Express), Prisma ORM
- **Base de données :** PostgreSQL
- **Infrastructure :** Docker & Docker Compose

## Installation & Lancement
1. Cloner le projet
2. Lancer les services : \`docker compose up --build\`
3. Appliquer les migrations : \`docker exec -it node_backend npx prisma migrate dev\`

## Fonctionnalités
- Tableau de bord des candidatures.
- Statuts personnalisables (En cours, Refusé, etc.).
- Vue détaillée avec prise de notes (CV envoyé, préparation entretien).
