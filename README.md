# Proof of Project - Starter Kit Node.js

Starter kit Node.js moderne avec déploiement automatique, environnements preview et stack complète (PostgreSQL, Redis, Mailpit).

## 🚀 Stack Technique

### Backend

- **Node.js 22** - Runtime JavaScript
- **Drizzle ORM** - ORM type-safe pour PostgreSQL
- **PostgreSQL 15** - Base de données relationnelle
- **Redis 7** - Cache et compteurs
- **Mailpit** - Serveur SMTP de développement/test

### Infrastructure

- **Docker & Docker Compose** - Containerisation
- **Traefik** - Reverse proxy avec SSL automatique
- **GitHub Actions** - CI/CD automatisé
- **GitHub Container Registry** - Registry Docker

### Sécurité

- **Rate Limiting** - Protection API (100 req/min, burst 50)
- **Basic Auth** - Protection interface Mailpit
- **SSL/TLS** - Certificats automatiques via Let's Encrypt

## 📦 Architecture

```
┌─────────────┐
│   Traefik   │ (Reverse Proxy + SSL)
└──────┬──────┘
       │
   ┌───┴────┬──────────────┐
   │        │              │
┌──▼──┐  ┌──▼────┐    ┌───▼────┐
│ App │  │Mailpit│    │  DB    │
└──┬──┘  └───────┘    └───┬────┘
   │                      │
   └──────────┬────────────┘
              │
         ┌────▼────┐
         │  Redis  │
         └─────────┘
```

### Services

- **app** - Application Node.js (port 3000)
- **db** - PostgreSQL avec volume persistant
- **redis** - Cache Redis
- **mailpit** - Serveur SMTP avec interface web
- **db-backup** - Sauvegarde automatique quotidienne

## 🛠️ Déploiement Automatique

### Production (branche `main`)

Chaque push sur `main` déclenche :

1. Build de l'image Docker
2. Push vers GitHub Container Registry
3. Déploiement automatique sur le VPS
4. Génération automatique du fichier `.env`
5. Redémarrage des services

**URL de production** : `https://proof-of-project.avqn.ch`

### Preview Environments (Pull Requests)

Chaque Pull Request crée automatiquement :

- Un environnement isolé avec sa propre base de données
- Une URL unique : `https://pr-{number}.proof-of-project.avqn.ch`
- Un commentaire automatique sur la PR avec l'URL

**Nettoyage automatique** : L'environnement preview est supprimé à la fermeture de la PR.

## 🏃 Développement Local

### Prérequis

- Node.js 22+
- Docker & Docker Compose

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd proof-of-project

# Installer les dépendances
npm install

# Lancer PostgreSQL en local (port 5433)
docker compose -f docker-compose.dev.yml up -d

# Configurer la variable d'environnement DATABASE_URL
export DATABASE_URL="postgresql://app_user:dev_password@localhost:5433/mydb"

# Lancer les migrations
npm run db:migrate

# Démarrer l'application
npm start
```

### PostgreSQL Local

Pour le développement, utilisez `docker-compose.dev.yml` qui lance uniquement PostgreSQL :

```bash
# Démarrer PostgreSQL
npm run dev:db:up

# Arrêter PostgreSQL
npm run dev:db:down

# Voir les logs
npm run dev:db:logs
```

Ou avec Docker Compose directement :

```bash
docker compose -f docker-compose.dev.yml up -d
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml logs -f db
```

**Configuration par défaut :**

- Port : `5433` (pour éviter les conflits)
- User : `app_user`
- Password : `dev_password`
- Database : `mydb`
- URL : `postgresql://app_user:dev_password@localhost:5433/mydb`

### Commandes Utiles

```bash
# Générer une migration depuis le schema
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# Voir les logs
docker compose logs -f app

# Arrêter les services
docker compose down

# Arrêter et supprimer les volumes
docker compose down -v
```

## 📁 Structure du Projet

```
proof-of-project/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # Déploiement production
│       ├── preview.yml         # Déploiement preview PR
│       └── cleanup.yml         # Nettoyage preview
├── drizzle/
│   ├── schema.js               # Schema Drizzle ORM
│   ├── migrations/             # Migrations SQL
│   └── config.js               # Configuration Drizzle
├── server.js                   # Point d'entrée de l'application
├── Dockerfile                  # Image Docker
├── docker-compose.yml          # Configuration Docker Compose
├── Makefile                    # Commandes SSH utiles
└── package.json                # Dépendances Node.js
```

## 🔧 Configuration

### Variables d'Environnement

```bash
# Base de données
DATABASE_URL=postgresql://user:password@host:5432/dbname
POSTGRES_HOST=db
POSTGRES_USER=app_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=mydb

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# SMTP (Mailpit)
SMTP_HOST=mailpit
SMTP_PORT=1025

# Application
NODE_ENV=production
```

### Secrets GitHub Actions

Configurer dans les secrets du repository :

- `VPS_HOST` - Adresse IP ou hostname du VPS
- `VPS_USER` - Utilisateur SSH
- `VPS_SSH_KEY` - Clé privée SSH
- `DB_PASSWORD` - Mot de passe PostgreSQL

## 📊 Fonctionnalités

- ✅ API REST simple avec compteur de visiteurs
- ✅ Persistance PostgreSQL via Drizzle ORM
- ✅ Cache Redis pour compteurs
- ✅ Envoi d'emails via Mailpit
- ✅ Interface web Mailpit pour visualiser les emails
- ✅ Sauvegarde automatique de la base de données
- ✅ Rate limiting sur l'API
- ✅ SSL/TLS automatique
- ✅ Déploiement automatique production
- ✅ Environnements preview pour PR

## 🔐 Sécurité

- Rate limiting : 100 requêtes/minute (burst 50)
- Basic Auth sur l'interface Mailpit
- Variables sensibles dans les secrets GitHub
- Fichier `.env` avec permissions restrictives (600)
- Réseaux Docker isolés

## 📝 Makefile Commands

Commandes SSH pour gérer le serveur distant :

```bash
make ssh          # Connexion SSH au serveur
make logs         # Voir les logs en temps réel
make backup       # Backup manuel immédiat
make reset-db     # Reset la base de données (⚠️ danger)
make console      # Ouvrir une console dans le conteneur
```

## 🗄️ Base de Données

### Schema

```javascript
visitorLog {
  id: serial (PK)
  message: text
  userAgent: text
  createdAt: timestamp
}
```

### Migrations

```bash
# Générer une migration
npm run db:generate

# Appliquer les migrations
npm run db:migrate
```

## 📧 Mailpit

Interface web accessible à : `https://emails.proof-of-project.avqn.ch`

- Authentification Basic Auth requise
- Visualisation de tous les emails envoyés
- Capture SMTP sur le port 1025

## 🔄 Backup

Sauvegarde automatique configurée :

- **Fréquence** : Quotidienne (@daily)
- **Rétention** :
  - 7 derniers jours
  - 4 dernières semaines
  - 6 derniers mois

Les backups sont stockés dans `./backups/` sur le serveur.

## 📄 Licence

MIT
