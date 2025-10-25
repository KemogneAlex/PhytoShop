import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const CGVPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8" data-testid="cgv-title">Conditions Générales de Vente</h1>

          <Card>
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-bold mb-4">Article 1 - Objet</h2>
                <p className="text-gray-700">
                  Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits phytosanitaires 
                  réalisées par PhytoPro Shop sur son site internet phytopro-shop.fr.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Article 2 - Prix</h2>
                <p className="text-gray-700">
                  Les prix de nos produits sont indiqués en euros toutes taxes comprises (TTC). 
                  PhytoPro Shop se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix figurant au catalogue 
                  le jour de la commande sera le seul applicable à l'acheteur.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Article 3 - Commandes</h2>
                <p className="text-gray-700">
                  Toute commande implique l'acceptation sans réserve des présentes CGV. 
                  Le client reconnaît avoir pris connaissance, au moment de la passation de sa commande, 
                  des présentes CGV et déclare expressément les accepter sans réserve.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Article 4 - Paiement</h2>
                <p className="text-gray-700">
                  Le paiement est exigible immédiatement à la commande. Il s'effectue par carte bancaire ou virement bancaire 
                  via notre prestataire de paiement sécurisé Stripe. La commande ne sera validée qu'après encaissement effectif du prix.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Article 5 - Livraison</h2>
                <p className="text-gray-700">
                  Les livraisons sont effectuées à l'adresse indiquée par le client lors de la commande. 
                  Les délais de livraison sont de 3 à 5 jours ouvrés à compter de la validation de la commande. 
                  En cas de retard de livraison supérieur à 7 jours, le client peut demander l'annulation de sa commande.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Article 6 - Droit de rétractation</h2>
                <p className="text-gray-700">
                  <strong>IMPORTANT :</strong> Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation 
                  ne peut être exercé pour les biens susceptibles de se détériorer ou de se périmer rapidement. 
                  En raison de la nature spécifique des produits phytosanitaires et des règles de sécurité qui leur sont applicables, 
                  aucun droit de rétractation ne pourra être exercé sauf en cas de produit défectueux ou non conforme.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Article 7 - Garantie</h2>
                <p className="text-gray-700">
                  Tous nos produits bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés, 
                  conformément aux articles 1641 et suivants et 2232 et suivants du Code Civil.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Article 8 - Responsabilité</h2>
                <p className="text-gray-700">
                  PhytoPro Shop ne saurait être tenu responsable d'une mauvaise utilisation des produits vendus. 
                  Il appartient à l'acheteur de respecter scrupuleusement les conditions d'emploi, dosages et précautions d'usage 
                  mentionnés sur les étiquettes et fiches de données de sécurité des produits.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Article 9 - Litiges</h2>
                <p className="text-gray-700">
                  Les présentes CGV sont soumises au droit français. 
                  En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. 
                  À défaut d'accord amiable, le litige sera porté devant les tribunaux français compétents.
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

export default CGVPage;
