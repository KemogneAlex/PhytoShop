# 📘 Guide MongoDB Atlas pour PhytoPro Shop

## ❌ Problème actuel

L'environnement Kubernetes d'Emergent a des restrictions SSL/TLS qui empêchent la connexion directe à MongoDB Atlas.

**Erreur rencontrée :**
```
SSL handshake failed: [SSL: TLSV1_ALERT_INTERNAL_ERROR] tlsv1 alert internal error
```

## ✅ Solutions

### Solution 1 : MongoDB Local (Actuelle)

**Avantages :**
- ✅ Fonctionne parfaitement
- ✅ Pas de configuration nécessaire
- ✅ Idéal pour développement et tests
- ✅ Données persistantes dans le conteneur

**Inconvénients :**
- ❌ Données locales au conteneur (perdues si redéploiement)
- ❌ Pas d'accès externe

**Configuration actuelle :**
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
```

### Solution 2 : MongoDB Atlas (Pour production)

#### Option A : Utiliser un proxy SSL

Créer un tunnel ou proxy SSL externe qui gère la connexion Atlas.

#### Option B : Exporter/Importer les données

1. **Exporter depuis MongoDB local :**
```bash
# Sur votre machine Emergent
mongodump --db=test_database --out=/tmp/phyto_backup

# Télécharger les fichiers
```

2. **Importer vers MongoDB Atlas :**
```bash
# Sur votre machine locale avec mongorestore installé
mongorestore --uri="mongodb+srv://phytoShop:Jesuiskira%40123@cluster0.lgftyzx.mongodb.net/phytoShop" \
  /chemin/vers/phyto_backup/test_database
```

#### Option C : Utiliser MongoDB Atlas depuis votre machine locale

Vous pouvez développer localement avec votre MongoDB Atlas :

**1. Installer Node.js et Python localement**

**2. Configurer .env :**
```env
MONGO_URL="mongodb+srv://phytoShop:Jesuiskira%40123@cluster0.lgftyzx.mongodb.net/?retryWrites=true&w=majority"
DB_NAME="phytoShop"
```

**3. Lancer le backend localement :**
```bash
cd backend
pip install -r requirements.txt
python seed_data.py  # Charger les données
uvicorn server:app --reload
```

**4. Lancer le frontend localement :**
```bash
cd frontend
yarn install
yarn start
```

### Solution 3 : Déploiement Production

Pour déployer en production avec MongoDB Atlas, utilisez un service qui supporte les connexions SSL natives comme :
- Vercel
- Netlify
- Heroku
- AWS EC2
- DigitalOcean
- Railway.app

## 🔄 Migration des données

### Script de migration MongoDB Local → Atlas

```python
# migration_to_atlas.py
import pymongo
from pymongo import MongoClient
import urllib.parse

# Source (MongoDB local)
source_client = MongoClient("mongodb://localhost:27017")
source_db = source_client["test_database"]

# Destination (MongoDB Atlas)
password = urllib.parse.quote_plus("Jesuiskira@123")
atlas_uri = f"mongodb+srv://phytoShop:{password}@cluster0.lgftyzx.mongodb.net/"
dest_client = MongoClient(atlas_uri)
dest_db = dest_client["phytoShop"]

# Collections à migrer
collections = ["products", "categories", "users", "orders", "reviews", "cart_items", "payment_transactions", "user_sessions"]

for coll_name in collections:
    print(f"Migration de {coll_name}...")
    
    # Copier tous les documents
    docs = list(source_db[coll_name].find())
    if docs:
        dest_db[coll_name].delete_many({})  # Nettoyer d'abord
        dest_db[coll_name].insert_many(docs)
        print(f"  ✅ {len(docs)} documents migrés")
    else:
        print(f"  ℹ️  Collection vide")

print("\n✅ Migration terminée !")
```

### Exécuter depuis votre machine locale

```bash
# Installer pymongo
pip install pymongo[srv]

# Exécuter le script
python migration_to_atlas.py
```

## 📊 État actuel de votre projet

**Configuration actuelle :**
- ✅ MongoDB Local fonctionnel
- ✅ 20 produits chargés
- ✅ 5 catégories
- ✅ Utilisateur demo créé
- ✅ Backend et Frontend opérationnels

**Données actuelles :**
```bash
# Voir les stats
mongosh test_database --eval "
  print('Produits:', db.products.countDocuments());
  print('Catégories:', db.categories.countDocuments());
  print('Utilisateurs:', db.users.countDocuments());
"
```

## 🎯 Recommandation

**Pour développement/test :** Continuez avec MongoDB local (configuration actuelle)
**Pour production :** Déployez sur une plateforme supportant MongoDB Atlas

## 🔑 Vos credentials Atlas

```
URL: mongodb+srv://cluster0.lgftyzx.mongodb.net
Username: phytoShop
Password: Jesuiskira@123
Database: phytoShop
```

## 📞 Support MongoDB Atlas

Si vous voulez absolument utiliser Atlas maintenant :
1. Contactez le support Emergent pour les restrictions SSL
2. Ou utilisez la méthode d'export/import ci-dessus
3. Ou développez localement avec Atlas

---

**Note :** Le site fonctionne parfaitement avec MongoDB local. Vous pouvez développer et tester sans problème !
