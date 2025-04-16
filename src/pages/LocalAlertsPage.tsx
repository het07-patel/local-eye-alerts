
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Search, Filter, AlertTriangle, FileText } from "lucide-react";
import { Problem } from "@/lib/types";
import { getLocalAlerts, categories } from "@/lib/mockData";
import Map from "@/components/Map";

const LocalAlertsPage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all-categories");
  const [statusFilter, setStatusFilter] = useState("all-statuses");
  const [userLocation, setUserLocation] = useState({ lat: 40.7128, lng: -74.006 });

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // Try to get user's location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            loadProblems(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error("Error getting location:", error);
            loadProblems(userLocation.lat, userLocation.lng);
          }
        );
      } catch (error) {
        console.error("Error setting up geolocation:", error);
        loadProblems(userLocation.lat, userLocation.lng);
      }
    };

    const loadProblems = async (lat: number, lng: number) => {
      try {
        const data = await getLocalAlerts(lat, lng);
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const filteredProblems = problems.filter((problem) => {
    // Apply text search
    const matchesSearch = searchTerm
      ? problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    // Apply category filter
    const matchesCategory = categoryFilter === "all-categories" ? true : problem.category === categoryFilter;

    // Apply status filter
    const matchesStatus = statusFilter === "all-statuses" ? true : problem.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleGenerateReport = () => {
    // In a real app, you would generate a PDF or other report format
    // For this example, we'll just create a text file
    
    const reportText = `
      LOCAL AREA ALERTS REPORT
      ------------------------
      Generated on: ${new Date().toLocaleDateString()}
      
      SUMMARY:
      Total Problems: ${filteredProblems.length}
      Reported: ${filteredProblems.filter(p => p.status === "reported").length}
      In Progress: ${filteredProblems.filter(p => p.status === "in-progress").length}
      Resolved: ${filteredProblems.filter(p => p.status === "resolved").length}
      
      PROBLEMS:
      ${filteredProblems.map((problem, index) => `
      ${index + 1}. ${problem.title}
      Status: ${problem.status}
      Location: ${problem.location.address}
      Reported on: ${new Date(problem.reportedAt).toLocaleDateString()}
      Description: ${problem.description.substring(0, 100)}...
      `).join("\n")}
    `;
    
    // Create a download link
    const element = document.createElement("a");
    const file = new Blob([reportText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "local-alerts-report.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Local Alerts</h1>
          <p className="text-muted-foreground">
            View and track problems reported in your area
          </p>
        </div>
        
        <Button
          onClick={handleGenerateReport}
          className="flex items-center"
          disabled={filteredProblems.length === 0}
        >
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Filter Alerts</CardTitle>
          <CardDescription>Narrow down the results by searching or filtering</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by title, description or location..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">All Statuses</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="list">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6 pt-4">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredProblems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProblems.map((problem) => (
                <Card key={problem.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-1">
                        {problem.title}
                      </CardTitle>
                      <Badge className={getStatusColor(problem.status)}>
                        {problem.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {problem.location.address}
                    </CardDescription>
                  </CardHeader>
                  
                  {problem.imageUrl && (
                    <div className="px-6">
                      <img
                        src={problem.imageUrl}
                        alt={problem.title}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                  
                  <CardContent className="py-4 flex-grow">
                    <p className="line-clamp-3 text-sm">{problem.description}</p>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between items-center pt-0">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(problem.reportedAt)}
                    </span>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/problem/${problem.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No alerts found</p>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || categoryFilter || statusFilter
                    ? "Try adjusting your filters"
                    : "No problems have been reported in your area"}
                </p>
                <Button asChild>
                  <Link to="/report">Report a Problem</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="map" className="pt-4">
          <Card>
            <CardContent className="p-0 relative">
              <div className="h-[600px]">
                <Map
                  problems={filteredProblems}
                  center={userLocation}
                  zoom={13}
                />
              </div>
              
              <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                <p className="font-medium mb-2">
                  {filteredProblems.length} problems found
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span>
                      {filteredProblems.filter((p) => p.status === "reported").length} Reported
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                    <span>
                      {filteredProblems.filter((p) => p.status === "in-progress").length} In Progress
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                    <span>
                      {filteredProblems.filter((p) => p.status === "resolved").length} Resolved
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocalAlertsPage;
