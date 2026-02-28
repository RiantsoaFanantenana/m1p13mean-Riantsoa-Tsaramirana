# 📦 m1p13mean – Riantsoa Tsaramirana  
**Projet Final – Master 1 | Mars 2026**

---

## 📖 Présentation

API REST développée dans le cadre du projet final de Master 1.

Cette application permet :

- 🔐 L'authentification des clients  
- 🏪 L'enregistrement et la gestion des boutiques  
- ⚙️ La configuration initiale des shops  
- 💳 Le paiement des charges mensuelles  
- 🎟 La gestion des coupons  
- 📅 La création d'événements  
- 📊 Le suivi financier et contractuel  

L'API est conçue selon une architecture RESTful avec séparation claire des responsabilités (routes, contrôleurs, modèles, middleware).

---

## 🚀 Base URL

```
http://localhost:3000/api
```

---

# 🔐 Authentification

## `POST /api/auth/register`

Inscription d'un client.

### Body (JSON)

```json
{
  "email": "client@example.com",
  "password": "password123"
}
```

---

## `POST /api/auth/login`

Connexion d'un utilisateur.

### Body (JSON)

```json
{
  "email": "admin@mall.com",
  "password": "admin123"
}
```

### Réponse (exemple)

```json
{
  "status": "success",
  "token": "jwt_token_here"
}
```

---

# 🛠 Administration

## `POST /api/admin/register-shop`

Créer et enregistrer une nouvelle boutique.

### Body (JSON)

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

### Champs requis

* `shopName`
* `email`
* `shopType`
* `duration`
* `startDate`
* `boxId`

---

## `GET /api/admin/accept-payement/:payementId`

Permet à l'administrateur d'accepter un paiement effectué par un shop.

### Paramètre URL

* `payementId` : ID du paiement à valider

### Effets

* Change le statut du paiement (`review` → `accepted`)
* Met à jour les `MonthlyChargeStatus` correspondants

---

## `GET /api/admin/alert-contracts-ending-soon`

Retourne la liste des contrats arrivant bientôt à expiration.

### Query params (optionnel)

```
?daysBeforeEnd=7
```

### Réponse (exemple)

```json
[
  {
    "shop": {
      "shopName": "Tech Store",
      "box": "BOX-01"
    },
    "startDate": "2025-03-01",
    "duration": 12,
    "endDate": "2026-03-01"
  }
]
```

---

# 🏪 Gestion des Shops

## `PATCH /api/shop/configure`

Configuration initiale d'un shop après création.

### Body (JSON)

```json
{
  "user": "shop@example.com",
  "newPassword": "newStrongPassword",
  "logo": "logo_url_or_path",
  "coverPic": "cover_url_or_path",
  "description": "Description de la boutique"
}
```

---

## `POST /api/shop/log-unconfigured`

Permet de logger les boutiques non configurées.

### Réponse

```json
{
  "status": "success",
  "message": "Unconfigured shops logged successfully"
}
```

---

# 💳 Paiement des Charges

## `POST /api/shop/pay`

Permet à un shop d'effectuer un paiement pour une ou plusieurs périodes.

### Body (JSON)

```json
{
  "periods": [
    { "month": 2, "year": 2026 },
    { "month": 3, "year": 2026 }
  ],
  "chargesIds": [
    "charge_id_1",
    "charge_id_2"
  ]
}
```

### Logique métier

* Le montant (`amount`) est calculé automatiquement :

  * **Loyer** → `unit_price × superficie du box`
  * **Abonnement** → `unit_price × 1`
* Création automatique des `MonthlyChargeStatus` manquants
* Statut initial du paiement : `review`

---

# 🎟 Gestion des Coupons

## `POST /api/shop/create-coupon`

Permet à un shop de créer un coupon promotionnel.

### Body (JSON)

```json
{
  "title": "Promo Mars",
  "description": "Réduction spéciale",
  "discountPercentage": 20,
  "validUntil": "2026-03-31"
}
```

---

