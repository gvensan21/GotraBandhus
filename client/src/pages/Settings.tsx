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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, ShieldAlert } from "lucide-react";
import { ProfileUpdateInput } from "../../../shared/schema";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form data with default values
  const [formData, setFormData] = useState({
    hideEmail: false,
    hidePhone: false,
    hideDob: false
  });

  // Fetch user profile data
  const { data: profileData, isLoading } = useQuery<{ profile: ProfileUpdateInput }>({
    queryKey: ['/api/user/profile'],
    staleTime: 30000,
    retry: 1
  });

  // Update profile mutation
  const updatePrivacySettings = useMutation({
    mutationFn: async (profileData: ProfileUpdateInput) => {
      const response = await apiRequest('PUT', '/api/user/profile', profileData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Privacy settings updated",
        description: "Your privacy settings have been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update privacy settings",
        variant: "destructive"
      });
    }
  });

  // When profile data is loaded, update the form
  useEffect(() => {
    if (profileData?.profile) {
      const profile = profileData.profile;
      
      setFormData({
        hideEmail: profile.hideEmail || false,
        hidePhone: profile.hidePhone || false,
        hideDob: profile.hideDob || false
      });
    }
  }, [profileData]);

  // Handle switch changes
  const handleSwitchChange = (field: string, checked: boolean) => {
    setFormData({
      ...formData,
      [field]: checked
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // We need the current profile data to update the privacy settings
      if (!profileData?.profile) {
        toast({
          title: "Error",
          description: "Could not retrieve your profile data. Please try again later.",
          variant: "destructive"
        });
        return;
      }
      
      // Create a copy of the profile with updated privacy settings
      const profile = profileData.profile;
      
      const updateData: ProfileUpdateInput = {
        // Required fields with defaults in case they're somehow undefined
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        nickname: profile.nickname || "",
        email: profile.email || "",
        phone: profile.phone || "",
        gender: profile.gender || "male",
        currentCity: profile.currentCity || "",
        currentState: profile.currentState || "",
        currentCountry: profile.currentCountry || "",
        gotra: profile.gotra || "",
        pravara: profile.pravara || "",
        primaryLanguage: profile.primaryLanguage || "",
        community: profile.community || "",
        // Update privacy settings
        hideEmail: formData.hideEmail,
        hidePhone: formData.hidePhone,
        hideDob: formData.hideDob,
        // Include optional fields if they exist
        dateOfBirth: profile.dateOfBirth,
        birthCity: profile.birthCity,
        birthState: profile.birthState,
        birthCountry: profile.birthCountry,
        occupation: profile.occupation,
        company: profile.company,
        industry: profile.industry,
        secondaryLanguage: profile.secondaryLanguage,
        bio: profile.bio
      };
      
      await updatePrivacySettings.mutateAsync(updateData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldAlert className="mr-2 h-5 w-5" />
              Privacy Settings
            </CardTitle>
            <CardDescription>
              Control what information is visible to other users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hideEmail">Hide Email Address</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep your email address private from other users
                  </p>
                </div>
                <Switch
                  id="hideEmail"
                  checked={formData.hideEmail}
                  onCheckedChange={(checked) => handleSwitchChange("hideEmail", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hidePhone">Hide Phone Number</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep your phone number private from other users
                  </p>
                </div>
                <Switch
                  id="hidePhone"
                  checked={formData.hidePhone}
                  onCheckedChange={(checked) => handleSwitchChange("hidePhone", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hideDob">Hide Date of Birth</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep your date of birth private from other users
                  </p>
                </div>
                <Switch
                  id="hideDob"
                  checked={formData.hideDob}
                  onCheckedChange={(checked) => handleSwitchChange("hideDob", checked)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-6">
            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting || updatePrivacySettings.isPending}
            >
              {(isSubmitting || updatePrivacySettings.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Privacy Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Change Password</h3>
            <p className="text-sm text-muted-foreground">
              This feature will be available in a future update
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              This feature will be available in a future update
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}