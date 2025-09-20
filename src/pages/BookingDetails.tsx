import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone, Mail, CreditCard, Shield, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  licenseNumber: z.string().min(5, 'Please enter a valid license number'),
  cardNumber: z.string().min(16, 'Please enter a valid card number'),
  expiryDate: z.string().min(5, 'Please enter a valid expiry date'),
  cvv: z.string().min(3, 'Please enter a valid CVV'),
  cardholderName: z.string().min(2, 'Please enter cardholder name'),
});

type FormData = z.infer<typeof formSchema>;

const BookingDetails = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { bookingData, updateCustomerDetails, updateExtras, calculateTotal } = useBooking();
  const [extras, setExtras] = useState({
    gps: false,
    childSeat: false,
    insurance: false,
    additionalDriver: false,
  });
  const [rentalDays, setRentalDays] = useState(1);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      licenseNumber: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: user ? `${user.firstName} ${user.lastName}` : '',
    },
  });


  if (!bookingData.selectedCar) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No car selected</h1>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const car = bookingData.selectedCar;
  
  const extraOptions = [
    { id: 'gps', name: 'GPS Navigation', price: 10, description: 'Never get lost with turn-by-turn navigation' },
    { id: 'childSeat', name: 'Child Safety Seat', price: 15, description: 'Safe and secure seating for children' },
    { id: 'insurance', name: 'Full Coverage Insurance', price: 25, description: 'Complete peace of mind coverage' },
    { id: 'additionalDriver', name: 'Additional Driver', price: 20, description: 'Add a second authorized driver' },
  ];

  const calculateTotalPrice = () => {
    let total = car.price * rentalDays;
    Object.entries(extras).forEach(([key, enabled]) => {
      if (enabled) {
        const extra = extraOptions.find(e => e.id === key);
        if (extra) total += extra.price * rentalDays;
      }
    });
    return total;
  };

  const handleExtraChange = (extraId: string, checked: boolean) => {
    setExtras(prev => ({ ...prev, [extraId]: checked }));
    updateExtras({ [extraId]: checked });
  };

  const onSubmit = async (data: FormData) => {
    // Check if user is authenticated before proceeding
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in or create an account to complete your booking.",
        variant: "destructive",
      });
      // Store form data temporarily and redirect to sign in
      updateCustomerDetails(data);
      navigate('/');
      return;
    }

    updateCustomerDetails(data);
    
    try {
      toast({
        title: "Redirecting to payment...",
        description: "Please complete your payment to confirm the booking.",
      });
      
      // Navigate to payment page
      navigate('/payment', { 
        state: { 
          totalPrice: calculateTotalPrice(),
          extras,
          rentalDays 
        } 
      });
    } catch (error) {
      toast({
        title: "Error occurred",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          Back to Car Details
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rental Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Rental Duration</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-4 py-2 border rounded text-center min-w-[60px]">
                        {rentalDays} day{rentalDays > 1 ? 's' : ''}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRentalDays(rentalDays + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add-ons */}
            <Card>
              <CardHeader>
                <CardTitle>Add Extra Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {extraOptions.map((extra) => (
                    <div key={extra.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                      <Checkbox
                        id={extra.id}
                        checked={extras[extra.id as keyof typeof extras]}
                        onCheckedChange={(checked) => handleExtraChange(extra.id, !!checked)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={extra.id} className="font-medium">
                          {extra.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{extra.description}</p>
                        <p className="text-sm font-semibold text-primary">${extra.price}/day</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle>Driver Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver's License Number</FormLabel>
                          <FormControl>
                            <Input placeholder="D123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="my-6" />

                    <h3 className="text-lg font-semibold mb-4">Payment Information</h3>

                    <FormField
                      control={form.control}
                      name="cardholderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cardholder Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input placeholder="1234 5678 9012 3456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input placeholder="MM/YY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover"
                    >
                      {isAuthenticated ? `Complete Booking - $${calculateTotalPrice()}` : 'Sign In & Complete Booking'}
                    </Button>
                    
                    {!isAuthenticated && (
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        You'll be prompted to sign in before finalizing your booking
                      </p>
                    )}
                  </form>
                </Form>
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

                <Separator />

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
                        <span>{extra.name} ({rentalDays} day{rentalDays > 1 ? 's' : ''})</span>
                        <span>${extra.price * rentalDays}</span>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${calculateTotalPrice()}</span>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>• Free cancellation up to 24 hours before pickup</p>
                  <p>• No hidden fees</p>
                  <p>• Secure payment processing</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;