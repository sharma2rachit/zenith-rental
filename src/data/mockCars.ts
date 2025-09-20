import luxurySedanImg from "@/assets/luxury-sedan.jpg";
import economyCarImg from "@/assets/economy-car.jpg";
import suvCarImg from "@/assets/suv-car.jpg";

export const mockCars = [
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
      fuel: "Hybrid",
      doors: 4,
      luggage: 3
    },
    features: ["GPS Navigation", "Bluetooth", "Air Conditioning", "Cruise Control"],
    badge: "Popular",
    description: "Comfortable and fuel-efficient sedan perfect for business trips and city driving.",
    location: "New York",
    available: true
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
      fuel: "Gasoline",
      doors: 4,
      luggage: 2
    },
    features: ["Air Conditioning", "Bluetooth", "USB Ports", "Power Windows"],
    badge: "Best Value",
    description: "Affordable and reliable car ideal for short trips and budget-conscious travelers.",
    location: "Los Angeles",
    available: true
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
      fuel: "Gasoline",
      doors: 4,
      luggage: 5
    },
    features: ["4WD", "Premium Sound", "Captain's Chairs", "Rear Entertainment"],
    badge: "Family Friendly",
    description: "Spacious SUV perfect for family vacations and group travel with premium comfort.",
    location: "Miami",
    available: true
  },
  {
    id: 4,
    name: "Honda Civic",
    category: "Compact",
    image: economyCarImg,
    rating: 4.5,
    reviews: 203,
    price: 32,
    specs: {
      passengers: 5,
      transmission: "Manual",
      fuel: "Gasoline",
      doors: 4,
      luggage: 2
    },
    features: ["Bluetooth", "Air Conditioning", "USB Ports", "Backup Camera"],
    badge: "Manual",
    description: "Sporty compact car with excellent fuel economy and responsive handling.",
    location: "Chicago",
    available: true
  },
  {
    id: 5,
    name: "Ford Mustang",
    category: "Sports",
    image: luxurySedanImg,
    rating: 4.9,
    reviews: 87,
    price: 95,
    specs: {
      passengers: 4,
      transmission: "Automatic",
      fuel: "Premium",
      doors: 2,
      luggage: 1
    },
    features: ["Premium Sound", "Sport Mode", "Leather Seats", "Performance Tires"],
    badge: "Premium",
    description: "Iconic American muscle car delivering thrilling performance and head-turning style.",
    location: "Las Vegas",
    available: true
  },
  {
    id: 6,
    name: "Toyota RAV4",
    category: "Compact SUV",
    image: suvCarImg,
    rating: 4.7,
    reviews: 178,
    price: 58,
    specs: {
      passengers: 5,
      transmission: "Automatic",
      fuel: "Hybrid",
      doors: 4,
      luggage: 3
    },
    features: ["AWD", "Safety Sense", "Apple CarPlay", "Heated Seats"],
    badge: "All-Weather",
    description: "Versatile compact SUV with excellent fuel economy and all-weather capability.",
    location: "Seattle",
    available: false
  }
];

export const carCategories = [
  { name: "Economy", count: 15, minPrice: 25 },
  { name: "Compact", count: 12, minPrice: 30 },
  { name: "Mid-size", count: 18, minPrice: 40 },
  { name: "Full-size", count: 10, minPrice: 55 },
  { name: "Compact SUV", count: 8, minPrice: 50 },
  { name: "Full-size SUV", count: 6, minPrice: 70 },
  { name: "Sports", count: 4, minPrice: 90 },
  { name: "Luxury", count: 3, minPrice: 120 }
];