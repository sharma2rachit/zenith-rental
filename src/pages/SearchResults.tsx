import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, SlidersHorizontal, Star, Users, Fuel, Settings, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { mockCars, carCategories } from '@/data/mockCars';
import { useBooking } from '@/contexts/BookingContext';
import Header from '@/components/Header';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectCar } = useBooking();
  
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 200],
    transmission: 'all',
    fuel: 'all',
    available: true
  });
  
  const [sortBy, setSortBy] = useState('price');

  const location = searchParams.get('location') || '';
  const pickupDate = searchParams.get('pickupDate') || '';

  const filteredAndSortedCars = useMemo(() => {
    let filtered = mockCars.filter(car => {
      // Location filter
      if (location && !car.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(car.category)) {
        return false;
      }
      
      // Price filter
      if (car.price < filters.priceRange[0] || car.price > filters.priceRange[1]) {
        return false;
      }
      
      // Transmission filter
      if (filters.transmission !== 'all' && car.specs.transmission.toLowerCase() !== filters.transmission) {
        return false;
      }
      
      // Fuel filter
      if (filters.fuel !== 'all' && car.specs.fuel.toLowerCase() !== filters.fuel) {
        return false;
      }
      
      // Availability filter
      if (filters.available && !car.available) {
        return false;
      }
      
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [location, filters, sortBy]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  };

  const handleBookCar = (car: any) => {
    selectCar(car);
    navigate(`/car/${car.id}`);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Car Category</h3>
        <div className="space-y-2">
          {carCategories.map((category) => (
            <div key={category.name} className="flex items-center space-x-2">
              <Checkbox
                id={category.name}
                checked={filters.categories.includes(category.name)}
                onCheckedChange={(checked) => handleCategoryChange(category.name, !!checked)}
              />
              <label htmlFor={category.name} className="text-sm flex-1">
                {category.name} ({category.count})
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price Range (per day)</h3>
        <div className="space-y-2">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
            max={200}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Transmission</h3>
        <Select value={filters.transmission} onValueChange={(value) => setFilters(prev => ({ ...prev, transmission: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="automatic">Automatic</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Fuel Type</h3>
        <Select value={filters.fuel} onValueChange={(value) => setFilters(prev => ({ ...prev, fuel: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="gasoline">Gasoline</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="available"
          checked={filters.available}
          onCheckedChange={(checked) => setFilters(prev => ({ ...prev, available: !!checked }))}
        />
        <label htmlFor="available" className="text-sm">Available only</label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-muted-foreground">
            {location && `Cars available in ${location}`}
            {pickupDate && ` for ${pickupDate}`}
            {` • ${filteredAndSortedCars.length} cars found`}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-80">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterPanel />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters & Sort */}
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Cars</SheetTitle>
                    <SheetDescription>
                      Refine your search results
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Sort */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredAndSortedCars.length} of {mockCars.length} cars
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Car Results */}
            <div className="space-y-4">
              {filteredAndSortedCars.map((car) => (
                <Card key={car.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="relative">
                        <img 
                          src={car.image} 
                          alt={car.name}
                          className="w-full h-32 md:h-full object-cover rounded-lg"
                        />
                        {car.badge && (
                          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                            {car.badge}
                          </Badge>
                        )}
                        {!car.available && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <span className="text-white font-semibold">Not Available</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold">{car.name}</h3>
                            <p className="text-sm text-muted-foreground">{car.category}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{car.rating}</span>
                            <span className="text-sm text-muted-foreground">({car.reviews})</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">{car.description}</p>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{car.specs.passengers} passengers</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Settings className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{car.specs.transmission}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Fuel className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{car.specs.fuel}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-1">
                            {car.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {car.features.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{car.features.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-between">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">${car.price}</div>
                          <div className="text-sm text-muted-foreground">per day</div>
                          <div className="text-xs text-muted-foreground mt-1">Free cancellation</div>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <Button 
                            className="w-full" 
                            onClick={() => handleBookCar(car)}
                            disabled={!car.available}
                          >
                            {car.available ? 'View Details' : 'Not Available'}
                          </Button>
                          <Button variant="outline" className="w-full" size="sm">
                            Quick Book
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAndSortedCars.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No cars found matching your criteria</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search parameters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;