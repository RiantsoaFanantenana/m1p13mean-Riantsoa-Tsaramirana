```md
# 📦 m1p13mean – Riantsoa Tsaramirana  
**Projet Final – Master 1 | Mars 2026**

---

## 📖 Présentation

API REST développée dans le cadre du projet final de Master 1.

Cette application permet :

- 🔐 L’authentification des clients  
- 🏪 L’enregistrement et la gestion des boutiques  
- ⚙️ La configuration initiale des shops  
- 📊 Le suivi des boutiques non configurées  

L’API est conçue selon une architecture RESTful avec séparation claire des responsabilités (routes, contrôleurs, modèles, middleware).

---

## 🚀 Base URL

```

[http://localhost:3000/api](http://localhost:3000/api)

````

---

## 🔐 Authentification

### `POST /api/auth/register`

Inscription d’un client.

#### Body (JSON)

```json
{
  "email": "client@example.com",
  "password": "password123"
}
````

---

### `POST /api/auth/login`

Connexion d’un client.

#### Body (JSON)

```json
{
  "email": "admin@mall.com",
  "password": "admin123"
}
```

#### Réponse (exemple)

```json
{
  "status": "success",
  "token": "jwt_token_here"
}
```

---

## 🛠 Administration

### `POST /api/admin/register-shop`

Créer et enregistrer une nouvelle boutique.

#### Body (JSON)

```json
{
  "shopName": "Tech Store",
  "email": "shop@example.com",
  "shopType": "electronics",
  "duration": 12,
  "startDate": "2026-03-01",
  "boxId": "BOX-01"
}
```

#### Champs requis

* `shopName` : Nom de la boutique
* `email` : Email du shop
* `shopType` : Type d’activité
* `duration` : Durée du contrat (en mois)
* `startDate` : Date de début du contrat
* `boxId` : Identifiant du box

---

## 🏪 Gestion des Shops

### `PATCH /api/shop/configure`

Configuration initiale d’un shop après création.

#### Body (JSON)

```json
{
  "user": "shop@example.com",
  "newPassword": "newStrongPassword",
  "logo": "logo_url_or_path",
  "coverPic": "cover_url_or_path",
  "description": "Description de la boutique"
}
```

#### Champs requis

* `user` : Identifiant ou email du shop
* `newPassword` : Nouveau mot de passe
* `logo` : Image/logo du shop
* `coverPic` : Image de couverture
* `description` : Description du shop

---

### `POST /api/shop/log-unconfigured`

Permet d’enregistrer ou de logger les boutiques qui ne sont pas encore configurées.

#### Exemple de réponse

```json
{
  "status": "success",
  "message": "Unconfigured shops logged successfully"
}
```

---
## 🏪 Données dashboard

### `GET /api/admin/revenues-expenditures`

Permet de récupérer les revenues et les dépenses totaux

#### Exemple de réponse

```json
{
  "totalExpenditure": 120 000,
  "totalRevenue": 200 000
}
```

### `GET /api/admin/revenues-details`

Permet de les revenues totaux pa catégorie (Loyer, Abonnement)

#### Exemple de réponse

```json
{
  "totalExpenditure": 120 000,
  "totalRevenue": 200 000
}
```

### `GET /api/admin//revenues-expenditures`

Permet de récupérer les revenues et les dépenses totaux

#### Exemple de réponse

```json
{
  "totalExpenditure": 120 000,
  "totalRevenue": 200 000
}
```
### `GET /api/admin//revenues-expenditures`

Permet de récupérer les revenues et les dépenses totaux

#### Exemple de réponse

```json
{
  "totalExpenditure": 120 000,
  "totalRevenue": 200 000
}
```


## 🔐 Sécurité

* Authentification basée sur **JWT**
* Middleware de protection des routes sensibles
* Validation des données en entrée
* Hash des mots de passe

---

## 📦 Structure du projet

```
src/
 ├── controllers/
 ├── routes/
 ├── models/
 ├── middleware/
 ├── services/
 └── config/

server.js
package.json
```

---

## ⚙️ Installation

```bash
git clone <repository_url>
cd m1p13mean-Riantsoa-Tsaramirana
npm install
```

---

## ▶️ Lancement du serveur

```bash
npm run dev
```

ou

```bash
npm start
```

---

## 📌 Notes importantes

* Toutes les requêtes utilisent le format **application/json**
* Les routes protégées nécessitent un token JWT dans le header :

```
Authorization: Bearer <token>
```

* Les réponses suivent une structure standard :

```json
{
  "status": "success | error",
  "data": {},
  "message": "optional message"
}
```

---

## 🧑‍💻 Auteur

**Riantsoa Tsaramirana**
Projet académique – Master 1 – 2026

```
```
