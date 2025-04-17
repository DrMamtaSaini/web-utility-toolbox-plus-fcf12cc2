
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from "sonner";
import { Search, AlertTriangle } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface DomainMetrics {
  domain: string;
  domainAuthority: number;
  pageAuthority: number;
  spamScore: number;
  backlinks: number;
  rankingKeywords: number;
  organicTraffic: number;
}

const DomainAuthorityChecker = () => {
  const [domain, setDomain] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [metrics, setMetrics] = useState<DomainMetrics | null>(null);
  const [competitorMetrics, setCompetitorMetrics] = useState<DomainMetrics[]>([]);

  const validateDomain = (input: string) => {
    // Simple domain validation
    const pattern = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    return pattern.test(input);
  };

  const getScoreColor = (score: number) => {
    if (score >= 60) return "bg-green-600";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-600";
  };

  const getScoreText = (score: number) => {
    if (score >= 60) return "text-green-600";
    if (score >= 40) return "text-amber-500";
    return "text-red-600";
  };

  const checkDomainAuthority = () => {
    // Remove http/https if present
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/i, '');
    setDomain(cleanDomain);
    
    if (!cleanDomain.trim() || !validateDomain(cleanDomain)) {
      toast.error("Please enter a valid domain name");
      return;
    }

    setIsChecking(true);
    
    // In a real implementation, this would call an API
    // For demo purposes, we'll simulate the check with setTimeout
    setTimeout(() => {
      // Generate random metrics for demo
      const mockMetrics: DomainMetrics = {
        domain: cleanDomain,
        domainAuthority: Math.floor(Math.random() * 60) + 20, // 20-80
        pageAuthority: Math.floor(Math.random() * 50) + 20, // 20-70
        spamScore: Math.floor(Math.random() * 10), // 0-9
        backlinks: Math.floor(Math.random() * 10000) + 500, // 500-10500
        rankingKeywords: Math.floor(Math.random() * 5000) + 100, // 100-5100
        organicTraffic: Math.floor(Math.random() * 50000) + 1000 // 1000-51000
      };
      
      // Generate mock competitor metrics
      const competitors = [
        'competitor1.' + cleanDomain.split('.').slice(1).join('.'),
        'competitor2.' + cleanDomain.split('.').slice(1).join('.'),
        'alternative.' + cleanDomain.split('.').slice(1).join('.')
      ];
      
      const mockCompetitors: DomainMetrics[] = competitors.map(comp => ({
        domain: comp,
        domainAuthority: Math.floor(Math.random() * 60) + 20,
        pageAuthority: Math.floor(Math.random() * 50) + 20,
        spamScore: Math.floor(Math.random() * 10),
        backlinks: Math.floor(Math.random() * 10000) + 500,
        rankingKeywords: Math.floor(Math.random() * 5000) + 100,
        organicTraffic: Math.floor(Math.random() * 50000) + 1000
      }));
      
      setMetrics(mockMetrics);
      setCompetitorMetrics(mockCompetitors);
      setIsChecking(false);
      toast.success(`Domain authority check completed for ${cleanDomain}`);
    }, 2000);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="domain">Domain Name</Label>
            <div className="flex space-x-2">
              <Input
                id="domain"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={checkDomainAuthority}
                disabled={isChecking}
                className="min-w-fit"
              >
                {isChecking ? 'Checking...' : 'Check Authority'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter your domain name without http:// or www
            </p>
          </div>
        </CardContent>
      </Card>

      {isChecking && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <Search className="h-8 w-8 text-primary mb-2" />
            <p className="text-muted-foreground">Analyzing domain authority...</p>
          </div>
        </div>
      )}

      {!isChecking && metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Domain Authority Score</h3>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-36 h-36 rounded-full border-8 flex items-center justify-center relative bg-muted/30" style={{ borderColor: getScoreColor(metrics.domainAuthority) }}>
                    <span className="text-4xl font-bold">{metrics.domainAuthority}</span>
                    <span className="text-xs absolute bottom-2 text-muted-foreground">out of 100</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {metrics.domainAuthority >= 60 ? 'Excellent' : 
                       metrics.domainAuthority >= 40 ? 'Good' : 'Needs improvement'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Key Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Page Authority</span>
                      <span className={`text-sm font-medium ${getScoreText(metrics.pageAuthority)}`}>
                        {metrics.pageAuthority}/100
                      </span>
                    </div>
                    <Progress value={metrics.pageAuthority} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Spam Score</span>
                      <span className={`text-sm font-medium ${
                        metrics.spamScore < 3 ? "text-green-600" : 
                        metrics.spamScore < 6 ? "text-amber-500" : 
                        "text-red-600"
                      }`}>
                        {metrics.spamScore}/10
                      </span>
                    </div>
                    <Progress 
                      value={metrics.spamScore * 10} 
                      className="h-2" 
                      indicatorClassName={
                        metrics.spamScore < 3 ? "bg-green-600" : 
                        metrics.spamScore < 6 ? "bg-amber-500" : 
                        "bg-red-600"
                      }
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="text-sm font-medium">Backlinks</div>
                      <div className="text-2xl font-bold">{formatNumber(metrics.backlinks)}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium">Ranking Keywords</div>
                      <div className="text-2xl font-bold">{formatNumber(metrics.rankingKeywords)}</div>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="text-sm font-medium">Est. Monthly Traffic</div>
                      <div className="text-2xl font-bold">{formatNumber(metrics.organicTraffic)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Competitor Analysis</h3>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domain</TableHead>
                      <TableHead className="text-right">DA</TableHead>
                      <TableHead className="text-right">PA</TableHead>
                      <TableHead className="text-right">Backlinks</TableHead>
                      <TableHead className="text-right">Keywords</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-muted/30">
                      <TableCell className="font-medium">{metrics.domain}</TableCell>
                      <TableCell className="text-right font-bold">{metrics.domainAuthority}</TableCell>
                      <TableCell className="text-right">{metrics.pageAuthority}</TableCell>
                      <TableCell className="text-right">{formatNumber(metrics.backlinks)}</TableCell>
                      <TableCell className="text-right">{formatNumber(metrics.rankingKeywords)}</TableCell>
                    </TableRow>
                    {competitorMetrics.map((competitor, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{competitor.domain}</TableCell>
                        <TableCell className="text-right">{competitor.domainAuthority}</TableCell>
                        <TableCell className="text-right">{competitor.pageAuthority}</TableCell>
                        <TableCell className="text-right">{formatNumber(competitor.backlinks)}</TableCell>
                        <TableCell className="text-right">{formatNumber(competitor.rankingKeywords)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Demo Data</p>
              <p className="text-sm">This is simulated data for demonstration purposes. In a real application, this would require API access to SEO data providers like Moz, Ahrefs, or SEMrush.</p>
            </div>
          </div>
        </div>
      )}

      {!isChecking && !metrics && (
        <div className="bg-muted/50 border rounded-lg p-8 text-center">
          <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
          <p className="text-muted-foreground">
            Enter a domain name and click "Check Authority" to analyze its SEO metrics and authority.
          </p>
        </div>
      )}
    </div>
  );
};

export default DomainAuthorityChecker;
