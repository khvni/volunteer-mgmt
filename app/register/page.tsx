import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Register as Volunteer</CardTitle>
          <CardDescription>
            Join 18,000+ volunteers making a difference across 5 countries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="+60123456789"
              />
            </div>

            <div>
              <label className="text-sm font-medium">State</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-md">
                <option>Select your state</option>
                <option>Kuala Lumpur</option>
                <option>Selangor</option>
                <option>Johor</option>
                <option>Penang</option>
                <option>Perak</option>
                <option>Sabah</option>
                <option>Sarawak</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Skills (Select all that apply)</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["Event Management", "First Aid", "Teaching", "Driving", "Cooking", "Translation"].map((skill) => (
                  <label key={skill} className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Interests</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["Homeless Care", "Food Distribution", "Education", "Healthcare", "Disaster Relief"].map((interest) => (
                  <label key={interest} className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Register as Volunteer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
