import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  // Mock data - will be replaced with actual user session data
  const volunteer = {
    firstName: "Ahmad",
    lastName: "Ibrahim",
    email: "ahmad@example.com",
    phone: "+60123456789",
    tier: "GOLD",
    totalHours: 185,
    points: 1850,
    projectsCompleted: 15,
    badges: 8,
    achievements: 12,
    connections: 24,
    skills: ["Event Management", "First Aid", "Teaching"],
    interests: ["Homeless Care", "Food Distribution", "Education"],
    state: "Kuala Lumpur",
    joinedDate: "Jan 2024",
  };

  const recentProjects = [
    { name: "Food Distribution", date: "Nov 10, 2025", hours: 8 },
    { name: "Homeless Care", date: "Nov 3, 2025", hours: 6 },
    { name: "Education Support", date: "Oct 28, 2025", hours: 4 },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {volunteer.firstName} {volunteer.lastName}
            </h1>
            <p className="text-muted-foreground mt-2">
              Member since {volunteer.joinedDate}
            </p>
          </div>
          <Button>Edit Profile</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tier</span>
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold">
                    {volunteer.tier}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Hours</span>
                  <span className="font-bold text-lg">{volunteer.totalHours}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Points</span>
                  <span className="font-bold text-lg">{volunteer.points}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Projects</span>
                  <span className="font-bold text-lg">{volunteer.projectsCompleted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Badges</span>
                  <span className="font-bold text-lg">{volunteer.badges}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Connections</span>
                  <span className="font-bold text-lg">{volunteer.connections}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tier Progress</CardTitle>
                <CardDescription>15 hours until Platinum</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="bg-yellow-500 h-4 rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  185 / 500 hours to Platinum
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <p className="font-medium">{volunteer.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Phone</label>
                    <p className="font-medium">{volunteer.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">State</label>
                    <p className="font-medium">{volunteer.state}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Status</label>
                    <p className="font-medium text-green-600">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {volunteer.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {volunteer.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Your last 3 volunteer activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{project.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{project.hours}h</p>
                        <p className="text-sm text-muted-foreground">
                          {project.hours * 10} pts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Projects
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Badges</CardTitle>
                <CardDescription>Your latest achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { icon: "⏰", name: "100 Hours" },
                    { icon: "🎯", name: "10 Projects" },
                    { icon: "🤝", name: "Team Player" },
                    { icon: "🏥", name: "First Aid" },
                  ].map((badge, i) => (
                    <div key={i} className="text-center p-3 border rounded-lg hover:bg-accent cursor-pointer">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <p className="text-xs font-medium">{badge.name}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Badges
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
