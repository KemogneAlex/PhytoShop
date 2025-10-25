import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const LegalPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8" data-testid="legal-title">Mentions légales</h1>

          <Card>
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-bold mb-4">Éditeur du site</h2>
                <p className="text-gray-700">
                  PhytoPro Shop<br />
                  Société par actions simplifiée<br />
                  Capital social : 100 000 €<br />
                  RCS Paris 123 456 789<br />
                  Siège social : 123 Avenue de l'Agriculture, 75001 Paris, France<br />
                  Téléphone : +33 1 23 45 67 89<br />
                  Email : contact@phytopro-shop.fr
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Directeur de publication</h2>
                <p className="text-gray-700">
                  M. Pierre MARTIN<br />
                  Directeur Général
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Hébergement</h2>
                <p className="text-gray-700">
                  Le site est hébergé par :<br />
                  Emergent Agent<br />
                  https://emergent.sh
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Numéro d'agrément</h2>
                <p className="text-gray-700">
                  N° agrément distribution produits phytosanitaires : AGR-2024-FR-001<br />
                  Délivré par le Ministère de l'Agriculture et de l'Alimentation
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Propriété intellectuelle</h2>
                <p className="text-gray-700">
                  L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
                  Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Avertissements produits phytosanitaires</h2>
                <p className="text-gray-700">
                  Les produits phytosanitaires proposés à la vente sont soumis à réglementation. Leur achat et utilisation sont strictement encadrés par la loi.<br /><br />
                  <strong>Avant toute utilisation :</strong><br />
                  - Assurez-vous que celle-ci est indispensable<br />
                  - Privilégiez les méthodes alternatives et les produits présentant le risque le plus faible<br />
                  - Respectez scrupuleusement les conditions d'emploi et doses prescrites<br />
                  - Portez les équipements de protection individuelle appropriés<br /><br />
                  La vente de certains produits est réservée aux détenteurs d'un certificat phytosanitaire en cours de validité.
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

export default LegalPage;
