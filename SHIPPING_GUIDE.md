# 🚚 Guide Frais de Livraison - PhytoPro Shop

## Configuration

### Paramètres actuels

Configurés dans `/app/backend/.env` :

```env
SHIPPING_COST=9.90              # Frais de livraison standard
FREE_SHIPPING_THRESHOLD=150.00   # Seuil livraison gratuite
```

### Règles de calcul

- **Sous-total < 150 €** : Frais de livraison = **9.90 €**
- **Sous-total ≥ 150 €** : Livraison **GRATUITE** 🎉

## Fonctionnalités Implémentées

### ✅ Backend (FastAPI)

**Fichier modifié :** `/app/backend/server.py`

#### 1. Configuration chargée depuis .env

```python
SHIPPING_COST = float(os.environ.get('SHIPPING_COST', '9.90'))
FREE_SHIPPING_THRESHOLD = float(os.environ.get('FREE_SHIPPING_THRESHOLD', '150.00'))
```

#### 2. Fonction de calcul

```python
def calculate_shipping(subtotal: float) -> float:
    """Calculate shipping cost based on subtotal"""
    if subtotal >= FREE_SHIPPING_THRESHOLD:
        return 0.0
    return SHIPPING_COST
```

#### 3. Nouvelle route API

```
GET /api/shipping/calculate?subtotal=100.50
```

**Réponse :**
```json
{
  "shipping_cost": 9.90,
  "free_shipping_threshold": 150.00,
  "is_free": false,
  "amount_for_free_shipping": 49.50
}
```

#### 4. Modèle Order enrichi

```python
class Order(BaseModel):
    subtotal: float          # Sous-total produits uniquement
    shipping_cost: float     # Frais de livraison calculés
    total_amount: float      # Total = subtotal + shipping_cost
    # ... autres champs
```

#### 5. Création de commande mise à jour

- Calcul du sous-total des produits
- Calcul automatique des frais de livraison
- Envoi du montant total à Stripe (incluant livraison)

### ✅ Frontend (React)

**Fichiers modifiés :**
- `/app/frontend/src/pages/CartPage.js`
- `/app/frontend/src/pages/CheckoutPage.js`

#### 1. Affichage dynamique dans le panier

```jsx
<div className="flex justify-between text-gray-600">
  <span>Sous-total</span>
  <span>{subtotal.toFixed(2)} €</span>
</div>
<div className="flex justify-between text-gray-600">
  <span>Livraison</span>
  <span>
    {shippingInfo.is_free ? (
      <span className="text-green-600 font-semibold">GRATUITE</span>
    ) : (
      `${shippingInfo.shipping_cost.toFixed(2)} €`
    )}
  </span>
</div>
```

#### 2. Message incitatif

Si le client est proche du seuil de livraison gratuite :

```
🎁 Ajoutez 49.50 € pour bénéficier de la livraison gratuite !
```

#### 3. Badge de félicitations

Quand la livraison est gratuite :

```
🎉 Vous bénéficiez de la livraison gratuite !
```

## Test Complet

### Scénario 1 : Sous-total < 150 €

**Exemple : Panier à 89.90 €**

```
Sous-total:     89.90 €
Livraison:       9.90 €
───────────────────────
Total:          99.80 €

💡 Message: "Ajoutez 60.10 € pour la livraison gratuite !"
```

### Scénario 2 : Sous-total ≥ 150 €

