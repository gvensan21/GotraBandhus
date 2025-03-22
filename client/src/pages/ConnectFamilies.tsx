import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ConnectFamilies() {
  return (
    <Layout>
      <div className="pb-6">
        <h1 className="text-2xl font-bold text-primary mb-4">Connect Families</h1>
        <p className="text-gray-600 mb-6">Link with existing family trees to discover extended relationships.</p>
        
        <Tabs defaultValue="discover" className="w-full mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="requests">Connection Requests</TabsTrigger>
            <TabsTrigger value="connected">Connected Trees</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover">
            <Card>
              <CardContent className="pt-6">
                <div className="bg-gray-100 p-8 rounded-md flex flex-col items-center justify-center min-h-[300px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link mb-4 text-gray-400">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  <p className="text-gray-500 text-center mb-4">Find other family trees that might connect with yours</p>
                  <Button>Start Discovering</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requests">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Incoming Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-500 text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-inbox mx-auto mb-2">
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <p>No incoming connection requests</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Outgoing Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-500 text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send mx-auto mb-2">
                    <path d="m22 2-7 20-4-9-9-4Z"></path>
                    <path d="M22 2 11 13"></path>
                  </svg>
                  <p>No outgoing connection requests</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="connected">
            <Card>
              <CardContent className="pt-6">
                <div className="bg-gray-100 p-8 rounded-md flex flex-col items-center justify-center min-h-[300px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-git-merge mb-4 text-gray-400">
                    <circle cx="18" cy="18" r="3"></circle>
                    <circle cx="6" cy="6" r="3"></circle>
                    <path d="M6 21V9a9 9 0 0 0 9 9"></path>
                  </svg>
                  <p className="text-gray-500 text-center">You haven't connected with any family trees yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info mr-2 text-blue-600">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
                How Connections Work
              </h3>
              <p className="text-sm text-gray-600">
                Connecting families allows you to discover extended relationships and build a more complete picture of your ancestry.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield mr-2 text-blue-600">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                </svg>
                Privacy & Security
              </h3>
              <p className="text-sm text-gray-600">
                You control what information is shared when connecting families. Adjust privacy settings at any time.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search mr-2 text-blue-600">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                </svg>
                Find by ID
              </h3>
              <div className="text-sm text-gray-600 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter family tree ID" 
                  className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button size="sm">
                  Find
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
