
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export const ToolNotFound = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The tool you are looking for does not exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">
          <ChevronLeft size={16} className="mr-1" /> Back to Home
        </Link>
      </Button>
    </div>
  );
};