**Exemple : Panier à 291.10 €** (comme dans la capture d'écran)

```
Sous-total:    291.10 €
Livraison:     GRATUITE 🎉
───────────────────────
Total:         291.10 €
```

### Test via API

```bash
# Panier < seuil
curl "https://agrochem-store.preview.emergentagent.com/api/shipping/calculate?subtotal=89.90"

# Réponse:
{
  "shipping_cost": 9.90,
  "free_shipping_threshold": 150.00,
  "is_free": false,
  "amount_for_free_shipping": 60.10
}

# Panier ≥ seuil
curl "https://agrochem-store.preview.emergentagent.com/api/shipping/calculate?subtotal=200.00"

# Réponse:
{
  "shipping_cost": 0.00,
  "free_shipping_threshold": 150.00,
  "is_free": true,
  "amount_for_free_shipping": 0
}
```

## Personnalisation

### Modifier les frais de livraison

Éditez `/app/backend/.env` :

```env
# Augmenter les frais de livraison
SHIPPING_COST=14.90

# Modifier le seuil de livraison gratuite
FREE_SHIPPING_THRESHOLD=200.00
```

Puis redémarrez le backend :

```bash
sudo supervisorctl restart backend
```

### Livraison toujours gratuite

```env
SHIPPING_COST=0.00
FREE_SHIPPING_THRESHOLD=0.00
```

### Désactiver la livraison gratuite

Mettez un seuil très élevé :

```env
FREE_SHIPPING_THRESHOLD=999999.00
```

## Logique Métier

### Avantages pour le site

1. **Augmentation du panier moyen** : Les clients ajoutent des produits pour atteindre le seuil
2. **Transparence** : Affichage clair des frais dès le panier
3. **Motivation** : Message incitatif visible
4. **Conformité** : Respect des obligations légales d'affichage des frais

### Expérience utilisateur

- ✅ Calcul automatique en temps réel
- ✅ Message encourageant à ajouter des produits
- ✅ Badge visuel quand livraison gratuite obtenue
- ✅ Affichage cohérent panier → checkout → confirmation

## Intégration Stripe

Le montant total envoyé à Stripe inclut automatiquement les frais de livraison.

**Exemple de transaction Stripe :**

```python
checkout_request = CheckoutSessionRequest(
    amount=float(total_amount),  # 99.80 € (89.90 + 9.90)
    currency="eur",
    # ...
)
```

## Base de Données

Les commandes stockent maintenant 3 montants distincts :

```json
{
  "subtotal": 89.90,
  "shipping_cost": 9.90,
  "total_amount": 99.80,
  "items": [...]
}
```

### Requête MongoDB pour analyser les livraisons

```javascript
// Commandes avec livraison gratuite
db.orders.find({ shipping_cost: 0 }).count()

// Montant moyen des frais de livraison
db.orders.aggregate([
  { $group: { _id: null, avg_shipping: { $avg: "$shipping_cost" } } }
])

// Commandes par type de livraison
db.orders.aggregate([
  { $group: { 
      _id: { $cond: [{ $eq: ["$shipping_cost", 0] }, "Gratuite", "Payante"] },
      count: { $sum: 1 }
  }}
])
```

## Évolutions Futures Possibles

### 1. Livraison selon la zone géographique

```python
def calculate_shipping(subtotal: float, country: str) -> float:
    if subtotal >= FREE_SHIPPING_THRESHOLD:
        return 0.0
    
    shipping_rates = {
        "France": 9.90,
        "Belgique": 12.90,
        "Suisse": 19.90
    }
    return shipping_rates.get(country, 9.90)
```

### 2. Livraison express (option payante)

```python
def calculate_shipping(subtotal: float, express: bool = False) -> float:
    base_cost = SHIPPING_COST if subtotal < FREE_SHIPPING_THRESHOLD else 0.0
    
    if express:
        return base_cost + 15.00  # +15€ pour express
    
    return base_cost
```

### 3. Livraison selon le poids

```python
def calculate_shipping(subtotal: float, total_weight: float) -> float:
    if subtotal >= FREE_SHIPPING_THRESHOLD:
        return 0.0
    
    if total_weight <= 5:  # kg
        return 9.90
    elif total_weight <= 15:
        return 14.90
    else:
        return 19.90
```

## Support et Documentation

### Variables d'environnement

| Variable | Description | Défaut | Type |
|----------|-------------|--------|------|
| `SHIPPING_COST` | Frais de livraison standard | 9.90 | float |
| `FREE_SHIPPING_THRESHOLD` | Seuil livraison gratuite | 150.00 | float |

### Endpoints API

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/shipping/calculate?subtotal=X` | Calcule les frais de livraison |
| POST | `/api/checkout/create-order` | Crée une commande (avec frais inclus) |

## ✅ Résumé

**PhytoPro Shop dispose maintenant de :**
- ✅ Frais de livraison configurables (9.90 € par défaut)
- ✅ Livraison gratuite à partir de 150 €
- ✅ Calcul automatique en temps réel
- ✅ Affichage clair dans panier et checkout
- ✅ Messages incitatifs pour augmenter le panier
- ✅ Intégration complète avec Stripe
- ✅ Données structurées en base de données

**Testez maintenant :**
1. Ajoutez des produits pour moins de 150 € → Frais de 9.90 €
2. Ajoutez plus de produits → Message "Ajoutez X € pour livraison gratuite"
3. Dépassez 150 € → Badge "GRATUITE" 🎉

URL : https://agrochem-store.preview.emergentagent.com
