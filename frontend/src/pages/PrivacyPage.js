import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8" data-testid="privacy-title">Politique de confidentialité</h1>

          <Card>
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                <p className="text-gray-700">
                  PhytoPro Shop attache une grande importance à la protection de vos données personnelles. 
                  Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations 
                  conformément au Règlement Général sur la Protection des Données (RGPD).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Données collectées</h2>
                <p className="text-gray-700 mb-3">
                  Nous collectons les données suivantes :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Données d'identification : nom, prénom, email</li>
                  <li>Données de connexion : adresse IP, logs de connexion</li>
                  <li>Données de commande : historique d'achats, adresses de livraison</li>
                  <li>Données professionnelles : numéro de certificat phytosanitaire (si applicable)</li>
                  <li>Données de paiement : gérées par notre prestataire Stripe (nous ne stockons pas vos données bancaires)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Finalités du traitement</h2>
                <p className="text-gray-700 mb-3">
                  Vos données sont utilisées pour :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>La gestion de votre compte client</li>
                  <li>Le traitement de vos commandes</li>
                  <li>La communication relative à nos produits et services</li>
                  <li>Le respect de nos obligations légales (traçabilité des ventes de produits phytosanitaires)</li>
                  <li>L'amélioration de nos services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Durée de conservation</h2>
                <p className="text-gray-700">
                  Vos données personnelles sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles sont traitées, 
                  dans le respect des obligations légales. Les données relatives aux commandes sont conservées pendant 10 ans 
                  conformément à la réglementation sur les produits phytosanitaires.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Vos droits</h2>
                <p className="text-gray-700 mb-3">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Droit d'accès à vos données personnelles</li>
                  <li>Droit de rectification de vos données</li>
                  <li>Droit à l'effacement de vos données</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit à la portabilité de vos données</li>
                  <li>Droit d'opposition au traitement</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  Pour exercer ces droits, contactez-nous à : dpo@phytopro-shop.fr
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Cookies</h2>
                <p className="text-gray-700 mb-3">
                  Notre site utilise des cookies pour améliorer votre expérience de navigation. 
                </p>
                <div className="space-y-3 text-gray-700">
                  <div>
                    <h4 className="font-semibold">Cookies essentiels</h4>
                    <p>Nécessaires au fonctionnement du site (authentification, panier, sécurité). Ces cookies ne peuvent pas être désactivés.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Cookies fonctionnels</h4>
                    <p>Permettent de mémoriser vos préférences (langue, affichage, etc.).</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Cookies analytiques</h4>
                    <p>Nous permettent de comprendre comment vous utilisez le site pour l'améliorer (anonymisés).</p>
                  </div>
                </div>
                <p className="text-gray-700 mt-3">
                  Vous pouvez gérer vos préférences de cookies à tout moment en cliquant sur 
                  {' '}<a href="#tarteaucitron" className="text-green-600 underline hover:text-green-700">Gérer mes cookies</a> 
                  {' '}en bas de page ou depuis les paramètres de votre navigateur.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Sécurité</h2>
                <p className="text-gray-700">
                  Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger vos données 
                  contre tout accès non autorisé, altération, divulgation ou destruction.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Partage des données</h2>
                <p className="text-gray-700">
                  Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées uniquement avec nos prestataires 
                  de services (hébergement, paiement, livraison) dans le cadre strict de l'exécution de nos services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Contact</h2>
                <p className="text-gray-700">
                  Pour toute question relative à cette politique de confidentialité, contactez notre Délégué à la Protection des Données :<br />
                  Email : dpo@phytopro-shop.fr<br />
                  Adresse : PhytoPro Shop - DPO, 123 Avenue de l'Agriculture, 75001 Paris, France
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
