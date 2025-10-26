import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [shippingData, setShippingData] = useState({
    full_name: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'France',
    phone: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API}/cart`, { withCredentials: true });
      setCartItems(response.data);
      if (response.data.length === 0) {
        toast.error('Votre panier est vide');
        navigate('/panier');
      }
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  useEffect(() => {
    const subtotal = calculateTotal();
    if (subtotal > 0) {
      fetchShippingInfo(subtotal);
    }
  }, [cartItems]);

  const fetchShippingInfo = async (subtotal) => {
    try {
      const response = await axios.get(`${API}/shipping/calculate?subtotal=${subtotal}`);
      setShippingInfo(response.data);
    } catch (error) {
      console.error('Erreur calcul livraison:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const originUrl = window.location.origin;
      const response = await axios.post(
        `${API}/checkout/create-order`,
        {
          shipping_address: shippingData,
          origin_url: originUrl
        },
        { withCredentials: true }
      );

      // Redirect to Stripe checkout
      window.location.href = response.data.checkout_url;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la commande');
      setSubmitting(false);
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8" data-testid="checkout-title">Finaliser la commande</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Shipping Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Adresse de livraison</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="full_name">Nom complet *</Label>
                        <Input
                          id="full_name"
                          value={shippingData.full_name}
                          onChange={(e) => setShippingData({ ...shippingData, full_name: e.target.value })}
                          required
                          data-testid="full-name-input"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Adresse *</Label>
                        <Input
                          id="address"
                          value={shippingData.address}
                          onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                          required
                          data-testid="address-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Ville *</Label>
                        <Input
                          id="city"
                          value={shippingData.city}
                          onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                          required
                          data-testid="city-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postal_code">Code postal *</Label>
                        <Input
                          id="postal_code"
                          value={shippingData.postal_code}
                          onChange={(e) => setShippingData({ ...shippingData, postal_code: e.target.value })}
                          required
                          data-testid="postal-code-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Pays *</Label>
                        <Input
                          id="country"
                          value={shippingData.country}
                          onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                          required
                          data-testid="country-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Téléphone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={shippingData.phone}
                          onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                          required
                          data-testid="phone-input"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-900 font-medium">Paiement sécurisé</p>
                        <p className="text-xs text-blue-800 mt-1">
                          Vous serez redirigé vers Stripe pour finaliser votre paiement de manière sécurisée.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Récapitulatif</h2>
                    <div className="space-y-3 mb-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.product.name} x{item.quantity}
                          </span>
                          <span className="font-medium">
                            {(item.product.price * item.quantity).toFixed(2)} €
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-3 flex justify-between text-gray-600">
                        <span>Sous-total</span>
                        <span>{calculateTotal().toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Livraison</span>
                        <span>
                          {shippingInfo ? (
                            shippingInfo.is_free ? (
                              <span className="text-green-600 font-semibold">GRATUITE</span>
                            ) : (
                              `${shippingInfo.shipping_cost.toFixed(2)} €`
                            )
                          ) : (
                            '...'
                          )}
                        </span>
                      </div>
                      {shippingInfo && shippingInfo.is_free && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-xs text-green-900">
                          🎉 Vous bénéficiez de la livraison gratuite !
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-xl">
                        <span>Total</span>
                        <span className="text-green-600" data-testid="checkout-total">
                          {shippingInfo ? 
                            (calculateTotal() + shippingInfo.shipping_cost).toFixed(2) : 
                            calculateTotal().toFixed(2)
                          } €
                        </span>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                      disabled={submitting}
                      data-testid="submit-order-button"
                    >
                      {submitting ? 'Redirection...' : 'Procéder au paiement'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
