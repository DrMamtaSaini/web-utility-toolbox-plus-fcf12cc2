
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from 'lucide-react';

export interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  isNew?: boolean;
  isPopular?: boolean;
}

const ToolCard = ({ id, title, description, category, icon, isNew, isPopular }: ToolCardProps) => {
  return (
    <Link to={`/tools/${id}`} className="block">
      <Card className="h-full tool-card overflow-hidden border">
        <CardContent className="p-6">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
            {icon}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg leading-tight">{title}</h3>
              {(isNew || isPopular) && (
                <div className="flex gap-2">
                  {isNew && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
                  {isPopular && <Badge variant="secondary" className="bg-orange-500 text-white hover:bg-orange-600">Popular</Badge>}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex items-center justify-between">
          <Badge variant="outline">{category}</Badge>
          <span className="text-primary text-sm font-medium inline-flex items-center">
            Use Tool <ArrowRight size={14} className="ml-1" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ToolCard;
