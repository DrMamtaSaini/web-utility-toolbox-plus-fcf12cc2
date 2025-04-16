
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary mt-12 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">UtilityMaster</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your one-stop solution for online utilities. Access 100+ free tools for everyday tasks.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary"><Facebook size={18} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Twitter size={18} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Instagram size={18} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Linkedin size={18} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Github size={18} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/category/image-tools" className="text-sm text-muted-foreground hover:text-primary">Image Tools</Link></li>
              <li><Link to="/category/seo-tools" className="text-sm text-muted-foreground hover:text-primary">SEO Tools</Link></li>
              <li><Link to="/category/text-tools" className="text-sm text-muted-foreground hover:text-primary">Text Tools</Link></li>
              <li><Link to="/category/developer-tools" className="text-sm text-muted-foreground hover:text-primary">Developer Tools</Link></li>
              <li><Link to="/category/calculators" className="text-sm text-muted-foreground hover:text-primary">Calculators</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to our newsletter to get updates about new tools.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 text-sm border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary w-full" 
              />
              <button 
                type="submit" 
                className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Ad Space */}
        <div className="ad-container my-8">
          <div className="text-muted-foreground">Advertisement Space</div>
        </div>

        <div className="border-t pt-6 mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} UtilityMaster. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
