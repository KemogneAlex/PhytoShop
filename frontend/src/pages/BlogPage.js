import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';

const BlogPage = () => {
  const articles = [
    {
      id: 1,
      title: "Nouvelle réglementation européenne sur les néonicotinoïdes",
      excerpt: "La Commission européenne a adopté de nouvelles restrictions concernant l'utilisation des néonicotinoïdes. Découvrez les impacts pour votre exploitation.",
      date: "2024-10-15",
      author: "Marie Dubois",
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b"
    },
    {
      id: 2,
      title: "Guide complet du biocontrôle en agriculture",
      excerpt: "Le biocontrôle représente une alternative efficace aux produits phytosanitaires conventionnels. Découvrez les solutions disponibles.",
      date: "2024-10-10",
      author: "Jean Martin",
      image: "https://images.unsplash.com/photo-1680033352144-6122ab7494fa"
    },
    {
      id: 3,
      title: "Optimiser la fertilisation de vos céréales",
      excerpt: "Les bonnes pratiques pour maximiser le rendement de vos cultures de céréales tout en respectant l'environnement.",
      date: "2024-10-05",
      author: "Sophie Laurent",
      image: "https://images.unsplash.com/photo-1590154743804-cf7c51dcbfd3"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="blog-title">Blog & Actualités</h1>
          <p className="text-lg text-gray-600 mb-8">
            Restez informé des dernières actualités et réglementations du secteur phytosanitaire
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="card-hover" data-testid={`article-${article.id}`}>
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{article.title}</h3>
                  <p className="text-gray-600 text-sm">{article.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPage;