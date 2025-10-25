import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, Star, Filter } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    is_bio: searchParams.get('is_bio') === 'true',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.is_bio) params.is_bio = filters.is_bio;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;

      const response = await axios.get(`${API}/products`, { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) params.set(k, newFilters[k]);
    });
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Nos produits</h1>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20" data-testid="filters-card">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <Label className="text-lg font-semibold mb-4 block">Filtres</Label>
                  </div>

                  {/* Search */}
                  <div>
                    <Label htmlFor="search">Rechercher</Label>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Nom du produit..."
                        className="pl-10"
                        value={filters.search}
                        onChange={(e) => updateFilter('search', e.target.value)}
                        data-testid="search-input"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <Label>Catégorie</Label>
                    <Select value={filters.category || "all"} onValueChange={(v) => updateFilter('category', v === 'all' ? '' : v)}>
                      <SelectTrigger className="mt-2" data-testid="category-select">
                        <SelectValue placeholder="Toutes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bio filter */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bio"
                      checked={filters.is_bio}
                      onCheckedChange={(checked) => updateFilter('is_bio', checked)}
                      data-testid="bio-checkbox"
                    />
                    <Label htmlFor="bio">Produits biologiques uniquement</Label>
                  </div>

                  {/* Price range */}
                  <div>
                    <Label>Prix (€)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.min_price}
                        onChange={(e) => updateFilter('min_price', e.target.value)}
                        data-testid="min-price-input"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.max_price}
                        onChange={(e) => updateFilter('max_price', e.target.value)}
                        data-testid="max-price-input"
                      />
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setFilters({ category: '', search: '', is_bio: false, min_price: '', max_price: '' });
                      setSearchParams(new URLSearchParams());
                    }}
                    data-testid="reset-filters"
                  >
                    Réinitialiser
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="spinner"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12" data-testid="no-products">
                  <p className="text-gray-600 text-lg">Aucun produit trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="products-grid">
                  {products.map((product) => (
                    <Card key={product.id} className="card-hover cursor-pointer" onClick={() => navigate(`/produits/${product.slug}`)} data-testid={`product-card-${product.slug}`}>
                      <div className="product-image-wrapper">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        {product.is_bio && (
                          <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                            BIO
                          </div>
                        )}
                        {product.stock < 10 && product.stock > 0 && (
                          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                            Stock limité
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                            Rupture
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                        <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-600 ml-1">({product.reviews_count})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-green-600">{product.price.toFixed(2)} €</span>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Voir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;
