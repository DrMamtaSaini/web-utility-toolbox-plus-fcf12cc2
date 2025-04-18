
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Printer, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PrivacyPolicyData } from "@/types/privacy-policy";
import PrivacyPolicyContent from "@/components/privacy-policy/PrivacyPolicyContent";

const PrivacyPolicyGenerator = () => {
  const { toast } = useToast();
  const [policyData, setPolicyData] = useState<PrivacyPolicyData>({
    companyName: "",
    websiteUrl: "",
    contactEmail: "",
    dataCollected: ["Personal Information", "Usage Data", "Cookies"],
    usageTracking: false,
    thirdPartySharing: false,
    cookiesUsage: true,
    lastUpdated: new Date().toISOString().split('T')[0],
  });

  const policyRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!policyData.companyName || !policyData.websiteUrl) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in the company name and website URL before printing.",
      });
      return;
    }

    const content = document.createElement('div');
    if (policyRef.current) {
      content.innerHTML = policyRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = content.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="h-10 w-10 text-primary" />
          <h1 className="text-2xl font-bold">Privacy Policy Generator</h1>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={() => {
            toast({
              title: "Policy Saved",
              description: "Your privacy policy has been saved successfully.",
            });
          }}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-6 print:hidden">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Company Name</Label>
            <Input
              value={policyData.companyName}
              onChange={(e) => setPolicyData({ ...policyData, companyName: e.target.value })}
              placeholder="Your Company Name"
            />
          </div>
          <div>
            <Label>Website URL</Label>
            <Input
              value={policyData.websiteUrl}
              onChange={(e) => setPolicyData({ ...policyData, websiteUrl: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          <div>
            <Label>Contact Email</Label>
            <Input
              type="email"
              value={policyData.contactEmail}
              onChange={(e) => setPolicyData({ ...policyData, contactEmail: e.target.value })}
              placeholder="privacy@example.com"
            />
          </div>
          <div>
            <Label>Last Updated</Label>
            <Input
              type="date"
              value={policyData.lastUpdated}
              onChange={(e) => setPolicyData({ ...policyData, lastUpdated: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Data Collection & Usage</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="usageTracking"
                checked={policyData.usageTracking}
                onCheckedChange={(checked) => 
                  setPolicyData({ ...policyData, usageTracking: checked as boolean })
                }
              />
              <label htmlFor="usageTracking">We track user activity on our website</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="thirdPartySharing"
                checked={policyData.thirdPartySharing}
                onCheckedChange={(checked) => 
                  setPolicyData({ ...policyData, thirdPartySharing: checked as boolean })
                }
              />
              <label htmlFor="thirdPartySharing">We share data with third parties</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cookiesUsage"
                checked={policyData.cookiesUsage}
                onCheckedChange={(checked) => 
                  setPolicyData({ ...policyData, cookiesUsage: checked as boolean })
                }
              />
              <label htmlFor="cookiesUsage">We use cookies on our website</label>
            </div>
          </div>
        </div>
      </div>

      <div ref={policyRef} className="border rounded-lg mt-8">
        <PrivacyPolicyContent data={policyData} />
      </div>
    </div>
  );
};

export default PrivacyPolicyGenerator;
