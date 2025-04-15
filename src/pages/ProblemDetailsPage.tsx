
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Clock, AlertTriangle, Send, FileText, ChevronLeft } from "lucide-react";
import { Problem, Update } from "@/lib/types";
import { getProblemById, addUpdate, updateProblem } from "@/lib/mockData";
import Map from "@/components/Map";

const ProblemDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateContent, setUpdateContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) return;
      
      try {
        const data = await getProblemById(id);
        if (data) {
          setProblem(data);
        } else {
          toast({
            variant: "destructive",
            title: "Problem Not Found",
            description: "The requested problem could not be found.",
          });
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an error loading the problem. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id, navigate]);

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!updateContent.trim() || !problem) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter an update before submitting.",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const newUpdate = await addUpdate(problem.id, {
        content: updateContent,
        author: "You", // In a real app, use authenticated user
      });
      
      setProblem({
        ...problem,
        updates: [...problem.updates, newUpdate],
        updatedAt: new Date().toISOString(),
      });
      
      setUpdateContent("");
      
      toast({
        title: "Update Added",
        description: "Your update has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding update:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error adding your update. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: "reported" | "in-progress" | "resolved") => {
    if (!problem) return;
    
    setUpdatingStatus(true);
    
    try {
      const updatedProblem = await updateProblem(problem.id, { status: newStatus });
      setProblem(updatedProblem);
      
      toast({
        title: "Status Updated",
        description: `Problem status changed to ${newStatus.replace("-", " ")}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error updating the status. Please try again.",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleGenerateReport = () => {
    if (!problem) return;
    
    // In a real app, you would generate a PDF or other report format
    // For this example, we'll just show a toast
    toast({
      title: "Report Generated",
      description: "Problem report has been generated and is ready for download.",
    });
    
    // Create a text report
    const reportText = `
      PROBLEM REPORT
      --------------
      Title: ${problem.title}
      Category: ${problem.category}
      Status: ${problem.status}
      Location: ${problem.location.address}
      Reported by: ${problem.reportedBy}
      Reported on: ${new Date(problem.reportedAt).toLocaleDateString()}
      
      Description:
      ${problem.description}
      
      Updates:
      ${problem.updates.map((update) => `
      [${new Date(update.timestamp).toLocaleDateString()} - ${update.author}]
      ${update.content}
      `).join("\n")}
    `;
    
    // Create a download link
    const element = document.createElement("a");
    const file = new Blob([reportText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `problem-report-${problem.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Problem Not Found</h2>
        <p className="mb-6">The problem you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{problem.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Badge className={getStatusColor(problem.status)}>
                {problem.status.replace("-", " ")}
              </Badge>
              <span className="text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {problem.location.address}
              </span>
              <span className="text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(problem.reportedAt)}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={handleGenerateReport}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            
            <div className="relative">
              <Select
                value={problem.status}
                onValueChange={(value) => 
                  handleStatusChange(value as "reported" | "in-progress" | "resolved")
                }
                disabled={updatingStatus}
              >
                <SelectTrigger className="min-w-[140px]">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              
              {updatingStatus && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="updates">
                Updates ({problem.updates.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6 pt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="whitespace-pre-line">{problem.description}</p>
                </CardContent>
              </Card>
              
              {problem.imageUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle>Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={problem.imageUrl}
                      alt={problem.title}
                      className="w-full h-auto max-h-[400px] object-contain rounded-md"
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="updates" className="space-y-6 pt-4">
              {problem.updates.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">No updates yet</p>
                    <p className="text-muted-foreground mb-4">
                      Be the first to add an update
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Problem Updates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {problem.updates.map((update: Update) => (
                      <div
                        key={update.id}
                        className="p-4 border rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{update.author}</span>
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(update.timestamp)}
                          </span>
                        </div>
                        <p className="whitespace-pre-line">{update.content}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Add Update</CardTitle>
                  <CardDescription>
                    Provide additional information or updates about this problem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddUpdate}>
                    <Textarea
                      placeholder="Enter your update here..."
                      value={updateContent}
                      onChange={(e) => setUpdateContent(e.target.value)}
                      className="mb-4"
                      rows={4}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={submitting}>
                        {submitting ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Update
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] rounded-md overflow-hidden border mb-4">
                <Map 
                  center={{ 
                    lat: problem.location.lat, 
                    lng: problem.location.lng 
                  }}
                  problems={[problem]}
                  zoom={15}
                />
              </div>
              <p className="text-sm text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {problem.location.address}
              </p>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Reported By</p>
                <p>{problem.reportedBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Reported On</p>
                <p>{formatDate(problem.reportedAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p>{formatDate(problem.updatedAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge className={`mt-1 ${getStatusColor(problem.status)}`}>
                  {problem.status.replace("-", " ")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailsPage;
