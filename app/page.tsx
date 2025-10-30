import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight">
          MyFundAction Volunteer Management
        </h1>
        <p className="text-xl text-muted-foreground">
          Empowering 18,000+ volunteers across 5 countries to make a difference
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Link
            href="/volunteers"
            className="p-6 border rounded-lg hover:border-primary transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Volunteers</h2>
            <p className="text-muted-foreground">
              Browse and manage volunteer profiles
            </p>
          </Link>

          <Link
            href="/projects"
            className="p-6 border rounded-lg hover:border-primary transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Projects</h2>
            <p className="text-muted-foreground">
              Discover and join volunteer projects
            </p>
          </Link>

          <Link
            href="/leaderboard"
            className="p-6 border rounded-lg hover:border-primary transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Leaderboard</h2>
            <p className="text-muted-foreground">
              Top volunteers by hours and achievements
            </p>
          </Link>
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Register as Volunteer
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border rounded-md hover:bg-accent"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
