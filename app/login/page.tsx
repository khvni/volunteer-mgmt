import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="container mx-auto py-20 px-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Login</CardTitle>
          <CardDescription>
            Access your volunteer dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="Enter your password"
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Login
            </Button>

            <div className="text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
