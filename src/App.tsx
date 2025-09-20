import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookingProvider } from "./contexts/BookingContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import CarDetails from "./pages/CarDetails";
import BookingDetails from "./pages/BookingDetails";
import Payment from "./pages/Payment";
import BookingConfirmation from "./pages/BookingConfirmation";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import BookingModification from "./pages/BookingModification";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BookingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/car/:id" element={<CarDetails />} />
              <Route path="/booking/details" element={<BookingDetails />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/booking/confirmation" element={<BookingConfirmation />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/booking/modify/:bookingId" element={<BookingModification />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BookingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
