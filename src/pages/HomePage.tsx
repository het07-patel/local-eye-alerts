
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, AlertTriangle, Plus } from "lucide-react";
import { Problem } from "@/lib/types";
import { getProblems } from "@/lib/mockData";
import Map from "@/components/Map";

const HomePage = () => {
  const [recentProblems, setRecentProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <div className="space-y-8">
      <section className="text-center py-10 bg-gradient-to-b from-primary/20 to-transparent rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to Local Eye</h1>
        <p className="text-xl max-w-2xl mx-auto mb-6">
          Report and track local problems in your community. Together we can make our neighborhoods better.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/report" className="flex items-center gap-2">
              <Plus size={20} />
              Report a Problem
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/alerts">View Local Alerts</Link>
          </Button>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recent Reports</h2>
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
                      <MapPin className="h-3 w-3" />
                      {problem.location.address}
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
                      Be the first to report a problem in your area
                    </p>
                    <Button asChild>
                      <Link to="/report">Report a Problem</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Problem Map</h2>
          <div className="h-[500px] rounded-lg overflow-hidden border">
            <Map problems={recentProblems} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
