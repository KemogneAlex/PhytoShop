import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PhytoPro Shop</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Votre spécialiste en produits phytosanitaires certifiés pour une agriculture durable et performante.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-green-500 transition" data-testid="facebook-link">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition" data-testid="twitter-link">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition" data-testid="instagram-link">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition" data-testid="linkedin-link">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/produits" className="hover:text-green-500 transition" data-testid="footer-products">
                  Nos produits
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-green-500 transition" data-testid="footer-blog">
                  Blog & Actualités
                </Link>
              </li>
              <li>
                <Link to="/info-phyto" className="hover:text-green-500 transition" data-testid="footer-info-phyto">
                  Infos Phytosanitaires
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-green-500 transition" data-testid="footer-contact">
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link to="/compte" className="hover:text-green-500 transition" data-testid="footer-account">
                  Mon compte
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/mentions-legales" className="hover:text-green-500 transition" data-testid="footer-legal">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/cgv" className="hover:text-green-500 transition" data-testid="footer-cgv">
                  CGV
                </Link>
              </li>
              <li>
                <Link to="/confidentialite" className="hover:text-green-500 transition" data-testid="footer-privacy">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <a 
                  href="#tarteaucitron" 
                  className="hover:text-green-500 transition cursor-pointer" 
                  data-testid="footer-cookies"
                >
                  Gérer mes cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-green-500 mt-1" />
                <span>123 Avenue de l'Agriculture<br />75001 Paris, France</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-500" />
                <a href="tel:+33123456789" className="hover:text-green-500 transition" data-testid="phone-link">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-green-500" />
                <a href="mailto:contact@phytopro-shop.fr" className="hover:text-green-500 transition" data-testid="email-link">
                  contact@phytopro-shop.fr
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p className="text-gray-400">
            &copy; 2024 PhytoPro Shop. Tous droits réservés. | Produits phytosanitaires : utilisez les avec précaution.
          </p>
          <p className="text-gray-500 mt-2 text-xs">
            Avant toute utilisation, assurez-vous que celle-ci est indispensable. Privilégiez chaque fois que possible les méthodes alternatives et les produits présentant le risque le plus faible pour la santé humaine et animale et pour l'environnement.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
