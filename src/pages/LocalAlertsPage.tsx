
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { getProblems, searchByPincode } from "@/lib/api";
import Map from "@/components/Map";
import { Problem } from "@/lib/types";
import { Search, AlertCircle, MapPin } from "lucide-react";

const LocalAlertsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pincode = searchParams.get("pincode") || "";
  const [searchValue, setSearchValue] = useState(pincode);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  
  // Get all problems or search by pincode
  const { data: problems, isLoading, error } = useQuery({
    queryKey: ["problems", pincode],
    queryFn: async () => {
      if (pincode) {
        return await searchByPincode(pincode);
      } else {
        return await getProblems();
      }
    }
  });
  
  useEffect(() => {
    if (problems) {
      setFilteredProblems(problems);
    }
  }, [problems]);
  
  const handleSearch = () => {
    if (searchValue.trim()) {
      setSearchParams({ pincode: searchValue.trim() });
    } else {
      setSearchParams({});
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Local Alerts</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Find Issues in Your Area</CardTitle>
          <CardDescription>
            Search for reported problems near your location using pincode
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="relative flex-1 max-w-sm">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter pincode..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading the data. Please try again later.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md h-[400px] mb-8">
            <Map problems={filteredProblems} showCategoryMarkers={true} />
          </div>
          
          {pincode && (
            <h2 className="text-xl font-semibold mb-4">
              {filteredProblems.length} {filteredProblems.length === 1 ? 'issue' : 'issues'} found in area with pincode {pincode}
            </h2>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <Card key={problem.id} className="overflow-hidden">
                  {problem.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={problem.imageUrl} 
                        alt={problem.title}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{problem.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{problem.location.address}</p>
                    <p className="text-sm line-clamp-2 mb-3">{problem.description}</p>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        problem.status === 'resolved' 
                          ? 'bg-green-100 text-green-800' 
                          : problem.status === 'in-progress' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {problem.status === 'in-progress' ? 'In Progress' : 
                         problem.status.charAt(0).toUpperCase() + problem.status.slice(1)}
                      </span>
                      <Button variant="link" size="sm" asChild>
                        <a href={`/problem/${problem.id}`}>View Details</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-semibold text-lg">No problems found</h3>
                <p className="text-muted-foreground">
                  {pincode 
                    ? `There are no reported problems in the area with pincode ${pincode}` 
                    : 'Try searching for a specific area using pincode'}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LocalAlertsPage;
