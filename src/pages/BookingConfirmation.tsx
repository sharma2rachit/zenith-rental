import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Calendar, MapPin, Car, Mail, Phone, Download, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useBooking } from '@/contexts/BookingContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { bookingData, resetBooking } = useBooking();
  
  const { bookingId, totalPrice, extras, rentalDays } = location.state || {};

  useEffect(() => {
    if (!bookingId || !bookingData.selectedCar) {
      navigate('/', { replace: true });
      return;
    }

    // Show success toast
    toast({
      title: "Booking Confirmed!",
      description: `Your booking ${bookingId} has been successfully confirmed.`,
    });
  }, [bookingId, bookingData.selectedCar, navigate, toast]);

  if (!bookingId || !bookingData.selectedCar) {
    return null;
  }

  const car = bookingData.selectedCar;

  const handleNewBooking = () => {
    resetBooking();
    navigate('/');
  };

  const extraOptions = [
    { id: 'gps', name: 'GPS Navigation', price: 10 },
    { id: 'childSeat', name: 'Child Safety Seat', price: 15 },
    { id: 'insurance', name: 'Full Coverage Insurance', price: 25 },
    { id: 'additionalDriver', name: 'Additional Driver', price: 20 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
            <p className="text-lg text-muted-foreground">
              Your reservation has been successfully confirmed
            </p>
            <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
              Booking ID: {bookingId}
            </Badge>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Car Info */}
                <div className="flex space-x-4">
                  <img 
                    src={car.image} 
                    alt={car.name}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{car.name}</h3>
                    <p className="text-muted-foreground">{car.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {rentalDays} day{rentalDays > 1 ? 's' : ''} rental
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Pickup Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Pickup Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{car.location} Airport - Terminal 1, Level 2</span>
                    </div>
                    {bookingData.searchParams.pickupDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {bookingData.searchParams.pickupDate}
                          {bookingData.searchParams.pickupTime && 
                            ` at ${bookingData.searchParams.pickupTime}`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Primary Driver</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{bookingData.customerDetails.email || 'customer@example.com'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{bookingData.customerDetails.phone || '+1 (555) 123-4567'}</span>
                    </div>
                  </div>
                </div>

                {/* Selected Extras */}
                {Object.values(extras).some(Boolean) && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Selected Add-ons</h4>
                    <div className="space-y-2">
                      {Object.entries(extras).map(([key, enabled]) => {
                        if (!enabled) return null;
                        const extra = extraOptions.find(e => e.id === key);
                        if (!extra) return null;
                        
                        return (
                          <div key={key} className="flex justify-between text-sm">
                            <span>{extra.name}</span>
                            <span>${extra.price}/day</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Summary & Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Car rental ({rentalDays} day{rentalDays > 1 ? 's' : ''})</span>
                      <span>${car.price * rentalDays}</span>
                    </div>
                    
                    {Object.entries(extras).map(([key, enabled]) => {
                      if (!enabled) return null;
                      const extra = extraOptions.find(e => e.id === key);
                      if (!extra) return null;
                      
                      return (
                        <div key={key} className="flex justify-between">
                          <span>{extra.name}</span>
                          <span>${extra.price * rentalDays}</span>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Paid</span>
                    <span className="text-primary">${totalPrice}</span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>✓ Payment processed successfully</p>
                    <p>✓ Confirmation email sent</p>
                  </div>
                </CardContent>
              </Card>

              {/* Important Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Important Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <h5 className="font-medium mb-1">What to bring:</h5>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Valid driver's license</li>
                      <li>• Credit card for security deposit</li>
                      <li>• Booking confirmation (this page)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Pickup process:</h5>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Arrive 15 minutes before pickup time</li>
                      <li>• Present required documents</li>
                      <li>• Complete vehicle inspection</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Confirmation
                </Button>
                <Button className="w-full" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Confirmation
                </Button>
                <Button className="w-full" variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Booking
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover"
                  onClick={handleNewBooking}
                >
                  Book Another Car
                </Button>
              </div>
            </div>
          </div>

          {/* Support Info */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <h3 className="font-semibold">Need Help?</h3>
                <p className="text-sm text-muted-foreground">
                  Our customer service team is available 24/7 to assist you
                </p>
                <div className="flex justify-center space-x-4 text-sm">
                  <span>📞 +1 (800) 123-4567</span>
                  <span>📧 support@roadzenith.com</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;