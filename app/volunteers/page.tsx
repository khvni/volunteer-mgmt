import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VolunteersPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Volunteers</h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage 18,000+ active volunteers
          </p>
        </div>
        <Link href="/register">
          <Button>Register New Volunteer</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle>Volunteer {i}</CardTitle>
              <CardDescription>
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 mb-2">
                  Gold Tier
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Skills:</strong> Event Management, First Aid</p>
                <p><strong>Hours:</strong> 150 hours</p>
                <p><strong>Location:</strong> Kuala Lumpur</p>
                <p><strong>Projects:</strong> 12 completed</p>
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Showing 6 of 18,000+ volunteers
        </p>
      </div>
    </div>
  );
}
