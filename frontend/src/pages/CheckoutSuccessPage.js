import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('checking');
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      checkPaymentStatus();
    } else {
      setStatus('error');
    }
  }, [sessionId]);

  const checkPaymentStatus = async (attempt = 0) => {
    const maxAttempts = 5;
    const pollInterval = 2000;

    if (attempt >= maxAttempts) {
      setStatus('timeout');
      return;
    }

    try {
      const response = await axios.get(`${API}/checkout/status/${sessionId}`, { withCredentials: true });
      
      if (response.data.payment_status === 'paid') {
        setStatus('success');
        toast.success('Paiement confirmé !');
      } else if (response.data.status === 'expired') {
        setStatus('error');
      } else {
        // Continue polling
        setTimeout(() => checkPaymentStatus(attempt + 1), pollInterval);
      }
    } catch (error) {
      console.error('Erreur vérification paiement:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12">
        <div className="max-w-2xl w-full mx-4">
          {status === 'checking' && (
            <Card data-testid="checking-status">
              <CardContent className="p-12 text-center">
                <div className="spinner mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold mb-2">Vérification du paiement...</h2>
                <p className="text-gray-600">Veuillez patienter</p>
              </CardContent>
            </Card>
          )}

          {status === 'success' && (
            <Card data-testid="success-status">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Commande confirmée !</h2>
                <p className="text-gray-600 mb-8">
                  Merci pour votre achat. Vous allez recevoir un email de confirmation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/compte/commandes')}
                    className="bg-green-600 hover:bg-green-700"
                    data-testid="view-orders-button"
                  >
                    <Package className="w-5 h-5 mr-2" />
                    Voir mes commandes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/produits')}
                    data-testid="continue-shopping-button"
                  >
                    Continuer mes achats
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {(status === 'error' || status === 'timeout') && (
            <Card data-testid="error-status">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {status === 'timeout' ? 'Vérification en cours' : 'Erreur de paiement'}
                </h2>
                <p className="text-gray-600 mb-8">
                  {status === 'timeout'
                    ? 'La vérification prend plus de temps que prévu. Vérifiez vos emails ou contactez-nous.'
                    : 'Une erreur est survenue. Veuillez réessayer ou nous contacter.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/contact')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Nous contacter
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/')}>
                    Retour à l'accueil
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutSuccessPage;
