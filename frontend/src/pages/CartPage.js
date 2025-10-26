import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shippingInfo, setShippingInfo] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API}/cart`, { withCredentials: true });
      setCartItems(response.data);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.put(
        `${API}/cart/update/${itemId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur mise à jour');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`${API}/cart/remove/${itemId}`, { withCredentials: true });
      toast.success('Article retiré du panier');
      fetchCart();
    } catch (error) {
      toast.error('Erreur suppression');
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

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-gray-50 py-12">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Panier vide</h2>
              <p className="text-gray-600 mb-6">Connectez-vous pour voir votre panier</p>
              <Button onClick={() => navigate('/connexion')} className="bg-green-600 hover:bg-green-700">
                Se connecter
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

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
      <Header cartCount={cartItems.length} />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8" data-testid="cart-title">Mon panier</h1>

          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Votre panier est vide</h2>
                <p className="text-gray-600 mb-6">Découvrez nos produits et commencez vos achats</p>
                <Button onClick={() => navigate('/produits')} className="bg-green-600 hover:bg-green-700">
                  Voir les produits
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4" data-testid="cart-items">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{item.product.brand}</p>
                          <p className="text-green-600 font-bold text-xl">
                            {item.product.price.toFixed(2)} €
                          </p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                            data-testid={`remove-item-${item.id}`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-8 w-8"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center"
                              min="1"
                              max={item.product.stock}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="h-8 w-8"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Récapitulatif</h2>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Sous-total</span>
                        <span data-testid="cart-subtotal">{calculateTotal().toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Livraison</span>
                        <span data-testid="cart-shipping">
                          {shippingInfo ? (
                            shippingInfo.is_free ? (
                              <span className="text-green-600 font-semibold">GRATUITE</span>
                            ) : (
                              `${shippingInfo.shipping_cost.toFixed(2)} €`
                            )
                          ) : (
                            'Calculée à l\'étape suivante'
                          )}
                        </span>
                      </div>
                      {shippingInfo && !shippingInfo.is_free && shippingInfo.amount_for_free_shipping > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                          <p className="text-blue-900">
                            Ajoutez <strong>{shippingInfo.amount_for_free_shipping.toFixed(2)} €</strong> pour bénéficier de la <strong>livraison gratuite</strong> !
                          </p>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-xl">
                        <span>Total</span>
                        <span className="text-green-600" data-testid="cart-total">
                          {shippingInfo ? 
                            (calculateTotal() + shippingInfo.shipping_cost).toFixed(2) : 
                            calculateTotal().toFixed(2)
                          } €
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate('/commande')}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                      data-testid="checkout-button"
                    >
                      Passer la commande
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/produits')}
                      className="w-full mt-3"
                    >
                      Continuer mes achats
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
