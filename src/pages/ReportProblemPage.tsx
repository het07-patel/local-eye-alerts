
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { AlertTriangle, Upload, MapPin } from "lucide-react";
import { categories, addProblem } from "@/lib/mockData";
import Map from "@/components/Map";

const ReportProblemPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    // In a real app, you would use reverse geocoding to get the address
    setAddress(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category || !address || !selectedLocation) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields and select a location on the map.",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, you would upload the image to storage first
      // and get a URL back
      const mockImageUrl = previewUrl || "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05";
      
      const newProblem = await addProblem({
        title,
        description,
        category,
        status: "reported",
        imageUrl: mockImageUrl,
        location: {
          address,
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        },
        reportedBy: "Anonymous User", // In a real app, use authenticated user
      });
      
      toast({
        title: "Problem Reported",
        description: "Your problem has been successfully reported.",
      });
      
      // Navigate to the problem details page
      navigate(`/problem/${newProblem.id}`);
    } catch (error) {
      console.error("Error submitting problem:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error submitting your problem. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Report a Problem</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Problem Details</CardTitle>
              <CardDescription>
                Provide information about the problem you're reporting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief title of the problem"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the problem"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>
                Select the location of the problem on the map
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[300px] rounded-md overflow-hidden border">
                <Map
                  onMapClick={handleMapClick}
                  selectedLocation={selectedLocation}
                  zoom={13}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="address"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      // In a real app, this would use geolocation
                      setSelectedLocation({ lat: 40.7128, lng: -74.006 });
                      setAddress("Current Location");
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Use My Location
                  </Button>
                </div>
              </div>
              
              {!selectedLocation && (
                <div className="flex items-center p-2 text-amber-600 bg-amber-50 rounded-md">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="text-sm">Click on the map to select a location</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Image</CardTitle>
              <CardDescription>
                Upload an image of the problem (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center w-full">
                <Label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or GIF (MAX. 5MB)
                      </p>
                    </div>
                  )}
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <CardFooter className="px-0 pt-4 pb-10 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
};

export default ReportProblemPage;
