import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LeaderboardPage() {
  const leaderboard = [
    { rank: 1, name: "Ahmad Ibrahim", hours: 1250, tier: "DIAMOND", points: 12500 },
    { rank: 2, name: "Siti Nurhaliza", hours: 980, tier: "DIAMOND", points: 9800 },
    { rank: 3, name: "John Tan", hours: 750, tier: "PLATINUM", points: 7500 },
    { rank: 4, name: "Mary Wong", hours: 620, tier: "PLATINUM", points: 6200 },
    { rank: 5, name: "Kumar Raj", hours: 540, tier: "PLATINUM", points: 5400 },
    { rank: 6, name: "Fatimah Ali", hours: 480, tier: "GOLD", points: 4800 },
    { rank: 7, name: "David Lee", hours: 420, tier: "GOLD", points: 4200 },
    { rank: 8, name: "Sarah Ahmad", hours: 380, tier: "GOLD", points: 3800 },
    { rank: 9, name: "Hassan Omar", hours: 320, tier: "SILVER", points: 3200 },
    { rank: 10, name: "Lisa Chen", hours: 280, tier: "SILVER", points: 2800 },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "DIAMOND": return "bg-blue-100 text-blue-800";
      case "PLATINUM": return "bg-gray-100 text-gray-800";
      case "GOLD": return "bg-yellow-100 text-yellow-800";
      case "SILVER": return "bg-slate-100 text-slate-800";
      default: return "bg-orange-100 text-orange-800";
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground mt-2">
          Top volunteers by hours and contributions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-5xl font-bold text-center">18,000+</CardTitle>
            <CardDescription className="text-center">Active Volunteers</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-5xl font-bold text-center">250,000+</CardTitle>
            <CardDescription className="text-center">Total Hours Contributed</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-5xl font-bold text-center">5,000+</CardTitle>
            <CardDescription className="text-center">Projects Completed</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 Volunteers</CardTitle>
          <CardDescription>Most dedicated volunteers this year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((volunteer) => (
              <div
                key={volunteer.rank}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-muted-foreground w-8">
                    #{volunteer.rank}
                  </div>
                  <div>
                    <p className="font-semibold">{volunteer.name}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTierColor(volunteer.tier)}`}>
                      {volunteer.tier}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{volunteer.hours}h</p>
                  <p className="text-sm text-muted-foreground">{volunteer.points} points</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
