# Guide de Déploiement sur VPS (avec Traefik)

Ce guide détaille les étapes pour installer et lancer l'application sur votre VPS.

## 1. Pré-requis

- Un VPS sous Linux (Ubuntu/Debian recommandé).
- **Docker** et **Docker Compose** installés.
- **Traefik** déjà configuré et fonctionnel (avec un réseau externe appelé `proxy`).
- Un nom de domaine pointant vers l'IP de votre VPS.

---

## 2. Préparation du projet

Connectez-vous à votre VPS et clonez le dépôt :

```bash
git clone <votre-repo-url>
cd suivi-alternance
```

---

## 3. Configuration des variables d'environnement

Copiez le fichier d'exemple et éditez-le :

```bash
cp .env.example .env
nano .env
```

### Variables critiques à modifier :

| Variable | Description | Exemple |
| :--- | :--- | :--- |
| `DOMAIN_NAME` | Votre nom de domaine principal | `alternance.mondomaine.fr` |
| `POSTGRES_PASSWORD` | Mot de passe de la DB | `un-mot-de-passe-tres-fort` |
| `DATABASE_URL` | URL de connexion Prisma | `postgresql://user:password@db:5432/alternance` |
| `JWT_SECRET` | Clé secrète pour les tokens | `une-longue-chaine-aleatoire` |
| `VITE_API_URL` | URL de l'API (Frontend -> Backend) | `https://alternance.mondomaine.fr/api` |

---

## 4. Lancement de l'application

Utilisez le fichier de production pour construire et lancer les containers :

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 5. Initialisation de la base de données

Une fois les containers lancés, vous devez appliquer les migrations Prisma :

```bash
docker exec -it prod_node_backend npx prisma migrate deploy
```

---

## 6. Vérification

1. Vérifiez que les containers tournent : `docker ps`
2. Consultez les logs en cas de problème : `docker compose -f docker-compose.prod.yml logs -f`
3. Accédez à votre domaine : `https://alternance.mondomaine.fr`

---

## 7. Notes sur Traefik

Le fichier `docker-compose.prod.yml` utilise les labels suivants :
- **Router Web**: Gère le trafic sur `DOMAIN_NAME`.
- **Router API**: Gère le trafic sur `DOMAIN_NAME/api`.
- **TLS**: Utilise le résolveur `myresolver`. Assurez-vous que ce nom correspond à votre configuration Traefik (souvent `letsencrypt` ou `default`).

> [!IMPORTANT]
> Si votre réseau Traefik ne s'appelle pas `proxy`, modifiez la section `networks` en bas du fichier `docker-compose.prod.yml`.
