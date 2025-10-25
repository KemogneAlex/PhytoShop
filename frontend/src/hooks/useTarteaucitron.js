import { useEffect } from 'react';

// Hook personnalisé pour initialiser Tarteaucitron
const useTarteaucitron = () => {
  useEffect(() => {
    // Charger le script tarteaucitron
    const script = document.createElement('script');
    script.src = '/tarteaucitron/tarteaucitron.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // Configuration de tarteaucitron
      window.tarteaucitron.init({
        "privacyUrl": "/confidentialite", /* URL de la politique de confidentialité */
        "bodyPosition": "bottom", /* Position de la bannière (bottom ou top) */
        
        "hashtag": "#tarteaucitron", /* Ouvrir le panneau avec ce hashtag */
        "cookieName": "tarteaucitron", /* Nom du cookie */
        
        "orientation": "middle", /* Position de la bannière (middle, top, bottom) */
        
        "groupServices": false, /* Grouper les services par catégorie */
        "showDetailsOnClick": true, /* Afficher les détails au clic */
        "serviceDefaultState": "wait", /* État par défaut (true = accepté, false = refusé, wait = en attente) */
        
        "showAlertSmall": false, /* Afficher le petit bandeau en bas */
        "cookieslist": true, /* Afficher la liste des cookies */
        
        "closePopup": false, /* Fermer la popup au clic en dehors */
        
        "showIcon": true, /* Afficher l'icône tarteaucitron en bas à droite */
        
        "iconPosition": "BottomRight", /* Position de l'icône (BottomRight, BottomLeft, TopRight, TopLeft) */
        
        "adblocker": false, /* Afficher un message si un adblocker est détecté */
        
        "DenyAllCta": true, /* Afficher le bouton "Tout refuser" */
        "AcceptAllCta": true, /* Afficher le bouton "Tout accepter" */
        "highPrivacy": true, /* Désactiver le consentement automatique */
        
        "handleBrowserDNTRequest": false, /* Prendre en compte le Do Not Track du navigateur */
        
        "removeCredit": false, /* Retirer le crédit tarteaucitron */
        "moreInfoLink": true, /* Afficher le lien "Plus d'infos" */
        
        "useExternalCss": false, /* Utiliser un CSS externe */
        "useExternalJs": false, /* Utiliser un JS externe */
        
        "readmoreLink": "/cgv", /* Lien vers les CGV */
        
        "mandatory": false, /* Afficher un message pour les cookies obligatoires */
        
        "mandatoryCta": true, /* CTA visuel pour cookies essentiels */
        
        "customCloserId": "", /* ID du bouton de fermeture personnalisé */
        
        "googleConsentMode": true, /* Activer le mode consentement Google */
        
        "partnersList": false /* Afficher la liste des partenaires */
      });

      // Services à ajouter
      // Exemple : Google Analytics (décommenter si besoin)
      /*
      (tarteaucitron.job = tarteaucitron.job || []).push('gtag');
      window.tarteaucitronForceLanguage = 'fr';
      */
      
      // Vous pouvez ajouter d'autres services ici
      // Liste complète : https://opt-out.ferank.eu/fr/install/
    };

    return () => {
      // Nettoyage
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);
};

export default useTarteaucitron;