# 📅 Gestion des Événements

## `POST /api/shop/create-event`

Permet à un shop de créer un événement.

### Body (JSON)

```json
{
  "title": "Lancement Nouveau Produit",
  "description": "Présentation officielle",
  "eventDate": "2026-04-15",
  "location": "Mall Central"
}
```

---

# 🌐 Routes Générales

> Toutes ces routes nécessitent une authentification (`Authorization: Bearer <token>`).

## `GET /api/shops/search`

Rechercher des boutiques.

### Query params (exemple)

```
?q=tech&type=electronics
```

---

## `GET /api/shops/:shopId`

Récupérer le profil d'une boutique.

### Paramètre URL

* `shopId` : ID de la boutique

---

## `GET /api/shops/group/:groupName`

Récupérer les boutiques appartenant à un groupe.

### Paramètre URL

* `groupName` : Nom du groupe

---

## `GET /api/events`

Récupérer tous les événements.

---

## `GET /api/shops/:shopId/reviews`

Récupérer les avis d'une boutique.

### Paramètre URL

* `shopId` : ID de la boutique

---

## `GET /api/shops/:shopId/events`

Récupérer les événements d'une boutique.

### Paramètre URL

* `shopId` : ID de la boutique

---

# 👤 Routes Client

> Toutes ces routes nécessitent une authentification et le rôle `client`.

## `GET /api/client/redeem-coupon/:shopId/:code`

Utiliser un coupon promotionnel.

### Paramètres URL

* `shopId` : ID de la boutique
* `code` : Code du coupon

---

## `GET /api/client/wallet`

Consulter le portefeuille du client connecté.

---

## `POST /api/client/post-review/:shopId`

Publier un avis sur une boutique.

### Paramètre URL

* `shopId` : ID de la boutique

### Body (JSON)

```json
{
  "rating": 4,
  "comment": "Très bonne boutique !"
}
```

---

## `GET /api/client/get-favorites`

Récupérer la liste des boutiques favorites du client.

---

## `POST /api/client/add-shop-favorite/:shopId`

Ajouter une boutique aux favoris.

### Paramètre URL

* `shopId` : ID de la boutique à ajouter aux favoris

---

# ⚙️ Configuration

> Route accessible aux rôles `admin`, `shop` et `customer`. Nécessite une authentification.

## `GET /api/configurations/:tableName`

Récupérer les données d'une table de configuration.

### Paramètre URL

* `tableName` : Nom de la table de configuration à consulter

### Réponse (exemple)

```json
{
  "status": "success",
  "data": { }
}
```

---

# 📊 Dashboard Administrateur

## `GET /api/admin/revenues-expenditures`

Retourne les revenus et dépenses totaux.

```json
{
  "totalExpenditure": 120000,
  "totalRevenue": 200000
}
```

---

## `GET /api/admin/revenues-details`

Revenus groupés par catégorie.

```json
[
  {
    "_id": "Loyer",
    "totalAmount": 1500000
  }
]
```

---

## `GET /api/admin/expenditures-details`

Dépenses groupées par catégorie.

```json
[
  {
    "_id": "Réparation",
    "totalAmount": 1500000
  }
]
```

---

# 🔐 Sécurité

* Authentification basée sur **JWT**
* Middleware de protection des routes sensibles
* Validation des données
* Hash des mots de passe
* Séparation des rôles (Admin / Shop / Client)

---

# 📦 Structure du projet

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

# ⚙️ Installation

```bash
git clone <repository_url>
cd m1p13mean-Riantsoa-Tsaramirana
npm install
```

---

# ▶️ Lancement

```bash
npm run dev
```

ou

```bash
npm start
```

---

# 📌 Format des réponses

Toutes les réponses suivent la structure :

```json
{
  "status": "success | error",
  "data": {},
  "message": "optional message"
}
```

Routes protégées :

```
Authorization: Bearer <token>
```

---

## 🧑‍💻 Auteur

**Riantsoa Tsaramirana**
Projet académique – Master 1 – 2026