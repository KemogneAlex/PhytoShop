import React, { useState } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('Message envoyé avec succès !');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8" data-testid="contact-title">Contactez-nous</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
                    <div>
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        data-testid="contact-name-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        data-testid="contact-email-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Sujet *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        data-testid="contact-subject-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        data-testid="contact-message-textarea"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={loading}
                      data-testid="contact-submit-button"
                    >
                      {loading ? 'Envoi...' : 'Envoyer le message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Coordonnées</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <p className="font-medium">Adresse</p>
                        <p className="text-sm text-gray-600">
                          123 Avenue de l'Agriculture<br />
                          75001 Paris, France
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <p className="font-medium">Téléphone</p>
                        <p className="text-sm text-gray-600">+33 1 23 45 67 89</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-600">contact@phytopro-shop.fr</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Horaires d'ouverture</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lundi - Vendredi</span>
                      <span className="font-medium">8h - 18h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Samedi</span>
                      <span className="font-medium">9h - 12h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dimanche</span>
                      <span className="font-medium">Fermé</span>
                    </div>
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

export default ContactPage;