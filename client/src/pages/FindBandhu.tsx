import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FindBandhu() {
  return (
    <Layout>
      <div className="pb-6">
        <h1 className="text-2xl font-bold text-primary mb-4">Find Your Bandhu</h1>
        <p className="text-gray-600 mb-6">Search for family members and discover connections.</p>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input 
                  placeholder="Search by name, location, or relationship" 
                  className="w-full"
                />
              </div>
              <Button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search mr-2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                </svg>
                Search
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-500 mr-2">Popular searches:</span>
              <Button variant="outline" size="sm">Surname</Button>
              <Button variant="outline" size="sm">Location</Button>
              <Button variant="outline" size="sm">Birth Year</Button>
              <Button variant="outline" size="sm">Relationship</Button>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="people" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="families">Families</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="people">
            <div className="bg-gray-100 p-8 rounded-md flex flex-col items-center justify-center min-h-[300px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search mb-4 text-gray-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
              </svg>
              <p className="text-gray-500 text-center">Search for people to see results</p>
            </div>
          </TabsContent>
          
          <TabsContent value="families">
            <div className="bg-gray-100 p-8 rounded-md flex flex-col items-center justify-center min-h-[300px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users mb-4 text-gray-400">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <p className="text-gray-500 text-center">Search for families to see results</p>
            </div>
          </TabsContent>
          
          <TabsContent value="connections">
            <div className="bg-gray-100 p-8 rounded-md flex flex-col items-center justify-center min-h-[300px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-git-branch mb-4 text-gray-400">
                <line x1="6" x2="6" y1="3" y2="15"></line>
                <circle cx="18" cy="6" r="3"></circle>
                <circle cx="6" cy="18" r="3"></circle>
                <path d="M18 9a9 9 0 0 1-9 9"></path>
              </svg>
              <p className="text-gray-500 text-center">Search for connections to see results</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lightbulb mr-2 text-blue-600">
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                  <path d="M9 18h6"></path>
                  <path d="M10 22h4"></path>
                </svg>
                Search Tips
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Use full names for more accurate results
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Include location to narrow down results
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Try different name variations if no results found
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history mr-2 text-blue-600">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                  <path d="M12 7v5l4 2"></path>
                </svg>
                Recent Searches
              </h3>
              <p className="text-sm text-gray-500 italic">No recent searches yet</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
