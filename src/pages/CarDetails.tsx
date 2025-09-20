import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Users, Fuel, Settings, MapPin, Calendar, Clock, Check, Shield, Car, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCars } from '@/data/mockCars';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookingData, selectCar } = useBooking();
  const { isAuthenticated } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const car = mockCars.find(c => c.id === parseInt(id || '0'));

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Car not found</h1>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      // Redirect to home page where user can sign in
      navigate('/');
      return;
    }
    selectCar(car);
    navigate('/booking/details');
  };

  const carImages = [car.image, car.image, car.image]; // Mock multiple images

  const extras = [
    { id: 'gps', name: 'GPS Navigation', price: 10, icon: MapPin, description: 'Never get lost with turn-by-turn navigation' },
    { id: 'childSeat', name: 'Child Safety Seat', price: 15, icon: Shield, description: 'Safe and secure seating for children' },
    { id: 'insurance', name: 'Full Coverage Insurance', price: 25, icon: Shield, description: 'Complete peace of mind coverage' },
    { id: 'wifi', name: 'Mobile WiFi Hotspot', price: 8, icon: Wifi, description: 'Stay connected on the go' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Images */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={carImages[selectedImageIndex]} 
                    alt={car.name}
                    className="w-full h-80 object-cover rounded-t-lg"
                  />
                  {car.badge && (
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                      {car.badge}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 p-4">
                  {carImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative overflow-hidden rounded-lg ${
                        index === selectedImageIndex ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${car.name} view ${index + 1}`}
                        className="w-20 h-16 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Car Info */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl">{car.name}</CardTitle>
                    <p className="text-lg text-muted-foreground">{car.category}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-semibold">{car.rating}</span>
                    <span className="text-sm text-muted-foreground">({car.reviews} reviews)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{car.description}</p>
                
                <Tabs defaultValue="specs" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="specs">Specifications</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="policies">Policies</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="specs" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="font-semibold">{car.specs.passengers}</p>
                        <p className="text-sm text-muted-foreground">Passengers</p>
                      </div>
                      <div className="text-center">
                        <Settings className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="font-semibold">{car.specs.transmission}</p>
                        <p className="text-sm text-muted-foreground">Transmission</p>
                      </div>
                      <div className="text-center">
                        <Fuel className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="font-semibold">{car.specs.fuel}</p>
                        <p className="text-sm text-muted-foreground">Fuel Type</p>
                      </div>
                      <div className="text-center">
                        <Car className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="font-semibold">{car.specs.doors}</p>
                        <p className="text-sm text-muted-foreground">Doors</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="features" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {car.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check className="w-5 h-5 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="policies" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Cancellation Policy</h4>
                        <p className="text-sm text-muted-foreground">Free cancellation up to 24 hours before pickup time.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Driver Requirements</h4>
                        <p className="text-sm text-muted-foreground">Valid driver's license required. Minimum age 21 years.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Fuel Policy</h4>
                        <p className="text-sm text-muted-foreground">Return with the same fuel level as pickup.</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Add-ons */}
            <Card>
              <CardHeader>
                <CardTitle>Available Add-ons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {extras.map((extra) => (
                    <div key={extra.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <extra.icon className="w-6 h-6 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{extra.name}</p>
                        <p className="text-sm text-muted-foreground">{extra.description}</p>
                        <p className="text-sm font-semibold text-primary">${extra.price}/day</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookingData.searchParams.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{bookingData.searchParams.location}</span>
                  </div>
                )}
                
                {bookingData.searchParams.pickupDate && (
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Pick-up: {bookingData.searchParams.pickupDate}</span>
                    </div>
                    {bookingData.searchParams.pickupTime && (
                      <div className="flex items-center space-x-2 ml-6">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{bookingData.searchParams.pickupTime}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Daily rate</span>
                    <span className="font-semibold">${car.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Estimated total (1 day)</span>
                    <span>${car.price}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover"
                    onClick={handleBookNow}
                  >
                    Book This Car
                  </Button>
                  <Button variant="outline" className="w-full">
                    Add to Compare
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground text-center">
                  Free cancellation • No hidden fees
                </div>
              </CardContent>
            </Card>

            {/* Location Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pickup Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{car.location} Airport</p>
                  <p className="text-sm text-muted-foreground">Terminal 1, Level 2</p>
                  <p className="text-sm text-muted-foreground">Open 24/7</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;