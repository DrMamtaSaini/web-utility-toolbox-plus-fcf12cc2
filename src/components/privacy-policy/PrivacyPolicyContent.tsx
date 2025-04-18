
import { PrivacyPolicyData } from "@/types/privacy-policy";

interface PrivacyPolicyContentProps {
  data: PrivacyPolicyData;
}

const PrivacyPolicyContent = ({ data }: PrivacyPolicyContentProps) => {
  // Count active sections to handle numbering
  const getSectionNumber = (() => {
    let count = 1;
    return () => count++;
  })();

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: {data.lastUpdated}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{getSectionNumber()}. Introduction</h2>
        <p>
          Welcome to {data.companyName} ("we," "our," or "us"). This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you visit our website {data.websiteUrl} (the "Website").
          Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy,
          please do not access the Website.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{getSectionNumber()}. Collection of Your Information</h2>
        <p>We may collect information about you in various ways, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          {data.dataCollected.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        {data.customDataCollection && (
          <div className="mt-4">
            <p>{data.customDataCollection}</p>
          </div>
        )}
      </section>

      {data.usageTracking && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{getSectionNumber()}. Usage Tracking</h2>
          <p>
            We use various tracking technologies to monitor and analyze website usage and performance.
            This helps us understand how our users interact with the Website and improve our services.
          </p>
        </section>
      )}

      {data.thirdPartySharing && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{getSectionNumber()}. Third-Party Data Sharing</h2>
          <p>
            We may share your information with third parties who assist us in operating our website,
            conducting our business, or serving our users, so long as those parties agree to keep this
            information confidential.
          </p>
        </section>
      )}

      {data.cookiesUsage && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{getSectionNumber()}. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our Website and hold
            certain information. You can instruct your browser to refuse all cookies or to indicate when
            a cookie is being sent.
          </p>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{getSectionNumber()}. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy, please contact us at:{' '}
          {data.contactEmail || '[Contact Email]'}
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicyContent;
