# PhytoPro Shop - Site E-commerce Phytosanitaire

Site e-commerce professionnel complet pour la vente de produits phytosanitaires (pesticides, herbicides, fongicides, engrais, biocontrôle) conforme aux réglementations françaises et européennes.

## 🌟 Fonctionnalités

### Frontend (React)
- **Page d'accueil** : Hero banner, catégories, produits phares, sections de confiance
- **Catalogue produits** : Filtrage avancé (catégorie, prix, bio, recherche), pagination
- **Détail produit** : Images multiples, informations AMM, pictogrammes GHS, avis clients, vérification d'âge
- **Panier** : Gestion quantités, calcul automatique, persistance utilisateur
- **Checkout** : Formulaire livraison, paiement sécurisé Stripe
- **Authentification** : Login classique (JWT) + Google OAuth (Emergent)
- **Compte utilisateur** : Dashboard, historique commandes, profil professionnel
- **Pages légales** : Mentions légales, CGV, Politique RGPD
- **Blog** : Articles et actualités du secteur
- **Contact** : Formulaire de contact

### Backend (FastAPI + MongoDB)
- **API RESTful complète** avec documentation auto-générée
- **Authentification hybride** : JWT classique + Google OAuth (Emergent)
- **Gestion produits** : CRUD complet, filtrage, recherche
- **Panier utilisateur** : Persistance en base de données
- **Commandes** : Création, suivi, historique
- **Paiement Stripe** : Intégration via emergentintegrations
- **Reviews** : Système d'avis produits avec notation
- **Sécurité** : Validation des données, gestion des sessions

### Base de données (MongoDB)
- **Collections** : users, user_sessions, products, categories, cart_items, orders, payment_transactions, reviews
- **20 produits** pré-chargés avec données réalistes
- **5 catégories** : Herbicides, Insecticides, Fongicides, Engrais, Biocontrôle
