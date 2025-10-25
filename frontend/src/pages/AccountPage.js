import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/App';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Package, Mail, Shield, LogOut } from 'lucide-react';

const AccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8" data-testid="account-title">Mon compte</h1>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    {user?.picture ? (
                      <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-full" />
                    ) : (
                      <User className="w-8 h-8 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-lg" data-testid="user-name">{user?.name}</p>
                    <p className="text-sm text-gray-600" data-testid="user-email">{user?.email}</p>
                  </div>
                </div>

                {user?.is_professional && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-blue-900">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Compte professionnel</span>
                    </div>
                    {user.certificate_number && (
                      <p className="text-xs text-blue-700 mt-1">
                        Certificat: {user.certificate_number}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 border-red-200"
                  onClick={logout}
                  data-testid="logout-button"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-6">
              <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/compte/commandes')} data-testid="orders-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Mes commandes</h3>
                      <p className="text-gray-600 text-sm">Suivez vos commandes et votre historique d'achats</p>
                    </div>
                    <Button variant="ghost">Voir</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/contact')} data-testid="contact-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Support client</h3>
                      <p className="text-gray-600 text-sm">Besoin d'aide ? Contactez notre équipe</p>
                    </div>
                    <Button variant="ghost">Contacter</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccountPage;
