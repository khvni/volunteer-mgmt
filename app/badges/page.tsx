import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BadgesPage() {
  const badges = [
    {
      name: "First Steps",
      description: "Complete your first volunteer project",
      category: "PROJECTS",
      rarity: "COMMON",
      icon: "🎯",
      requirement: "Complete 1 project"
    },
    {
      name: "Getting Started",
      description: "Volunteer for 10 hours",
      category: "HOURS",
      rarity: "COMMON",
      icon: "⏰",
      requirement: "10 hours"
    },
    {
      name: "Dedicated Volunteer",
      description: "Volunteer for 100 hours",
      category: "HOURS",
      rarity: "RARE",
      icon: "⭐",
      requirement: "100 hours"
    },
    {
      name: "Community Hero",
      description: "Volunteer for 500 hours",
      category: "HOURS",
      rarity: "EPIC",
      icon: "🏆",
      requirement: "500 hours"
    },
    {
      name: "Legend",
      description: "Volunteer for 1000 hours",
      category: "HOURS",
      rarity: "LEGENDARY",
      icon: "👑",
      requirement: "1000 hours"
    },
    {
      name: "Team Player",
      description: "Complete 10 projects",
      category: "PROJECTS",
      rarity: "RARE",
      icon: "🤝",
      requirement: "10 projects"
    },
    {
      name: "Project Master",
      description: "Complete 50 projects",
      category: "PROJECTS",
      rarity: "EPIC",
      icon: "🎖️",
      requirement: "50 projects"
    },
    {
      name: "First Aid Certified",
      description: "Complete first aid training and 5 healthcare projects",
      category: "SKILLS",
      rarity: "RARE",
      icon: "🏥",
      requirement: "First aid skill + 5 projects"
    },
    {
      name: "Natural Leader",
      description: "Lead 10 volunteer teams",
      category: "LEADERSHIP",
      rarity: "EPIC",
      icon: "🌟",
      requirement: "Lead 10 teams"
    },
    {
      name: "Global Citizen",
      description: "Volunteer in 3 different countries",
      category: "SPECIAL",
      rarity: "LEGENDARY",
      icon: "🌍",
      requirement: "3 countries"
    },
    {
      name: "Ramadan Warrior",
      description: "Volunteer during Ramadan",
      category: "SPECIAL",
      rarity: "RARE",
      icon: "🌙",
      requirement: "Ramadan volunteer"
    },
    {
      name: "Food Hero",
      description: "Complete 20 food distribution projects",
      category: "SKILLS",
      rarity: "EPIC",
      icon: "🍲",
      requirement: "20 food projects"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "LEGENDARY": return "bg-purple-100 border-purple-300 text-purple-800";
      case "EPIC": return "bg-red-100 border-red-300 text-red-800";
      case "RARE": return "bg-blue-100 border-blue-300 text-blue-800";
      default: return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Badges</h1>
        <p className="text-muted-foreground mt-2">
          Earn badges by achieving milestones and completing challenges
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {badges.map((badge, i) => (
          <Card
            key={i}
            className={`border-2 ${getRarityColor(badge.rarity)} transition-all hover:scale-105 hover:shadow-lg`}
          >
            <CardHeader>
              <div className="text-6xl text-center mb-2">{badge.icon}</div>
              <CardTitle className="text-center text-lg">{badge.name}</CardTitle>
              <CardDescription className="text-center">
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-white/50">
                  {badge.rarity}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-center mb-3">{badge.description}</p>
              <div className="text-xs text-center text-muted-foreground border-t pt-3">
                <strong>Requirement:</strong> {badge.requirement}
              </div>
              <div className="text-xs text-center mt-2">
                <span className="px-2 py-1 bg-background rounded">
                  {badge.category}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
