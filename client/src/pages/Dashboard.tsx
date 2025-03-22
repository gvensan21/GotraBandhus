import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  
  // Placeholder stats for dashboard
  const stats = [
    {
      title: "Family Members",
      count: 24,
      trend: "+3 new",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      title: "Connected Trees",
      count: 2,
      trend: "+1 new",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      )
    },
    {
      title: "Pending Invitations",
      count: 5,
      trend: "2 days",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
          <rect width="20" height="16" x="2" y="4" rx="2"></rect>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
      )
    }
  ];

  const activities = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <line x1="19" x2="19" y1="8" y2="14"></line>
          <line x1="22" x2="16" y1="11" y2="11"></line>
        </svg>
      ),
      text: "You added <span class='font-medium'>Sarah Johnson</span> to your family tree",
      time: "2 hours ago"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      ),
      text: "<span class='font-medium'>Robert Smith</span> accepted your connection request",
      time: "Yesterday"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
          <path d="m15 5 4 4"></path>
        </svg>
      ),
      text: "You updated <span class='font-medium'>Emily Wilson's</span> information",
      time: "3 days ago"
    }
  ];

  const events = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cake">
          <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"></path>
          <path d="M4 21h16"></path>
          <path d="M2 21h20"></path>
          <path d="M7 13v-2a5 5 0 0 1 10 0v2"></path>
        </svg>
      ),
      text: "<span class='font-medium'>David Johnson's</span> Birthday",
      time: "Tomorrow"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
        </svg>
      ),
      text: "<span class='font-medium'>Mark & Lisa Wilson's</span> Anniversary",
      time: "Next Week"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cake">
          <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"></path>
          <path d="M4 21h16"></path>
          <path d="M2 21h20"></path>
          <path d="M7 13v-2a5 5 0 0 1 10 0v2"></path>
        </svg>
      ),
      text: "<span class='font-medium'>Sarah Johnson's</span> Birthday",
      time: "In 2 weeks"
    }
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-primary mb-6">Welcome, {user?.name}!</h1>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 font-medium">{stat.title}</h3>
                <span className="p-2 bg-blue-100 rounded-full text-blue-600">
                  {stat.icon}
                </span>
              </div>
              <div className="flex items-end">
                <span className="text-3xl font-bold text-primary">{stat.count}</span>
                <span className="text-sm text-green-600 ml-2 pb-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up mr-1">
                    <path d="m5 12 7-7 7 7"></path>
                    <path d="M12 19V5"></path>
                  </svg>
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Recent activity and upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <Card className="bg-white">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3 text-blue-600">
                    {activity.icon}
                  </div>
                  <div>
                    <p className="text-gray-900" dangerouslySetInnerHTML={{ __html: activity.text }}></p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-blue-600 hover:underline text-sm font-medium flex items-center">
              View all activity
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-1">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </CardContent>
        </Card>
        
        {/* Upcoming events */}
        <Card className="bg-white">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-orange-100 p-2 rounded-full mr-3 text-orange-600">
                    {event.icon}
                  </div>
                  <div>
                    <p className="text-gray-900" dangerouslySetInnerHTML={{ __html: event.text }}></p>
                    <p className="text-sm text-gray-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-blue-600 hover:underline text-sm font-medium flex items-center">
              View all events
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-1">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
