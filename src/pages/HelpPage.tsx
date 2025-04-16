
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HelpPage = () => {
  const [searchPincode, setSearchPincode] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchPincode.trim()) {
      navigate(`/alerts?pincode=${searchPincode.trim()}`);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Help & Information</h1>
      
      {/* Pincode Search */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Your Area</CardTitle>
          <CardDescription>Find problems reported in your neighborhood by pincode</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter pincode..."
              value={searchPincode}
              onChange={(e) => setSearchPincode(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Help Tabs */}
      <Tabs defaultValue="citizens">
        <TabsList className="mb-4">
          <TabsTrigger value="citizens">For Citizens</TabsTrigger>
          <TabsTrigger value="councils">For Councils</TabsTrigger>
          <TabsTrigger value="terms">Terms of Use</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="citizens">
          <Card>
            <CardHeader>
              <CardTitle>For Citizens</CardTitle>
              <CardDescription>How to effectively use StreetSense</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Reporting Issues</h3>
              <p>
                StreetSense empowers you to report local infrastructure issues directly to the relevant authorities.
                Follow these steps to report a problem:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Create an account or log in to your existing account</li>
                <li>Click on "Report Problem" in the navigation menu</li>
                <li>Fill in the details about the issue, including its location and category</li>
                <li>Upload photos if available to help illustrate the problem</li>
                <li>Submit your report</li>
              </ol>
              
              <h3 className="text-xl font-semibold mt-6">Tracking Issues</h3>
              <p>
                You can track the status of reported issues in your area:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the pincode search to find issues in your area</li>
                <li>Check the status indicators on the map (yellow = reported, blue = in progress, green = resolved)</li>
                <li>Upvote important issues to bring them to the attention of authorities</li>
                <li>Receive notifications when there are updates to issues you've reported</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="councils">
          <Card>
            <CardHeader>
              <CardTitle>For Councils & Local Authorities</CardTitle>
              <CardDescription>How StreetSense helps manage local infrastructure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Benefits</h3>
              <p>
                StreetSense offers numerous benefits to councils and local authorities:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Direct citizen engagement for infrastructure issues</li>
                <li>Data-driven insights into problem areas</li>
                <li>Efficient issue tracking and management</li>
                <li>Reduced administrative overhead through digital reporting</li>
                <li>Increased transparency in problem resolution</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6">Getting Started</h3>
              <p>
                For councils interested in integrating with StreetSense:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact our team at councils@streetsense.org</li>
                <li>Request admin access for your council area</li>
                <li>Set up your team members with appropriate permissions</li>
                <li>Start responding to citizen reports</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6">API Integration</h3>
              <p>
                StreetSense offers API integration for councils with existing systems. For documentation and access, please contact our technical team.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle>Terms of Use</CardTitle>
              <CardDescription>Please read our terms carefully</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Acceptable Use</h3>
              <p>
                When using StreetSense, you agree to the following terms:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Report genuine infrastructure issues with accurate information</li>
                <li>Provide location data that correctly identifies the problem area</li>
                <li>Upload only appropriate images that illustrate the reported issue</li>
                <li>Respect privacy and avoid capturing identifiable individuals in photos</li>
                <li>Use respectful language in all descriptions and communications</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6">Data Privacy</h3>
              <p>
                We value your privacy and manage your data responsibly:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal information is only used for account management and issue reporting</li>
                <li>Location data is used solely for identifying and resolving reported problems</li>
                <li>We do not sell or share your personal data with third parties except as required for service delivery</li>
                <li>You can request deletion of your account and personal data at any time</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6">Liability</h3>
              <p>
                StreetSense serves as a reporting platform and:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Does not guarantee that reported issues will be resolved</li>
                <li>Is not responsible for actions or inactions of local authorities</li>
                <li>Cannot verify the accuracy of all reported problems</li>
                <li>Provides the service "as is" without warranties of any kind</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faqs">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions about using StreetSense</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">How long does it take for a reported issue to be addressed?</h3>
                <p className="mt-1">
                  The timeframe for addressing issues varies based on the problem type, severity, and the responsible local authority's resources. StreetSense helps track progress but doesn't control resolution timelines.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Can I report issues anonymously?</h3>
                <p className="mt-1">
                  While you need an account to report issues for verification purposes, your personal information is not publicly displayed with your reports. Other users will only see that an issue was reported but not who reported it.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">What happens if I report an emergency?</h3>
                <p className="mt-1">
                  StreetSense is not an emergency response system. For urgent matters requiring immediate attention (like burst water mains, gas leaks, or safety hazards), please contact your local emergency services directly.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">How do I update or remove a report I've submitted?</h3>
                <p className="mt-1">
                  You can edit your reports from your user profile within 24 hours of submission. After this period, contact our support team if you need to make critical changes or remove a report.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">How does upvoting work?</h3>
                <p className="mt-1">
                  Upvoting helps prioritize issues that affect multiple residents. When you upvote a problem, it signals to authorities that the issue impacts more people and may need faster attention.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpPage;
