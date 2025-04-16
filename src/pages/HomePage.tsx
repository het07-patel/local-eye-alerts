
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, AlertTriangle, Plus, Building, Droplet, Road, Trash2 } from "lucide-react";
import { Problem } from "@/lib/types";
import { getProblems } from "@/lib/mockData";
import Map from "@/components/Map";

// Surat coordinates
const SURAT_COORDINATES = { lat: 21.1702, lng: 72.8311 };

const HomePage = () => {
  const [recentProblems, setRecentProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    const fetchProblems = async () => {
      try {
        const problems = await getProblems();
        // Sort by most recent
        const sorted = [...problems].sort(
          (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
        );
        setRecentProblems(sorted.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching problems:", error);
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return "bg-yellow-500";
      case "in-progress":
        return "bg-blue-500";
      case "resolved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "1":
        return <Road className="h-4 w-4 mr-2" />;
      case "2":
        return <Trash2 className="h-4 w-4 mr-2" />;
      case "3":
        return <Building className="h-4 w-4 mr-2" />;
      case "4":
        return <Building className="h-4 w-4 mr-2" />;
      case "5":
        return <Droplet className="h-4 w-4 mr-2" />;
      default:
        return <MapPin className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="space-y-8">
      <section className="text-center py-10 bg-gradient-to-b from-primary/20 to-transparent rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Surat Local Eye</h1>
        <p className="text-xl max-w-2xl mx-auto mb-6">
          Report and track local issues in Surat. Together we can make our city better.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {isLoggedIn ? (
            <Button asChild size="lg">
              <Link to="/report" className="flex items-center gap-2">
                <Plus size={20} />
                Report a Problem
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link to="/auth" className="flex items-center gap-2">
                Sign In to Report Issues
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" size="lg">
            <Link to="/alerts">View Local Alerts</Link>
          </Button>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recent Reports in Surat</h2>
            <Link to="/alerts" className="text-primary hover:underline">
              View all
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProblems.map((problem) => (
                <Card key={problem.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{problem.title}</CardTitle>
                      <Badge className={getStatusColor(problem.status)}>
                        {problem.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <div className="flex items-center">
                        {getCategoryIcon(problem.category)}
                        <MapPin className="h-3 w-3 mr-1" />
                        {problem.location.address}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="line-clamp-2">{problem.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Reported {formatDate(problem.reportedAt)}
                    </span>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/problem/${problem.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {recentProblems.length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">No problems reported yet</p>
                    <p className="text-muted-foreground mb-4">
                      Be the first to report a problem in Surat
                    </p>
                    {isLoggedIn ? (
                      <Button asChild>
                        <Link to="/report">Report a Problem</Link>
                      </Button>
                    ) : (
                      <Button asChild>
                        <Link to="/auth">Sign In to Report</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Surat City Map</h2>
          <div className="h-[500px] rounded-lg overflow-hidden border">
            <Map 
              problems={recentProblems} 
              center={SURAT_COORDINATES}
              zoom={13}
              showCategoryMarkers={true}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
