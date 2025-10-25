import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Leaf, Bug, Shield, Sprout, Flower2, Star, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API}/products/featured`),
        axios.get(`${API}/categories`)
      ]);
      setFeaturedProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (iconName) => {
    const icons = {
      Leaf: <Leaf className="w-8 h-8" />,
      Bug: <Bug className="w-8 h-8" />,
      Shield: <Shield className="w-8 h-8" />,
      Sprout: <Sprout className="w-8 h-8" />,
      Flower2: <Flower2 className="w-8 h-8" />
    };
    return icons[iconName] || <Leaf className="w-8 h-8" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-32" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Produits phytosanitaires certifiés pour une agriculture durable
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Découvrez notre gamme complète de solutions professionnelles pour la protection et la nutrition de vos cultures. Tous nos produits sont certifiés AMM.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate('/produits')}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                  data-testid="hero-browse-products"
                >
                  Découvrir nos produits
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  onClick={() => navigate('/contact')}
                  variant="outline"
                  size="lg"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  data-testid="hero-contact"
                >
                  Contactez-nous
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560493676-04071c5f467b"
                alt="Agriculture moderne"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <p className="text-sm text-gray-600 font-medium">Certifié AMM</p>
                <p className="text-2xl font-bold text-green-600">100% Légal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white" data-testid="categories-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos catégories</h2>
            <p className="text-lg text-gray-600">Trouvez les solutions adaptées à vos besoins</p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/produits?category=${category.slug}`}
                  data-testid={`category-${category.slug}`}
                >
                  <Card className="card-hover cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        {getCategoryIcon(category.icon)}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50" data-testid="featured-products-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Produits phares</h2>
            <p className="text-lg text-gray-600">Sélection de nos meilleures ventes</p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 6).map((product) => (
                <Card key={product.id} className="card-hover" data-testid={`product-${product.slug}`}>
                  <div className="product-image-wrapper">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-56 object-cover"
                    />
                    {product.is_bio && (
                      <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                        BIO
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">({product.reviews_count})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">{product.price.toFixed(2)} €</span>
                      <Button
                        onClick={() => navigate(`/produits/${product.slug}`)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Voir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              onClick={() => navigate('/produits')}
              size="lg"
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
              data-testid="view-all-products"
            >
              Voir tous les produits
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Produits certifiés</h3>
              <p className="text-gray-600">Tous nos produits possèdent une autorisation de mise sur le marché (AMM)</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Livraison rapide</h3>
              <p className="text-gray-600">Expédition sous 24-48h partout en France</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Conseils experts</h3>
              <p className="text-gray-600">Équipe spécialisée pour vous accompagner dans vos choix</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
