import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, MapPin, Car, Edit, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

interface BookingModificationProps {
  bookingId?: string;
}

const BookingModification = ({ bookingId: propBookingId }: BookingModificationProps) => {
  const { bookingId: paramBookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const bookingId = propBookingId || paramBookingId;
  const [booking, setBooking] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modifications, setModifications] = useState({
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    location: '',
    extras: {
      gps: false,
      childSeat: false,
      insurance: false,
      additionalDriver: false
    }
  });

  useEffect(() => {
    if (bookingId) {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const foundBooking = bookings.find((b: any) => b.id === bookingId);
      if (foundBooking) {
        setBooking(foundBooking);
        setModifications({
          pickupDate: foundBooking.searchParams.pickupDate || '',
          pickupTime: foundBooking.searchParams.pickupTime || '',
          returnDate: foundBooking.searchParams.returnDate || foundBooking.searchParams.pickupDate || '',
          returnTime: foundBooking.searchParams.returnTime || '',
          location: foundBooking.searchParams.location || '',
          extras: foundBooking.extras || {
            gps: false,
            childSeat: false,
            insurance: false,
            additionalDriver: false
          }
        });
      }
    }
  }, [bookingId]);

  const handleSave = () => {
    if (!booking) return;

    // Calculate new total price
    const rentalDays = Math.ceil((new Date(modifications.returnDate).getTime() - new Date(modifications.pickupDate).getTime()) / (1000 * 60 * 60 * 24)) || 1;
    let newTotal = booking.car.price * rentalDays;
    
    const extraPrices = { gps: 10, childSeat: 15, insurance: 25, additionalDriver: 20 };
    Object.entries(modifications.extras).forEach(([key, enabled]) => {
      if (enabled) {
        newTotal += extraPrices[key as keyof typeof extraPrices] * rentalDays;
      }
    });

    // Update booking
    const updatedBooking = {
      ...booking,
      searchParams: {
        ...booking.searchParams,
        pickupDate: modifications.pickupDate,
        pickupTime: modifications.pickupTime,
        returnDate: modifications.returnDate,
        returnTime: modifications.returnTime,
        location: modifications.location
      },
      extras: modifications.extras,
      rentalDays,
      totalPrice: newTotal,
      modifiedAt: new Date().toISOString()
    };

    // Save to localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const updatedBookings = bookings.map((b: any) => 
      b.id === bookingId ? updatedBooking : b
    );
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    setBooking(updatedBooking);
    setIsEditing(false);

    toast({
      title: "Booking Updated",
      description: "Your booking has been successfully modified.",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset modifications to original booking data
    if (booking) {
      setModifications({
        pickupDate: booking.searchParams.pickupDate || '',
        pickupTime: booking.searchParams.pickupTime || '',
        returnDate: booking.searchParams.returnDate || booking.searchParams.pickupDate || '',
        returnTime: booking.searchParams.returnTime || '',
        location: booking.searchParams.location || '',
        extras: booking.extras || {
          gps: false,
          childSeat: false,
          insurance: false,
          additionalDriver: false
        }
      });
    }
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
            <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Modify Booking</h1>
          <p className="text-muted-foreground">Update your booking details</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Modification Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Booking Details</CardTitle>
                  <div className="flex space-x-2">
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <>
                        <Button onClick={handleSave}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pickup Details */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Pickup Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={modifications.location}
                        onChange={(e) => setModifications(prev => ({ ...prev, location: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pickupDate">Pickup Date</Label>
                      <Input
                        id="pickupDate"
                        type="date"
                        value={modifications.pickupDate}
                        onChange={(e) => setModifications(prev => ({ ...prev, pickupDate: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pickupTime">Pickup Time</Label>
                      <Input
                        id="pickupTime"
                        type="time"
                        value={modifications.pickupTime}
                        onChange={(e) => setModifications(prev => ({ ...prev, pickupTime: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Return Details */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Return Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="returnDate">Return Date</Label>
                      <Input
                        id="returnDate"
                        type="date"
                        value={modifications.returnDate}
                        onChange={(e) => setModifications(prev => ({ ...prev, returnDate: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="returnTime">Return Time</Label>
                      <Input
                        id="returnTime"
                        type="time"
                        value={modifications.returnTime}
                        onChange={(e) => setModifications(prev => ({ ...prev, returnTime: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Extras */}
                <div>
                  <h3 className="font-semibold mb-4">Additional Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(modifications.extras).map(([key, enabled]) => (
                      <div key={key} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={key}
                          checked={enabled}
                          onCheckedChange={(checked) => 
                            setModifications(prev => ({
                              ...prev,
                              extras: { ...prev.extras, [key]: !!checked }
                            }))
                          }
                          disabled={!isEditing}
                        />
                        <Label htmlFor={key} className="capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-3">
                  <img 
                    src={booking.car.image} 
                    alt={booking.car.name}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-semibold">{booking.car.name}</h4>
                    <p className="text-sm text-muted-foreground">{booking.car.category}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Booking ID</span>
                    <span className="font-mono">{booking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="capitalize">{booking.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="capitalize">{booking.paymentMethod}</span>
                  </div>
                </div>

                <hr />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Car rental</span>
                    <span>₹{booking.car.price * booking.rentalDays}</span>
                  </div>
                  
                  {Object.entries(modifications.extras).map(([key, enabled]) => {
                    if (!enabled) return null;
                    const extraPrices = { gps: 10, childSeat: 15, insurance: 25, additionalDriver: 20 };
                    const price = extraPrices[key as keyof typeof extraPrices] || 0;
                    
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span>₹{price * booking.rentalDays}</span>
                      </div>
                    );
                  })}
                </div>

                <hr />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{booking.totalPrice}</span>
                </div>

                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModification;
