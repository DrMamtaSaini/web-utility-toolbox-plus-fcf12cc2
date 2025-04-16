
import { useState, useEffect } from 'react';
import ToolCard from '../ui/tool-card';
import { tools } from '@/data/tools';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchResultsProps {
  initialQuery?: string;
}

const SearchResults = ({ initialQuery = '' }: SearchResultsProps) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filteredTools, setFilteredTools] = useState(tools);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTools(tools);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tools.filter(tool => 
      tool.title.toLowerCase().includes(query) || 
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    );
    
    setFilteredTools(filtered);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto px-4">
      <div className="relative mb-8">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for tools..."
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {searchQuery && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8" 
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {searchQuery && (
        <p className="mb-4 text-muted-foreground">
          {filteredTools.length > 0 
            ? `Found ${filteredTools.length} ${filteredTools.length === 1 ? 'tool' : 'tools'} for "${searchQuery}"`
            : `No tools found for "${searchQuery}". Try a different search term.`
          }
        </p>
      )}

      {filteredTools.length > 0 ? (
        <div className="tool-grid">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="mb-4">😕</div>
          <h3 className="text-xl font-bold mb-2">No results found</h3>
          <p className="text-muted-foreground">
            We couldn't find any tools matching your search. Try different keywords or browse our categories.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
