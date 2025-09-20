import { Car, Users, Zap, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    id: 1,
    name: "Economy",
    description: "Great value for money",
    icon: Car,
    cars: "25+ cars",
    priceFrom: "$25/day",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    name: "SUV & Crossover",
    description: "Perfect for families",
    icon: Users,
    cars: "18+ cars",
    priceFrom: "$45/day",
    gradient: "from-green-500 to-green-600"
  },
  {
    id: 3,
    name: "Electric",
    description: "Eco-friendly driving",
    icon: Zap,
    cars: "12+ cars",
    priceFrom: "$35/day",
    gradient: "from-emerald-500 to-emerald-600"
  },
  {
    id: 4,
    name: "Luxury",
    description: "Premium experience",
    icon: Crown,
    cars: "8+ cars",
    priceFrom: "$85/day",
    gradient: "from-purple-500 to-purple-600"
  }
];

const CarCategories = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Choose Your Car Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From budget-friendly economy cars to luxury vehicles, find the perfect ride for your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    {category.description}
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {category.cars}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      From {category.priceFrom}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CarCategories;