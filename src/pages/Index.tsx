
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolCard from '@/components/ui/tool-card';
import AdBanner from '@/components/ads/AdBanner';
import { tools, toolsByCategory, categories } from '@/data/tools';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronRight } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTools, setFilteredTools] = useState<typeof tools | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredTools(null);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = tools.filter(tool => 
      tool.title.toLowerCase().includes(lowercaseQuery) || 
      tool.description.toLowerCase().includes(lowercaseQuery) ||
      tool.category.toLowerCase().includes(lowercaseQuery)
    );
    
    setFilteredTools(filtered);
  };

  // Function to get popular tools
  const getPopularTools = (limit = 4) => {
    return tools.filter(tool => tool.isPopular).slice(0, limit);
  };

  // Function to get tools by category for preview
  const getCategoryTools = (category: string, limit = 4) => {
    return toolsByCategory[category]?.slice(0, limit) || [];
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with search */}
      <Header onSearch={handleSearch} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/90 to-primary text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">100+ Free Online Tools</h1>
              <p className="text-lg mb-8 text-white/90">
                Discover free online tools for image conversion, text manipulation, calculations, and much more.
                All tools are completely free, easy to use, and accessible anywhere.
              </p>
              
              <div className="relative max-w-xl mx-auto">
                <Input
                  type="text"
                  placeholder="Search from over 100 tools..."
                  className="pl-12 py-6 text-black"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </section>

        {/* Ad Banner */}
        <div className="container mx-auto px-4 my-8">
          <AdBanner />
        </div>

        {/* Search Results (conditionally rendered) */}
        {searchQuery && filteredTools && (
          <section className="container mx-auto px-4 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Search Results for "{searchQuery}"
              </h2>
              <Button variant="ghost" onClick={() => handleSearch('')}>
                Clear Search
              </Button>
            </div>
            
            {filteredTools.length > 0 ? (
              <div className="tool-grid">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} {...tool} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-muted/30 rounded-lg">
                <h3 className="text-xl font-medium mb-2">No tools found</h3>
                <p className="text-muted-foreground">
                  Try different keywords or browse our categories below.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Popular Tools */}
        {!searchQuery && (
          <>
            <section className="container mx-auto px-4 my-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Popular Tools</h2>
                <Button variant="outline" asChild>
                  <Link to="/popular">
                    View All <ChevronRight size={16} className="ml-1" />
                  </Link>
                </Button>
              </div>
              
              <div className="tool-grid">
                {getPopularTools().map((tool) => (
                  <ToolCard key={tool.id} {...tool} />
                ))}
              </div>
            </section>

            {/* Categories */}
            {categories.slice(0, 4).map((category) => (
              <section key={category} className="container mx-auto px-4 my-12 category-section">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{category}</h2>
                  <Button variant="outline" asChild>
                    <Link to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}>
                      View All <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </Button>
                </div>
                
                <div className="tool-grid">
                  {getCategoryTools(category).map((tool) => (
                    <ToolCard key={tool.id} {...tool} />
                  ))}
                </div>
                
                {/* Insert ad after each category section */}
                {category !== categories[categories.length - 1] && (
                  <div className="mt-8">
                    <AdBanner />
                  </div>
                )}
              </section>
            ))}
            
            {/* Categories Grid */}
            <section className="container mx-auto px-4 my-12">
              <h2 className="text-2xl font-bold mb-6">All Categories</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <Link 
                    key={category}
                    to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block p-6 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <h3 className="font-medium mb-2">{category}</h3>
                    <p className="text-sm text-muted-foreground">
                      {toolsByCategory[category].length} tools
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
