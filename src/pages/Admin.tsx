import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Car, Users, Calendar, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockCars } from '@/data/mockCars';
import Header from '@/components/Header';

interface Car {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  description: string;
  specs: any;
  features: string[];
  badge?: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isAddCarOpen, setIsAddCarOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [newCar, setNewCar] = useState({
    name: '',
    category: '',
    price: '',
    image: '',
    description: '',
    location: '',
    rating: '4.5',
    reviews: '0',
    badge: ''
  });

  useEffect(() => {
    // Load cars from localStorage or use mock data
    const savedCars = JSON.parse(localStorage.getItem('adminCars') || '[]');
    if (savedCars.length > 0) {
      setCars(savedCars);
    } else {
      setCars(mockCars);
      localStorage.setItem('adminCars', JSON.stringify(mockCars));
    }

    // Load bookings
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(savedBookings);
  }, []);

  const handleAddCar = () => {
    const car: Car = {
      id: Math.max(...cars.map(c => c.id)) + 1,
      name: newCar.name,
      category: newCar.category,
      price: parseInt(newCar.price),
      image: newCar.image,
      description: newCar.description,
      location: newCar.location,
      rating: parseFloat(newCar.rating),
      reviews: parseInt(newCar.reviews),
      badge: newCar.badge || undefined,
      specs: {
        passengers: 4,
        transmission: 'Automatic',
        fuel: 'Petrol',
        doors: 4
      },
      features: ['Air Conditioning', 'Bluetooth', 'GPS', 'USB Charging']
    };

    const updatedCars = [...cars, car];
    setCars(updatedCars);
    localStorage.setItem('adminCars', JSON.stringify(updatedCars));
    
    toast({
      title: "Car Added",
      description: `${car.name} has been added successfully.`,
    });

    // Reset form
    setNewCar({
      name: '',
      category: '',
      price: '',
      image: '',
      description: '',
      location: '',
      rating: '4.5',
      reviews: '0',
      badge: ''
    });
    setIsAddCarOpen(false);
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
  };

  const handleUpdateCar = () => {
    if (!editingCar) return;

    const updatedCars = cars.map(car => 
      car.id === editingCar.id ? editingCar : car
    );
    
    setCars(updatedCars);
    localStorage.setItem('adminCars', JSON.stringify(updatedCars));
    
    toast({
      title: "Car Updated",
      description: `${editingCar.name} has been updated successfully.`,
    });
    
    setEditingCar(null);
  };

  const handleDeleteCar = (carId: number) => {
    const updatedCars = cars.filter(car => car.id !== carId);
    setCars(updatedCars);
    localStorage.setItem('adminCars', JSON.stringify(updatedCars));
    
    toast({
      title: "Car Deleted",
      description: "Car has been removed successfully.",
    });
  };

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage cars, bookings, and view analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Car className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{cars.length}</p>
                  <p className="text-sm text-muted-foreground">Total Cars</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">₹{totalRevenue}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Car Button */}
        <div className="mb-6">
          <Dialog open={isAddCarOpen} onOpenChange={setIsAddCarOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Car
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Car</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Car Name</Label>
                    <Input
                      id="name"
                      value={newCar.name}
                      onChange={(e) => setNewCar(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Toyota Camry"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newCar.category} onValueChange={(value) => setNewCar(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Economy">Economy</SelectItem>
                        <SelectItem value="Compact">Compact</SelectItem>
                        <SelectItem value="Mid-size">Mid-size</SelectItem>
                        <SelectItem value="Full-size">Full-size</SelectItem>
                        <SelectItem value="Luxury">Luxury</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price per Day (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newCar.price}
                      onChange={(e) => setNewCar(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="2500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newCar.location}
                      onChange={(e) => setNewCar(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Delhi"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={newCar.image}
                    onChange={(e) => setNewCar(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/car-image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCar.description}
                    onChange={(e) => setNewCar(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Car description..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      value={newCar.rating}
                      onChange={(e) => setNewCar(prev => ({ ...prev, rating: e.target.value }))}
                      placeholder="4.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reviews">Reviews</Label>
                    <Input
                      id="reviews"
                      type="number"
                      value={newCar.reviews}
                      onChange={(e) => setNewCar(prev => ({ ...prev, reviews: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="badge">Badge (Optional)</Label>
                    <Input
                      id="badge"
                      value={newCar.badge}
                      onChange={(e) => setNewCar(prev => ({ ...prev, badge: e.target.value }))}
                      placeholder="Popular"
                    />
                  </div>
                </div>

                <Button onClick={handleAddCar} className="w-full">
                  Add Car
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cars List */}
        <Card>
          <CardHeader>
            <CardTitle>Car Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cars.map((car) => (
                <div key={car.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={car.image} 
                      alt={car.name}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{car.name}</h3>
                      <p className="text-sm text-muted-foreground">{car.category} • ₹{car.price}/day</p>
                      <p className="text-sm text-muted-foreground">{car.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCar(car)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCar(car.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
