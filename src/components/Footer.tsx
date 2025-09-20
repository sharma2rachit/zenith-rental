import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">RentCar</span>
            </div>
            <p className="text-gray-300 text-sm">
              Your trusted partner for car rentals worldwide. Experience the freedom of the road with our premium vehicle selection.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Book a Car</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Our Fleet</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Locations</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Special Offers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Corporate</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Rental Guide</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-gray-300">1-800-RENTCAR</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-gray-300">info@rentcar.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-gray-300">123 Rental Street<br />New York, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 RentCar. All rights reserved. | Designed for seamless car rental experiences.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;