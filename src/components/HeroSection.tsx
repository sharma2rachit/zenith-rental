import { Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useBooking } from "@/contexts/BookingContext";
import heroBackground from "@/assets/hero-background.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const { updateSearchParams } = useBooking();

  const handleSearch = () => {
    const location = (document.querySelector('input[placeholder="Enter city or airport"]') as HTMLInputElement)?.value;
    const pickupDate = (document.querySelector('input[type="date"]') as HTMLInputElement)?.value;
    const pickupTime = (document.querySelector('input[type="time"]') as HTMLInputElement)?.value;
    
    // Update booking context with search params
    updateSearchParams({
      location: location || '',
      pickupDate: pickupDate || '',
      pickupTime: pickupTime || '',
      returnDate: '',
      returnTime: ''
    });
    
    // Navigate to search results
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (pickupDate) params.set('pickupDate', pickupDate);
    if (pickupTime) params.set('pickupTime', pickupTime);
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroBackground} 
          alt="Car rental hero background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Perfect
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Rental Car</span>
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Choose from thousands of vehicles at the best prices. Book now and drive away in minutes.
          </p>

          {/* Search Card */}
          <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Pick-up Location
                </label>
                <Input placeholder="Enter city or airport" className="w-full" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Pick-up Date
                </label>
                <Input type="date" className="w-full" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Pick-up Time
                </label>
                <Input type="time" className="w-full" />
              </div>
              
              <div className="flex items-end">
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-semibold py-3"
                  onClick={handleSearch}
                >
                  Search Cars
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;