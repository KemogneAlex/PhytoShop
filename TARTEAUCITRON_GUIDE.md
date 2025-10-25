# 🍪 Guide Tarteaucitron.js - Gestion des Cookies RGPD

## Installation & Configuration

Tarteaucitron.js est maintenant installé et configuré sur PhytoPro Shop pour une conformité RGPD complète.

### ✅ Ce qui est déjà configuré

1. **Bannière de consentement** : Apparaît automatiquement à la première visite
2. **Icône flottante** : En bas à droite pour gérer les préférences
3. **Lien footer** : "Gérer mes cookies" dans le pied de page
4. **Mode haute confidentialité** : Les services sont désactivés par défaut
5. **Boutons** : "Tout accepter", "Tout refuser" et choix granulaires

### 📁 Fichiers créés

```
/app/frontend/src/hooks/useTarteaucitron.js  # Hook React
/app/frontend/public/tarteaucitron/          # Fichiers Tarteaucitron
```

### 🎨 Configuration actuelle

Le fichier `/app/frontend/src/hooks/useTarteaucitron.js` contient la configuration :

```javascript
window.tarteaucitron.init({
  "privacyUrl": "/confidentialite",      // URL politique confidentialité
  "hashtag": "#tarteaucitron",           // Ouvrir avec ce hashtag
  "orientation": "middle",               // Position bannière
  "serviceDefaultState": "wait",         // En attente par défaut
  "showIcon": true,                      // Icône en bas à droite
  "iconPosition": "BottomRight",         // Position icône
  "DenyAllCta": true,                    // Bouton "Tout refuser"
  "AcceptAllCta": true,                  // Bouton "Tout accepter"
  "highPrivacy": true,                   // Mode haute confidentialité
  "googleConsentMode": true              // Mode consentement Google
});
```

## 🔧 Ajouter des Services

### Google Analytics

Décommentez dans `/app/frontend/src/hooks/useTarteaucitron.js` :

```javascript
// Après window.tarteaucitron.init()
(tarteaucitron.job = tarteaucitron.job || []).push('gtag');
window.tarteaucitronForceLanguage = 'fr';
```

Puis dans votre HTML (public/index.html) :

```html
<!-- Google Analytics -->
<script type="text/plain" data-type="application/javascript" data-name="gtag">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-VOTRE-ID-GA');
</script>
```

### Facebook Pixel

```javascript
(tarteaucitron.job = tarteaucitron.job || []).push('facebookpixel');
```

HTML :

```html
<script type="text/plain" data-type="application/javascript" data-name="facebookpixel">
  fbq('init', 'VOTRE_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

### Google Ads

```javascript
(tarteaucitron.job = tarteaucitron.job || []).push('googleads');
```

### Services disponibles

Liste complète : https://opt-out.ferank.eu/fr/install/

- Google Analytics (gtag, ga)
- Facebook Pixel
- Google Ads
- LinkedIn Insights
- Twitter
- YouTube
- Google Maps
- Hotjar
- Matomo
- Et 100+ autres services

## 🎨 Personnalisation CSS

Les fichiers CSS sont dans `/app/frontend/public/tarteaucitron/css/`

Pour personnaliser l'apparence :

1. **Créer un CSS personnalisé** :

```css
/* public/custom-tarteaucitron.css */

/* Changer les couleurs */
#tarteaucitronAlertBig {
  background: #16a34a !important; /* Vert PhytoPro */
}

#tarteaucitronAlertBig #tarteaucitronPersonalize {
  background: #0284c7 !important; /* Bleu PhytoPro */
}

/* Modifier l'icône */
#tarteaucitronIcon {
  background: #16a34a !important;
  border: 2px solid #fff !important;
}
```

2. **Importer dans App.css** :

```css
@import url('/custom-tarteaucitron.css');
```

## 📊 Tester le Consentement

### En tant qu'utilisateur

1. Allez sur https://agrochem-store.preview.emergentagent.com
2. La bannière de cookies s'affiche
3. Testez les boutons :
   - "Tout accepter" → Tous les cookies autorisés
   - "Tout refuser" → Tous les cookies bloqués
   - "Personnaliser" → Choix granulaires
4. L'icône en bas à droite permet de rouvrir le panneau

### En tant que développeur

```javascript
// Vérifier l'état des cookies dans la console
console.log(tarteaucitron.state);

// Forcer l'ouverture du panneau
window.location.hash = '#tarteaucitron';

// Réinitialiser les préférences
tarteaucitron.userInterface.respondAll(false);

// Vérifier si un service est autorisé
console.log(tarteaucitron.state['gtag']); // true/false/wait
```

## 🔒 Cookies Actuels du Site

### Cookies Essentiels (Non désactivables)

- **session_token** : Authentification utilisateur (7 jours)
- **tarteaucitron** : Préférences cookies Tarteaucitron

### Cookies Fonctionnels

- Aucun pour le moment

### Cookies Analytiques

- À configurer si vous ajoutez Google Analytics

## 🌍 Langues

Par défaut en français. Pour changer :

```javascript
window.tarteaucitronForceLanguage = 'en'; // Anglais
```

Langues disponibles dans `/app/frontend/public/tarteaucitron/lang/` :
- fr (Français)
- en (English)
- es (Español)
- de (Deutsch)
- etc.

## ⚙️ Options Avancées

### Désactiver l'icône flottante

```javascript
"showIcon": false
```

### Changer la position de la bannière

```javascript
"orientation": "top"    // Haut
"orientation": "bottom" // Bas (par défaut)
"orientation": "middle" // Centre (actuel)
```

### Mode consentement obligatoire

```javascript
"mandatory": true,      // L'utilisateur DOIT choisir
"mandatoryCta": true
```

### Fermeture automatique

```javascript
"closePopup": true  // Ferme au clic en dehors
```

## 📱 Responsive

Tarteaucitron est automatiquement responsive. Sur mobile :
- La bannière s'adapte à la largeur
- L'icône reste accessible
- Le panneau de paramètres est scrollable

## 🧪 Debug

Activer le mode debug :

```javascript
window.tarteaucitron.debug = true;
```

Vérifier les services chargés :

```javascript
console.log(tarteaucitron.job);
console.log(tarteaucitron.services);
```

## 📄 Conformité RGPD

✅ **Ce qui est conforme :**
- Consentement explicite avant activation
- Choix granulaires par service
- Possibilité de tout refuser
- Réouverture du panneau à tout moment
- Information claire sur les cookies
- Lien vers politique de confidentialité

✅ **À compléter pour production :**
- Détailler chaque cookie dans `/confidentialite`
- Mentionner durée de conservation
- Indiquer les destinataires des données
- Ajouter contact DPO si applicable

## 🚀 Déploiement

En production, vérifiez :

1. ✅ URL de confidentialité correcte
2. ✅ Services configurés (GA, FB, etc.)
3. ✅ Langues nécessaires
4. ✅ CSS personnalisé si besoin
5. ✅ Tests sur tous navigateurs

## 📞 Support

- Documentation officielle : https://tarteaucitron.io/fr/
- GitHub : https://github.com/AmauriC/tarteaucitron.js
- Démo interactive : https://opt-out.ferank.eu/fr/

## ✨ Résumé

**PhytoPro Shop dispose maintenant de :**
- ✅ Bannière de consentement RGPD
- ✅ Gestion granulaire des cookies
- ✅ Icône permanente de gestion
- ✅ Lien footer "Gérer mes cookies"
- ✅ Mode haute confidentialité activé
- ✅ Interface en français
- ✅ Conforme RGPD

**Prêt à l'emploi !** 🎉
