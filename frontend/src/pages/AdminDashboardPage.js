import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/App';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Users, ShoppingBag, DollarSign, Plus } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.is_admin) {
      toast.error('Accès réservé aux administrateurs');
      navigate('/');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/admin/stats`, { withCredentials: true });
      setStats(response.data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      toast.error('Erreur de chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="spinner"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900" data-testid="admin-title">
              Panneau d'Administration
            </h1>
            <Button
              onClick={() => navigate('/admin/products')}
              className="bg-green-600 hover:bg-green-700"
              data-testid="manage-products-button"
            >
              <Package className="w-5 h-5 mr-2" />
              Gérer les produits
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Produits</p>
                    <p className="text-3xl font-bold text-gray-900" data-testid="stat-products">
                      {stats?.products_count || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Utilisateurs</p>
                    <p className="text-3xl font-bold text-gray-900" data-testid="stat-users">
                      {stats?.users_count || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Commandes</p>
                    <p className="text-3xl font-bold text-gray-900" data-testid="stat-orders">
                      {stats?.orders_count || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Revenu Total</p>
                    <p className="text-3xl font-bold text-gray-900" data-testid="stat-revenue">
                      {stats?.total_revenue?.toFixed(2) || '0.00'} €
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Produits par Catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.products_by_category?.map((cat) => (
                  <div key={cat._id} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">{cat._id}</span>
                    <span className="font-semibold text-gray-900">{cat.count} produits</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboardPage;
