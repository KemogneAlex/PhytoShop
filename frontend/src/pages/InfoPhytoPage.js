import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Shield, Leaf, Package } from 'lucide-react';

const InfoPhytoPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8" data-testid="info-title">
            Comprendre les Produits Phytosanitaires
          </h1>

          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="flex items-start space-x-3 mb-4">
                <Shield className="w-8 h-8 text-green-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold mb-3">Qu'est-ce qu'un produit phytosanitaire ?</h2>
                  <p className="text-gray-700 mb-4">
                    Les produits phytosanitaires sont des substances ou préparations utilisées pour <strong>protéger les cultures</strong> contre 
                    les nuisibles, maladies ou adventices, ou pour favoriser leur croissance. En France, ils sont strictement réglementés 
                    par l'ANSES (Agence nationale de sécurité sanitaire), avec des <strong>AMM (autorisations de mise sur le marché)</strong> obligatoires.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Package className="w-6 h-6 text-blue-600 mr-2" />
                  Catégories Principales
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Herbicides</strong> : Élimination des mauvaises herbes</li>
                  <li><strong>Fongicides</strong> : Lutte contre maladies fongiques</li>
                  <li><strong>Insecticides</strong> : Protection contre insectes nuisibles</li>
                  <li><strong>Molluscicides</strong> : Contre limaces et escargots</li>
                  <li><strong>Rodenticides</strong> : Lutte contre rongeurs</li>
                  <li><strong>Régulateurs</strong> : Contrôle de la croissance</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Leaf className="w-6 h-6 text-green-600 mr-2" />
                  Solutions de Biocontrôle
                </h3>
                <p className="text-gray-700 mb-3">
                  Alternatives biologiques et naturelles :
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>Pièges à phéromones</li>
                  <li>Micro-organismes (Bacillus thuringiensis)</li>
                  <li>Auxiliaires naturels (coccinelles, nématodes)</li>
                  <li>Extraits végétaux</li>
                  <li>Produits minéraux (soufre, cuivre)</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Intrants et Équipements Associés</h2>
              <p className="text-gray-700 mb-4">
                Notre plateforme propose également des produits essentiels pour l'agriculture moderne :
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Engrais et Amendements</h4>
                  <p className="text-gray-700">
                    Engrais minéraux (NPK, urée), organiques (fumiers, composts), amendements calcaires 
                    et engrais foliaires pour corriger les carences.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">Semences Certifiées</h4>
                  <p className="text-gray-700">
                    Semences conventionnelles et biologiques (céréales, maïs, colza), variétés hybrides 
                    et semences traitées pour une meilleure protection.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">Équipements de Protection (EPI)</h4>
                  <p className="text-gray-700">
                    Combinaisons, gants nitrile, masques respiratoires A2P3, bottes, lunettes et cagoules 
                    pour une manipulation sécurisée des produits phytosanitaires.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">Matériel d'Application</h4>
                  <p className="text-gray-700">
                    Pulvérisateurs (manuels, à dos, tractés), buses anti-dérive, cuves de mélange 
                    et systèmes d'épandage pour une application précise.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">Biostimulants</h4>
                  <p className="text-gray-700">
                    Extraits d'algues, acides humiques et autres solutions pour renforcer 
                    la résilience des plantes face au stress.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-8">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-8 h-8 text-orange-600 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-orange-900 mb-4">Utilisation Responsable</h2>
                  
                  <div className="space-y-3 text-gray-800">
                    <p><strong>Avant toute utilisation :</strong></p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Assurez-vous que l'utilisation est indispensable</li>
                      <li>Privilégiez les méthodes alternatives (biocontrôle, lutte intégrée)</li>
                      <li>Choisissez les produits présentant le risque le plus faible</li>
                      <li>Respectez scrupuleusement les doses prescrites</li>
                      <li>Portez les équipements de protection appropriés</li>
                      <li>Respectez les délais avant récolte et les zones non traitées (ZNT)</li>
                    </ul>

                    <p className="mt-4"><strong>Réglementation :</strong></p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Vente réservée aux personnes majeures (18+)</li>
                      <li>Certains produits nécessitent un certificat phytosanitaire (Certiphyto)</li>
                      <li>Respectez les conditions de stockage et d'élimination</li>
                      <li>Tenez un registre des traitements (obligatoire pour professionnels)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Normes et Certifications</h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-semibold text-lg mb-2">AMM (Autorisation de Mise sur le Marché)</h4>
                  <p>
                    Tous nos produits phytosanitaires disposent d'une AMM délivrée par l'ANSES. 
                    Le numéro AMM est affiché sur chaque fiche produit.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">Pictogrammes GHS</h4>
                  <p>
                    Les pictogrammes de danger (GHS) indiquent les risques associés au produit : 
                    toxicité, corrosion, danger pour l'environnement, etc.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">Certification Bio</h4>
                  <p>
                    Les produits utilisables en agriculture biologique sont clairement identifiés 
                    avec le badge "BIO" et respectent le cahier des charges européen.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">Normes EPI</h4>
                  <p>
                    Nos équipements de protection sont conformes aux normes CE (EN 374 pour gants, 
                    EN 13034 pour combinaisons, EN 143 pour masques).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InfoPhytoPage;
