import { Star, Users, Fuel, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import luxurySedanImg from "@/assets/luxury-sedan.jpg";
import economyCarImg from "@/assets/economy-car.jpg";
import suvCarImg from "@/assets/suv-car.jpg";

const featuredCars = [
  {
    id: 1,
    name: "Toyota Camry",
    category: "Mid-size",
    image: luxurySedanImg,
    rating: 4.8,
    reviews: 124,
    price: 45,
    specs: {
      passengers: 5,
      transmission: "Automatic",
      fuel: "Hybrid"
    },
    features: ["GPS Navigation", "Bluetooth", "Air Conditioning"],
    badge: "Popular"
  },
  {
    id: 2,
    name: "Nissan Versa",
    category: "Economy",
    image: economyCarImg,
    rating: 4.6,
    reviews: 89,
    price: 28,
    specs: {
      passengers: 5,
      transmission: "Automatic",
      fuel: "Gasoline"
    },
    features: ["Air Conditioning", "Bluetooth", "USB Ports"],
    badge: "Best Value"
  },
  {
    id: 3,
    name: "Chevrolet Tahoe",
    category: "Full-size SUV",
    image: suvCarImg,
    rating: 4.7,
    reviews: 156,
    price: 75,
    specs: {
      passengers: 8,
      transmission: "Automatic",
      fuel: "Gasoline"
    },
    features: ["4WD", "Premium Sound", "Captain's Chairs"],
    badge: "Family Friendly"
  }
];

const FeaturedCars = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Featured Vehicles
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular rental cars, carefully selected for comfort, reliability, and value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCars.map((car) => (
            <Card key={car.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img 
                  src={car.image} 
                  alt={car.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                  {car.badge}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {car.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {car.category}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{car.rating}</span>
                    <span className="text-xs text-muted-foreground">({car.reviews})</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 my-4 py-4 border-y border-border">
                  <div className="text-center">
                    <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-sm font-medium">{car.specs.passengers}</p>
                    <p className="text-xs text-muted-foreground">Passengers</p>
                  </div>
                  <div className="text-center">
                    <Settings className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-sm font-medium">{car.specs.transmission}</p>
                    <p className="text-xs text-muted-foreground">Transmission</p>
                  </div>
                  <div className="text-center">
                    <Fuel className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-sm font-medium">{car.specs.fuel}</p>
                    <p className="text-xs text-muted-foreground">Fuel</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Included:</p>
                  <div className="flex flex-wrap gap-1">
                    {car.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">${car.price}</span>
                    <span className="text-sm text-muted-foreground">/day</span>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover"
                    onClick={() => window.location.href = `/car/${car.id}`}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;