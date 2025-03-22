import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FamilyTree() {
  return (
    <Layout>
      <div className="pb-6">
        <h1 className="text-2xl font-bold text-primary mb-4">My Family Tree</h1>
        <p className="text-gray-600 mb-6">Create, visualize, and manage your family tree.</p>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus mr-2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" x2="19" y1="8" y2="14"></line>
              <line x1="22" x2="16" y1="11" y2="11"></line>
            </svg>
            Add Family Member
          </Button>
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download mr-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" x2="12" y1="15" y2="3"></line>
            </svg>
            Export Tree
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="bg-gray-100 p-8 rounded-md flex flex-col items-center justify-center min-h-[400px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-git-branch-plus mb-4 text-gray-400">
                <path d="M6 3v12"></path>
                <path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                <path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                <path d="M15 6a9 9 0 0 0-9 9"></path>
                <path d="M18 15v6"></path>
                <path d="M21 18h-6"></path>
              </svg>
              <p className="text-gray-500 text-center mb-4">Start building your family tree by adding your first family member</p>
              <Button>Add Family Member</Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info mr-2 text-blue-600">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
                Tips for Building
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Start with yourself and immediate family
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Add basic information first, details later
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Save regularly to prevent data loss
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link mr-2 text-blue-600">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                Connect with Others
              </h3>
              <p className="text-sm text-gray-600 mb-2">Discover and connect with other family trees that might be related to yours.</p>
              <Button variant="outline" size="sm" className="w-full">Find Connections</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users mr-2 text-blue-600">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Invite Family
              </h3>
              <p className="text-sm text-gray-600 mb-2">Collaborate with family members to build a more complete tree.</p>
              <Button variant="outline" size="sm" className="w-full">Send Invitations</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
