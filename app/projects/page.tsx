import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Discover volunteer opportunities across Malaysia and beyond
          </p>
        </div>
        <Button>Create Project</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Food Distribution",
            category: "FOOD_DISTRIBUTION",
            location: "Kuala Lumpur",
            date: "Nov 15, 2025",
            volunteers: "5 / 10",
            priority: "HIGH"
          },
          {
            title: "Homeless Care",
            category: "HOMELESS_CARE",
            location: "Johor Bahru",
            date: "Nov 20, 2025",
            volunteers: "8 / 15",
            priority: "MEDIUM"
          },
          {
            title: "Education Support",
            category: "EDUCATION",
            location: "Penang",
            date: "Nov 25, 2025",
            volunteers: "3 / 8",
            priority: "URGENT"
          },
          {
            title: "Healthcare Outreach",
            category: "HEALTHCARE",
            location: "Selangor",
            date: "Dec 1, 2025",
            volunteers: "10 / 20",
            priority: "HIGH"
          },
          {
            title: "Fundraising Event",
            category: "FUNDRAISING",
            location: "Kuala Lumpur",
            date: "Dec 10, 2025",
            volunteers: "2 / 12",
            priority: "MEDIUM"
          },
          {
            title: "Disaster Relief",
            category: "DISASTER_RELIEF",
            location: "Kelantan",
            date: "Nov 12, 2025",
            volunteers: "15 / 30",
            priority: "URGENT"
          }
        ].map((project, i) => (
          <Card key={i} className="hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                  project.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {project.priority}
                </span>
              </div>
              <CardDescription>{project.category.replace('_', ' ')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <p><strong>Location:</strong> {project.location}</p>
                <p><strong>Date:</strong> {project.date}</p>
                <p><strong>Volunteers:</strong> {project.volunteers}</p>
              </div>
              <Button className="w-full">Join Project</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
