import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/App';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Star, ShoppingCart, AlertCircle, Package, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAgeConfirm, setShowAgeConfirm] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${slug}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Erreur chargement produit:', error);
      toast.error('Produit non trouvé');
      navigate('/produits');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API}/reviews/${slug}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Erreur chargement avis:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter');
      navigate('/connexion');
      return;
    }

    if (product.is_professional_only && !user.is_professional) {
      toast.error('Ce produit est réservé aux professionnels certifiés');
      return;
    }

    if (!ageConfirmed) {
      setShowAgeConfirm(true);
      return;
    }

    try {
      await axios.post(
        `${API}/cart/add`,
        { product_id: product.id, quantity },
        { withCredentials: true }
      );
      toast.success('Produit ajouté au panier');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur ajout panier');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Veuillez vous connecter');
      navigate('/connexion');
      return;
    }

    try {
      await axios.post(
        `${API}/reviews`,
        { product_id: product.id, ...reviewForm },
        { withCredentials: true }
      );
      toast.success('Avis publié');
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur publication avis');
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

  if (!product) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Images */}
            <div>
              <div className="bg-white rounded-lg p-4 mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                  data-testid="product-main-image"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                      selectedImage === idx ? 'border-green-600' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={img} alt="" className="w-full h-20 object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="product-name">
                    {product.name}
                  </h1>
                  <p className="text-lg text-gray-600">{product.brand}</p>
                </div>
                {product.is_bio && (
                  <Badge className="bg-green-600">BIO</Badge>
                )}
              </div>

              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-gray-600 ml-2">
                  {product.rating} ({product.reviews_count} avis)
                </span>
              </div>

              <div className="text-4xl font-bold text-green-600 mb-6" data-testid="product-price">
                {product.price.toFixed(2)} €
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              {/* Warning if professional only */}
              {product.is_professional_only && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-orange-900">Produit professionnel</p>
                    <p className="text-sm text-orange-800">
                      Réservé aux utilisateurs possédant un certificat phytosanitaire valide
                    </p>
                  </div>
                </div>
              )}

              {/* Stock */}
              <div className="flex items-center space-x-2 mb-6">
                <Package className={`w-5 h-5 ${product.stock > 10 ? 'text-green-600' : 'text-orange-600'}`} />
                <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                  {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                </span>
              </div>

              {/* Quantity and Add to Cart */}
              {product.stock > 0 && (
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Label>Quantité:</Label>
                    <Input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 1, product.stock))}
                      className="w-20"
                      data-testid="quantity-input"
                    />
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="lg"
                    data-testid="add-to-cart-button"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Ajouter au panier
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Product Details Tabs */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Informations détaillées</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Composition</h3>
                  <p className="text-gray-700">{product.composition}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Dosage recommandé</h3>
                  <p className="text-gray-700">{product.dosage}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">N° AMM</h3>
                  <p className="text-gray-700 font-mono">{product.amm_number}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Catégorie</h3>
                  <p className="text-gray-700">{product.category} - {product.subcategory}</p>
                </div>
              </div>

              {product.dangers_ghs && product.dangers_ghs.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-start space-x-2 text-red-600 mb-4">
                    <AlertTriangle className="w-6 h-6" />
                    <div>
                      <h3 className="font-semibold text-lg">Dangers et précautions</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Pictogrammes de danger GHS: {product.dangers_ghs.join(', ')}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Respectez les doses prescrites. Utilisez les équipements de protection appropriés. 
                    Tenir hors de portée des enfants et des animaux domestiques.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Avis clients</h2>

              {/* Add Review Form */}
              {user && (
                <form onSubmit={handleSubmitReview} className="mb-8 pb-8 border-b border-gray-200" data-testid="review-form">
                  <h3 className="font-semibold mb-4">Donnez votre avis</h3>
                  <div className="mb-4">
                    <Label>Note</Label>
                    <div className="flex space-x-2 mt-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                          key={rating}
                          className={`w-8 h-8 cursor-pointer ${
                            rating <= reviewForm.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                          onClick={() => setReviewForm({ ...reviewForm, rating })}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="comment">Commentaire</Label>
                    <Textarea
                      id="comment"
                      placeholder="Partagez votre expérience..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      required
                      rows={4}
                      data-testid="review-comment-textarea"
                    />
                  </div>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700" data-testid="submit-review-button">
                    Publier l'avis
                  </Button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-6" data-testid="reviews-list">
                {reviews.length === 0 ? (
                  <p className="text-gray-600">Aucun avis pour le moment</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">{review.user_name}</p>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Age Confirmation Dialog */}
      <Dialog open={showAgeConfirm} onOpenChange={setShowAgeConfirm}>
        <DialogContent data-testid="age-confirmation-dialog">
          <DialogHeader>
            <DialogTitle>Confirmation d'âge</DialogTitle>
            <DialogDescription>
              Les produits phytosanitaires sont réglementés et leur achat est réservé aux personnes majeures.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start space-x-2 py-4">
            <Checkbox
              id="age-confirm"
              checked={ageConfirmed}
              onCheckedChange={setAgeConfirmed}
              data-testid="age-confirm-checkbox"
            />
            <Label htmlFor="age-confirm" className="text-sm">
              Je certifie avoir plus de 18 ans et comprendre les risques liés à l'utilisation de produits phytosanitaires.
            </Label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAgeConfirm(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => {
                if (ageConfirmed) {
                  setShowAgeConfirm(false);
                  handleAddToCart();
                }
              }}
              disabled={!ageConfirmed}
              className="bg-green-600 hover:bg-green-700"
              data-testid="confirm-age-button"
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
