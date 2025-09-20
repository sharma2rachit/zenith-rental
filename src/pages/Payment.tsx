import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, CheckCircle, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBooking } from '@/contexts/BookingContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { bookingData, updateCustomerDetails } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const { totalPrice, rentalDays, extras } = location.state || {};

  if (!bookingData.selectedCar) {
    navigate('/');
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate booking ID
      const bookingId = 'RZ' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      // Save booking to localStorage
      const booking = {
        id: bookingId,
        car: bookingData.selectedCar,
        customer: bookingData.customerDetails,
        searchParams: bookingData.searchParams,
        extras,
        rentalDays,
        totalPrice,
        paymentData,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        pickupDate: bookingData.searchParams.pickupDate,
        returnDate: bookingData.searchParams.returnDate || bookingData.searchParams.pickupDate
      };

      // Get existing bookings
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('bookings', JSON.stringify(existingBookings));

      toast({
        title: "Booking Confirmed!",
        description: `Your booking ${bookingId} has been successfully confirmed.`,
      });

      navigate('/booking/confirmation', { 
        state: { 
          bookingId,
          totalPrice,
          extras,
          rentalDays,
          booking 
        } 
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const car = bookingData.selectedCar;

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
          Back to Booking Details
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Card Details */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      value={paymentData.cardholderName}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, cardholderName: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || !paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing Payment...</span>
                    </div>
                  ) : (
                    `Pay ₹${totalPrice || 0}`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Car Info */}
                <div className="flex space-x-3">
                  <img 
                    src={car.image} 
                    alt={car.name}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-semibold">{car.name}</h4>
                    <p className="text-sm text-muted-foreground">{car.category}</p>
                  </div>
                </div>

                {/* Pickup Details */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{bookingData.searchParams.location || 'Airport Terminal'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{bookingData.searchParams.pickupDate} at {bookingData.searchParams.pickupTime}</span>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Car rental ({rentalDays || 1} day{(rentalDays || 1) > 1 ? 's' : ''})</span>
                    <span>₹{car.price * (rentalDays || 1)}</span>
                  </div>
                  
                  {extras && Object.entries(extras).map(([key, enabled]) => {
                    if (!enabled) return null;
                    const extraPrices = { gps: 10, childSeat: 15, insurance: 25, additionalDriver: 20 };
                    const price = extraPrices[key as keyof typeof extraPrices] || 0;
                    
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')} ({(rentalDays || 1)} day{(rentalDays || 1) > 1 ? 's' : ''})</span>
                        <span>₹{price * (rentalDays || 1)}</span>
                      </div>
                    );
                  })}
                </div>

                <hr />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{totalPrice || 0}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Free cancellation up to 24 hours before pickup</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
