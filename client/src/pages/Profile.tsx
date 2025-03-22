import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState<Date>();
  
  // Initialize form data with user details or empty values
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    nickname: "",
    email: user?.email || "",
    phone: "",
    gender: "male",
    gotra: "",
    pravara: "",
    birthCity: "",
    birthState: "",
    birthCountry: "",
    currentCity: "",
    currentState: "",
    currentCountry: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would normally save the data to the server
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully."
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-muted-foreground">This is your full legal name.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nickname">Nickname</Label>
                <Input 
                  id="nickname"
                  name="nickname"
                  placeholder="Enter your nickname (optional)"
                  value={formData.nickname}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  name="phone"
                  placeholder="Phone number (optional)"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select 
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>mm/dd/yyyy</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gotra">Gotra</Label>
                <Input 
                  id="gotra"
                  name="gotra"
                  placeholder="Enter your gotra (optional)"
                  value={formData.gotra}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pravara">Pravara</Label>
                <Input 
                  id="pravara"
                  name="pravara"
                  placeholder="Enter your pravara (optional)"
                  value={formData.pravara}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Birth Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Birth Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="birthCity">City</Label>
                <Input 
                  id="birthCity"
                  name="birthCity"
                  placeholder="Birth city"
                  value={formData.birthCity}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthState">State</Label>
                <Input 
                  id="birthState"
                  name="birthState"
                  placeholder="Birth state"
                  value={formData.birthState}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthCountry">Country</Label>
                <Input 
                  id="birthCountry"
                  name="birthCountry"
                  placeholder="Birth country"
                  value={formData.birthCountry}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Current Location */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currentCity">City</Label>
                <Input 
                  id="currentCity"
                  name="currentCity"
                  placeholder="Current city"
                  value={formData.currentCity}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentState">State</Label>
                <Input 
                  id="currentState"
                  name="currentState"
                  placeholder="Current state"
                  value={formData.currentState}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentCountry">Country</Label>
                <Input 
                  id="currentCountry"
                  name="currentCountry"
                  placeholder="Current country"
                  value={formData.currentCountry}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit" size="lg">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}