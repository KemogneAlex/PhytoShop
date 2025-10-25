import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/App';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(getEmptyForm());
  const { user } = useAuth();
  const navigate = useNavigate();

  function getEmptyForm() {
    return {
      name: '',
      slug: '',
      category: '',
      subcategory: '',
      brand: '',
      price: 0,
      amm_number: '',
      description: '',
      composition: '',
      dosage: '',
      dangers_ghs: [],
      images: [''],
      stock: 0,
      is_bio: false,
      is_professional_only: false,
      featured: false
    };
  }

  useEffect(() => {
    if (!user?.is_admin) {
      toast.error('Accès réservé aux administrateurs');
      navigate('/');
      return;
    }
    fetchProducts();
    fetchCategories();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/admin/products`, { withCredentials: true });
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Filtrer les images vides
      const cleanedData = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== ''),
        dangers_ghs: typeof formData.dangers_ghs === 'string' ? 
          formData.dangers_ghs.split(',').map(d => d.trim()).filter(d => d) : 
          formData.dangers_ghs
      };

      if (editingProduct) {
        await axios.put(`${API}/admin/products/${editingProduct.id}`, cleanedData, { withCredentials: true });
        toast.success('Produit mis à jour');
      } else {
        await axios.post(`${API}/admin/products`, cleanedData, { withCredentials: true });
        toast.success('Produit créé');
      }
      
      setShowDialog(false);
      setEditingProduct(null);
      setFormData(getEmptyForm());
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    try {
      await axios.delete(`${API}/admin/products/${productId}`, { withCredentials: true });
      toast.success('Produit supprimé');
      fetchProducts();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openEditDialog = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      dangers_ghs: product.dangers_ghs.join(', ')
    });
    setShowDialog(true);
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    setFormData(getEmptyForm());
    setShowDialog(true);
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const updateImageField = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
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
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                data-testid="back-button"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </Button>
              <h1 className="text-4xl font-bold text-gray-900">Gestion des Produits</h1>
            </div>
            <Button
              onClick={openCreateDialog}
              className="bg-green-600 hover:bg-green-700"
              data-testid="add-product-button"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau produit
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="products-table">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold">Image</th>
                      <th className="text-left p-4 font-semibold">Nom</th>
                      <th className="text-left p-4 font-semibold">Catégorie</th>
                      <th className="text-left p-4 font-semibold">Prix</th>
                      <th className="text-left p-4 font-semibold">Stock</th>
                      <th className="text-right p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.brand}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm capitalize">{product.category}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold">{product.price.toFixed(2)} €</span>
                        </td>
                        <td className="p-4">
                          <span className={product.stock > 10 ? 'text-green-600' : 'text-orange-600'}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(product)}
                              data-testid={`edit-product-${product.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-700"
                              data-testid={`delete-product-${product.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Form Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="product-dialog">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  data-testid="product-name-input"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  data-testid="product-slug-input"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger data-testid="category-select">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subcategory">Sous-catégorie *</Label>
                <Input
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="brand">Marque *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Prix (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amm_number">Numéro AMM *</Label>
                <Input
                  id="amm_number"
                  value={formData.amm_number}
                  onChange={(e) => setFormData({ ...formData, amm_number: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dangers_ghs">Dangers GHS (séparés par virgules)</Label>
                <Input
                  id="dangers_ghs"
                  placeholder="GHS07, GHS09"
                  value={formData.dangers_ghs}
                  onChange={(e) => setFormData({ ...formData, dangers_ghs: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="composition">Composition *</Label>
                <Input
                  id="composition"
                  value={formData.composition}
                  onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Images (URLs)</Label>
              {formData.images.map((image, index) => (
                <div key={index} className="flex space-x-2 mt-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={image}
                    onChange={(e) => updateImageField(index, e.target.value)}
                  />
                  {formData.images.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeImageField(index)}
                    >
                      Supprimer
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImageField}
                className="mt-2"
              >
                + Ajouter une image
              </Button>
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_bio"
                  checked={formData.is_bio}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_bio: checked })}
                />
                <Label htmlFor="is_bio" className="text-sm">Produit BIO</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_professional_only"
                  checked={formData.is_professional_only}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_professional_only: checked })}
                />
                <Label htmlFor="is_professional_only" className="text-sm">Professionnel uniquement</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured" className="text-sm">Produit phare</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" data-testid="save-product-button">
                {editingProduct ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminProductsPage;