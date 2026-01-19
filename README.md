# APIHarbour# 🚢 Port de Plaisance Russell - API & Interface Web

Application complète de gestion des réservations de catways (appontements) avec API REST, authentification et interface d'administration.

## 📋 Table des matières

- [Technologies utilisées](#technologies-utilisées)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Configuration MongoDB](#configuration-mongodb)
- [Lancement de l'application](#lancement-de-lapplication)
- [Utilisation](#utilisation)
- [Structure de l'API](#structure-de-lapi)
- [Dépannage](#dépannage)

---

## 🛠️ Technologies utilisées

- **Backend**: Node.js + Express
- **Base de données**: MongoDB + Mongoose
- **Authentification**: Sessions + bcrypt
- **Templates**: EJS
- **Frontend**: HTML5 + CSS3 + JavaScript vanilla

---

## ✨ Fonctionnalités

### Gestion des Catways
- ✅ Lister tous les catways disponibles
- ✅ Consulter les détails d'un catway
- ✅ Créer de nouveaux catways
- ✅ Modifier l'état d'un catway
- ✅ Supprimer un catway (si aucune réservation active)

### Gestion des Réservations
- ✅ Créer des réservations
- ✅ Consulter les réservations par catway
- ✅ Modifier une réservation
- ✅ Supprimer une réservation
- ✅ Détection automatique des conflits de dates

### Gestion des Utilisateurs
- ✅ Authentification sécurisée
- ✅ Création d'utilisateurs
- ✅ Modification de profil
- ✅ Suppression d'utilisateurs

### Interface Web
- ✅ Dashboard avec réservations en cours
- ✅ Pages de gestion (catways, réservations, utilisateurs)
- ✅ Design responsive
- ✅ Navigation intuitive

---

## 📦 Installation

### Prérequis

- Node.js v16 ou supérieur
- MongoDB (local ou Atlas)
- Git

### Étapes d'installation

```bash
# 1. Créer le dossier du projet
mkdir russell-port-api
cd russell-port-api

# 2. Initialiser npm
npm init -y

# 3. Installer les dépendances
npm install express mongoose bcrypt express-session dotenv cors ejs
npm install swagger-ui-express swagger-jsdoc
npm install --save-dev nodemon

# 4. Créer la structure des dossiers
mkdir -p config models routes middleware scripts public/css views data
```

---

## 🗄️ Configuration MongoDB

### Option 1: MongoDB Local

```bash
# Installer MongoDB sur votre machine
# Windows: télécharger depuis mongodb.com
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Démarrer MongoDB
mongod
```

Votre URI sera: `mongodb://localhost:27017/russell-port`

### Option 2: MongoDB Atlas (Cloud - Recommandé)

1. **Créer un compte sur MongoDB Atlas**
   - Aller sur https://www.mongodb.com/cloud/atlas
   - Cliquer sur "Try Free"
   - S'inscrire avec email/mot de passe

2. **Créer un cluster**
   - Cliquer sur "Build a Database"
   - Choisir "M0 Free" (gratuit)
   - Sélectionner une région proche (ex: Paris/Frankfurt)
   - Cliquer sur "Create"

3. **Configurer la sécurité**
   
   a. **Créer un utilisateur de base de données**
   - Aller dans "Database Access"
   - Cliquer sur "Add New Database User"
   - Nom d'utilisateur: `russellUser`
   - Mot de passe: générer un mot de passe sécurisé (noter le)
   - Privilèges: "Read and write to any database"
   - Cliquer sur "Add User"

   b. **Configurer l'accès réseau**
   - Aller dans "Network Access"
   - Cliquer sur "Add IP Address"
   - Cliquer sur "Allow Access from Anywhere" (0.0.0.0/0)
   - Cliquer sur "Confirm"

4. **Obtenir l'URI de connexion**
   - Retourner dans "Database"
   - Cliquer sur "Connect" sur votre cluster
   - Choisir "Connect your application"
   - Copier l'URI qui ressemble à:
   ```
   mongodb+srv://russellUser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Remplacer `<password>` par votre mot de passe
   - Ajouter le nom de la base: `russell-port` avant les paramètres:
   ```
   mongodb+srv://russellUser:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/russell-port?retryWrites=true&w=majority
   ```

### Créer le fichier .env

Créer un fichier `.env` à la racine du projet:

```env
PORT=3000
MONGODB_URI=mongodb+srv://russellUser:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/russell-port?retryWrites=true&w=majority
SESSION_SECRET=votre_secret_super_securise_changez_moi_12345678
NODE_ENV=development
```

⚠️ **Important**: Remplacez `VOTRE_MOT_DE_PASSE` par le mot de passe créé sur Atlas.

---

## 🚀 Lancement de l'application

### 1. Créer les fichiers JSON de données

Créer `data/catways.json` et `data/reservations.json` avec les données fournies dans la documentation.

### 2. Importer les données initiales

```bash
npm run import
```

Vous devriez voir:
```
✅ Connecté à MongoDB
🗑️  Collections nettoyées
✅ 24 catways importés
✅ 6 réservations importées
✅ Utilisateur admin créé (admin@russell-port.fr / admin123)
🎉 Import terminé!
```

### 3. Démarrer le serveur

```bash
# Mode développement (redémarre automatiquement)
npm run dev

# OU mode production
npm start
```

Le serveur démarre sur: **http://localhost:3000**

---

## 🎯 Utilisation

### 1. Accéder à l'application

Ouvrir un navigateur et aller sur: `http://localhost:3000`

### 2. Se connecter

Cliquer sur "Se connecter" et utiliser:
- **Email**: `admin@russell-port.fr`
- **Mot de passe**: `admin123`

### 3. Navigation

- **Dashboard**: Vue d'ensemble des réservations en cours
- **Catways**: Gestion des appontements
- **Réservations**: Gestion des réservations
- **Utilisateurs**: Gestion des comptes

---

## 📡 Structure de l'API

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/login` | Connexion utilisateur |
| GET | `/logout` | Déconnexion |

### Catways

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/catways` | Liste tous les catways |
| GET | `/catways/:id` | Récupère un catway |
| POST | `/catways` | Crée un catway |
| PUT | `/catways/:id` | Modifie un catway |
| DELETE | `/catways/:id` | Supprime un catway |

### Réservations

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/catways/:id/reservations` | Liste les réservations d'un catway |
| GET | `/catways/:id/reservations/:idReservation` | Récupère une réservation |
| POST | `/catways/:id/reservations` | Crée une réservation |
| PUT | `/catways/:id/reservations/:idReservation` | Modifie une réservation |
| DELETE | `/catways/:id/reservations/:idReservation` | Supprime une réservation |

### Utilisateurs

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/users` | Liste tous les utilisateurs |
| GET | `/users/:email` | Récupère un utilisateur |
| POST | `/users` | Crée un utilisateur |
| PUT | `/users/:email` | Modifie un utilisateur |
| DELETE | `/users/:email` | Supprime un utilisateur |

---

## 🔧 Dépannage

### Erreur "Cannot connect to MongoDB"

**Solution 1**: Vérifier que MongoDB est démarré (si local)
```bash
mongod
```

**Solution 2**: Vérifier l'URI dans `.env`
- L'URI doit être correcte
- Le mot de passe ne doit pas contenir de caractères spéciaux non encodés
- L'IP doit être autorisée sur Atlas

### Erreur "Port 3000 already in use"

```bash
# Trouver le processus
lsof -ti:3000

# Le tuer
kill -9 $(lsof -ti:3000)

# OU utiliser un autre port dans .env
PORT=3001
```

### Les données ne s'importent pas

```bash
# Vérifier que les fichiers JSON existent
ls data/

# Réimporter
npm run import
```

### Session expirée constamment

Vérifier que `SESSION_SECRET` dans `.env` est défini et ne change pas entre les redémarrages.

---

## 📝 Codes de statut HTTP

- **200**: Succès
- **201**: Créé avec succès
- **400**: Requête invalide
- **401**: Non authentifié
- **403**: Interdit
- **404**: Non trouvé
- **409**: Conflit (ex: réservation qui chevauche)
- **500**: Erreur serveur

---

## 👥 Contributeurs

Développé pour la gestion du Port de Plaisance Russell.

## 📄 Licence

ISC