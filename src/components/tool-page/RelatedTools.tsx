
import { Link } from "react-router-dom";
import { Tool, tools } from "@/data/tools";

interface RelatedToolsProps {
  currentTool: Tool;
}

export const RelatedTools = ({ currentTool }: RelatedToolsProps) => {
  const relatedTools = tools
    .filter(t => t.category === currentTool.category && t.id !== currentTool.id)
    .slice(0, 4);
    
  return (
    <section className="container mx-auto px-4 my-12">
      <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {relatedTools.map(tool => (
          <Link 
            key={tool.id}
            to={`/tools/${tool.id}`}
            className="block p-6 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-3">
                {tool.icon}
              </div>
              <div>
                <h3 className="font-medium mb-1">{tool.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
