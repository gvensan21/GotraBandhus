import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ProfileUpdateInput } from "../../../shared/schema";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form data
  const [formData, setFormData] = useState<ProfileUpdateInput>({
    firstName: "",
    lastName: "",
    nickname: "",
    email: "",
    phone: "",
    gender: "male",
    dateOfBirth: "",
    birthCity: "",
    birthState: "",
    birthCountry: "",
    currentCity: "",
    currentState: "",
    currentCountry: "",
    gotra: "",
    pravara: "",
    occupation: "",
    company: "",
    industry: "",
    primaryLanguage: "",
    secondaryLanguage: "",
    community: "",
    hideEmail: false,
    hidePhone: false,
    hideDob: false,
    bio: ""
  });

  // Fetch user profile data
  const { data: profileData, isLoading } = useQuery<{ profile: ProfileUpdateInput }>({
    queryKey: ['/api/user/profile'],
    staleTime: 30000,
    retry: 1
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (profileData: ProfileUpdateInput) => {
      const response = await apiRequest('PUT', '/api/user/profile', profileData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
      
      // If profile is complete and there's a redirect, follow it
      if (data.redirectTo) {
        window.location.href = data.redirectTo;
      }
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive"
      });
    }
  });

  // When profile data is loaded, update the form
  useEffect(() => {
    if (profileData?.profile) {
      const profile = profileData.profile;
      
      // Format date if present
      if (profile.dateOfBirth) {
        try {
          setDate(new Date(profile.dateOfBirth));
        } catch (e) {
          console.error("Invalid date format:", profile.dateOfBirth);
        }
      }
      
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        nickname: profile.nickname || "",
        email: profile.email || user?.email || "",
        phone: profile.phone || "",
        gender: profile.gender || "male",
        dateOfBirth: profile.dateOfBirth || "",
        birthCity: profile.birthCity || "",
        birthState: profile.birthState || "",
        birthCountry: profile.birthCountry || "",
        currentCity: profile.currentCity || "",
        currentState: profile.currentState || "",
        currentCountry: profile.currentCountry || "",
        gotra: profile.gotra || "",
        pravara: profile.pravara || "",
        occupation: profile.occupation || "",
        company: profile.company || "",
        industry: profile.industry || "",
        primaryLanguage: profile.primaryLanguage || "",
        secondaryLanguage: profile.secondaryLanguage || "",
        community: profile.community || "",
        hideEmail: profile.hideEmail || false,
        hidePhone: profile.hidePhone || false,
        hideDob: profile.hideDob || false,
        bio: profile.bio || ""
      });
    }
  }, [profileData, user]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle date changes
  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setFormData({
        ...formData,
        dateOfBirth: selectedDate.toISOString().split('T')[0]
      });
    } else {
      setFormData({
        ...formData,
        dateOfBirth: ""
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateProfile.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile data...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name*</Label>
                <Input 
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-sm text-muted-foreground">Your first legal name.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name*</Label>
                <Input 
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nickname">Nickname*</Label>
                <Input 
                  id="nickname"
                  name="nickname"
                  placeholder="Enter your nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number*</Label>
                <Input 
                  id="phone"
                  name="phone"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender*</Label>
                <Select 
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  required
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
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dateOfBirth"
                      type="button"
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
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primaryLanguage">Primary Language*</Label>
                <Input 
                  id="primaryLanguage"
                  name="primaryLanguage"
                  placeholder="Your primary language"
                  value={formData.primaryLanguage}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryLanguage">Secondary Language</Label>
                <Input 
                  id="secondaryLanguage"
                  name="secondaryLanguage"
                  placeholder="Your secondary language (optional)"
                  value={formData.secondaryLanguage}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Short Bio</Label>
                <Textarea 
                  id="bio"
                  name="bio"
                  placeholder="Tell us a bit about yourself"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="community">Community*</Label>
                <Input 
                  id="community"
                  name="community"
                  placeholder="Your community"
                  value={formData.community}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Cultural Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cultural Information</CardTitle>
            <CardDescription>
              Your heritage details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gotra">Gotra*</Label>
                <Input 
                  id="gotra"
                  name="gotra"
                  placeholder="Enter your gotra"
                  value={formData.gotra}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pravara">Pravara*</Label>
                <Input 
                  id="pravara"
                  name="pravara"
                  placeholder="Enter your pravara"
                  value={formData.pravara}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Birth Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Birth Details</CardTitle>
            <CardDescription>
              Where you were born
            </CardDescription>
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
            <CardDescription>
              Where you currently live
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currentCity">City*</Label>
                <Input 
                  id="currentCity"
                  name="currentCity"
                  placeholder="Current city"
                  value={formData.currentCity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentState">State*</Label>
                <Input 
                  id="currentState"
                  name="currentState"
                  placeholder="Current state"
                  value={formData.currentState}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentCountry">Country*</Label>
                <Input 
                  id="currentCountry"
                  name="currentCountry"
                  placeholder="Current country"
                  value={formData.currentCountry}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Professional Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>
              Your work and career details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input 
                  id="occupation"
                  name="occupation"
                  placeholder="Your occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company"
                  name="company"
                  placeholder="Your company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input 
                  id="industry"
                  name="industry"
                  placeholder="Your industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardFooter className="flex justify-between pt-6">
            <p className="text-sm text-muted-foreground">* Required fields</p>
            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting || updateProfile.isPending}
            >
              {(isSubmitting || updateProfile.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}