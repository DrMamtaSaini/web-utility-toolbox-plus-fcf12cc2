
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdBanner from '@/components/ads/AdBanner';
import { tools } from '@/data/tools';
import { ToolHeader } from '@/components/tool-page/ToolHeader';
import { ToolContent } from '@/components/tool-page/ToolContent';
import { RelatedTools } from '@/components/tool-page/RelatedTools';
import { ToolNotFound } from '@/components/tool-page/NotFound';

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = tools.find(t => t.id === toolId);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [toolId]);

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <ToolNotFound />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <ToolHeader tool={tool} />
        
        <div className="container mx-auto px-4 mt-8">
          <AdBanner />
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <ToolContent toolId={toolId || ''} tool={tool} />
        </div>
        
        <div className="container mx-auto px-4 my-8">
          <AdBanner />
        </div>

        <RelatedTools currentTool={tool} />
      </main>
      
      <Footer />
    </div>
  );
};

export default ToolPage;
