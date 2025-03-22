import { Button } from "@/components/ui/button";

export default function VisualizationPreview() {
  return (
    <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-4">Family Tree Visualization</h2>
          <p className="text-lg text-gray-600 mb-6">Explore your family connections with interactive visualizations that bring your ancestry to life.</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </span>
              <span>Zoom, pan, and navigate through your family tree</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </span>
              <span>Expand and collapse branches to focus on specific relationships</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </span>
              <span>View detailed information about each family member</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </span>
              <span>Timeline view for historical perspective</span>
            </li>
          </ul>
          <Button>Try Demo</Button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-md mb-4 h-64 flex items-center justify-center">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-git-branch mx-auto mb-4 text-blue-500">
                <line x1="6" x2="6" y1="3" y2="15"></line>
                <circle cx="18" cy="6" r="3"></circle>
                <circle cx="6" cy="18" r="3"></circle>
                <path d="M18 9a9 9 0 0 1-9 9"></path>
              </svg>
              <p className="text-gray-600">Interactive family tree visualization</p>
            </div>
          </div>
          <div className="flex justify-center space-x-3 mt-2">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minus">
                <path d="M5 12h14"></path>
              </svg>
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-move">
                <path d="M5 9l-3 3 3 3"></path>
                <path d="M9 5l3-3 3 3"></path>
                <path d="M15 19l3 3 3-3"></path>
                <path d="M19 15l3-3-3-3"></path>
                <path d="M2 12h20"></path>
                <path d="M12 2v20"></path>
              </svg>
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-maximize">
                <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
                <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
                <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
                <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
