
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { toolsByCategory, categories } from '@/data/tools';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ToolCard from '@/components/ui/tool-card';
import AdBanner from '@/components/ads/AdBanner';

const CategoriesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">All Categories</h1>
            <p className="text-muted-foreground max-w-2xl">
              Browse our collection of free online tools organized by category. Find the perfect tool for your needs.
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 my-8">
          <AdBanner />
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {categories.map((category) => {
            const categoryId = category.toLowerCase().replace(/\s+/g, '-');
            const toolsInCategory = toolsByCategory[category];
            
            return (
              <section key={category} className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{category}</h2>
                  <Button variant="outline" asChild>
                    <Link to={`/category/${categoryId}`}>View All</Link>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {toolsInCategory.slice(0, 4).map((tool) => (
                    <ToolCard key={tool.id} {...tool} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
        
        <div className="container mx-auto px-4 my-8">
          <AdBanner />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoriesPage;
