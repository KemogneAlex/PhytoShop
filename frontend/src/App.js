import React, { useEffect, useState } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from '@/components/ui/sonner';
import useTarteaucitron from '@/hooks/useTarteaucitron';
import { AuthContext } from '@/contexts/AuthContext';

// Pages
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage';
import AccountPage from '@/pages/AccountPage';
import OrdersPage from '@/pages/OrdersPage';
import LoginPage from '@/pages/LoginPage';
import BlogPage from '@/pages/BlogPage';
import ContactPage from '@/pages/ContactPage';
import LegalPage from '@/pages/LegalPage';
import CGVPage from '@/pages/CGVPage';
import PrivacyPage from '@/pages/PrivacyPage';
import InfoPhytoPage from '@/pages/InfoPhytoPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminProductsPage from '@/pages/AdminProductsPage';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialiser Tarteaucitron pour la gestion des cookies
  useTarteaucitron();

  useEffect(() => {
    checkAuth();
    // Check for Emergent session_id in URL
    const hash = window.location.hash;
    if (hash.includes('session_id=')) {
      const sessionId = hash.split('session_id=')[1].split('&')[0];
      processEmergentSession(sessionId);
      // Clean URL
      window.location.hash = '';
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, { withCredentials: true });
      setUser(response.data);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const processEmergentSession = async (sessionId) => {
    try {
      const response = await axios.post(
        `${API}/auth/session`,
        { session_id: sessionId },
        { withCredentials: true }
      );
      setUser(response.data.user);
      window.location.href = '/compte';
    } catch (e) {
      console.error('Erreur session Emergent:', e);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      window.location.href = '/';
    } catch (e) {
      console.error('Erreur déconnexion:', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, checkAuth }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/produits" element={<ProductsPage />} />
            <Route path="/produits/:slug" element={<ProductDetailPage />} />
            <Route path="/panier" element={<CartPage />} />
            <Route path="/commande" element={user ? <CheckoutPage /> : <Navigate to="/connexion" />} />
            <Route path="/commande/succes" element={<CheckoutSuccessPage />} />
            <Route path="/compte" element={user ? <AccountPage /> : <Navigate to="/connexion" />} />
            <Route path="/compte/commandes" element={user ? <OrdersPage /> : <Navigate to="/connexion" />} />
            <Route path="/connexion" element={!user ? <LoginPage /> : <Navigate to="/compte" />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/info-phyto" element={<InfoPhytoPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/mentions-legales" element={<LegalPage />} />
            <Route path="/cgv" element={<CGVPage />} />
            <Route path="/confidentialite" element={<PrivacyPage />} />
            <Route path="/admin" element={user?.is_admin ? <AdminDashboardPage /> : <Navigate to="/" />} />
            <Route path="/admin/products" element={user?.is_admin ? <AdminProductsPage /> : <Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
