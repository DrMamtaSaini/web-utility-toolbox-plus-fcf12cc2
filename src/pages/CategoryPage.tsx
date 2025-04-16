import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolCard from '@/components/ui/tool-card';
import AdBanner from '@/components/ads/AdBanner';
import { tools, toolsByCategory, categories } from '@/data/tools';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  // Convert URL-friendly category ID to actual category name
  const getCategoryFromId = (id: string): string => {
    const normalizedId = id?.toLowerCase();
    return categories.find(
      cat => cat.toLowerCase().replace(/\s+/g, '-') === normalizedId
    ) || '';
  };
  
  const category = getCategoryFromId(categoryId || '');
  const categoryTools = toolsByCategory[category] || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId]);
  
  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The category you are looking for does not exist.
            </p>
            <Button asChild>
              <Link to="/">
                <ChevronLeft size={16} className="mr-1" /> Back to Home
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-muted py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              <ChevronRight size={14} className="mx-2 text-muted-foreground" />
              <span>Categories</span>
              <ChevronRight size={14} className="mx-2 text-muted-foreground" />
              <span className="text-foreground font-medium">{category}</span>
            </div>
            <h1 className="text-3xl font-bold">{category}</h1>
            <p className="text-muted-foreground mt-2">
              {categoryTools.length} tools available
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 my-8">
          <AdBanner />
        </div>
        
        <section className="container mx-auto px-4 my-8">
          <div className="tool-grid">
            {categoryTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </section>

        <div className="container mx-auto px-4 my-8">
          <AdBanner />
        </div>

        {/* Other Categories */}
        <section className="container mx-auto px-4 my-12">
          <h2 className="text-2xl font-bold mb-6">Other Categories</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories
              .filter(cat => cat !== category)
              .map((cat) => (
                <Link 
                  key={cat}
                  to={`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block p-6 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <h3 className="font-medium mb-2">{cat}</h3>
                  <p className="text-sm text-muted-foreground">
                    {toolsByCategory[cat].length} tools
                  </p>
                </Link>
              ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
