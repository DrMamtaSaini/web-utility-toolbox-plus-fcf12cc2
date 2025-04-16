
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { tools } from '@/data/tools';
import ToolCard from '@/components/ui/tool-card';
import AdBanner from '@/components/ads/AdBanner';

const PopularToolsPage = () => {
  // Filter tools marked as popular
  const popularTools = tools.filter(tool => tool.isPopular);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Popular Tools</h1>
            <p className="text-muted-foreground max-w-2xl">
              Our most popular online tools that users love. These tools are frequently used and highly rated.
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 my-8">
          <AdBanner />
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
          
          {popularTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No popular tools found.</p>
            </div>
          )}
        </div>
        
        <div className="container mx-auto px-4 my-8">
          <AdBanner />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PopularToolsPage;
