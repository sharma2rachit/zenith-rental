import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BookingData {
  searchParams: {
    location: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
  };
  selectedCar: any;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    licenseNumber: string;
  };
  extras: {
    gps: boolean;
    childSeat: boolean;
    insurance: boolean;
    additionalDriver: boolean;
  };
  totalPrice: number;
}

interface BookingContextType {
  bookingData: BookingData;
  updateSearchParams: (params: Partial<BookingData['searchParams']>) => void;
  selectCar: (car: any) => void;
  updateCustomerDetails: (details: Partial<BookingData['customerDetails']>) => void;
  updateExtras: (extras: Partial<BookingData['extras']>) => void;
  calculateTotal: () => void;
  resetBooking: () => void;
}

const initialBookingData: BookingData = {
  searchParams: {
    location: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
  },
  selectedCar: null,
  customerDetails: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
  },
  extras: {
    gps: false,
    childSeat: false,
    insurance: false,
    additionalDriver: false,
  },
  totalPrice: 0,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);

  const updateSearchParams = (params: Partial<BookingData['searchParams']>) => {
    setBookingData(prev => ({
      ...prev,
      searchParams: { ...prev.searchParams, ...params }
    }));
  };

  const selectCar = (car: any) => {
    setBookingData(prev => ({ ...prev, selectedCar: car }));
  };

  const updateCustomerDetails = (details: Partial<BookingData['customerDetails']>) => {
    setBookingData(prev => ({
      ...prev,
      customerDetails: { ...prev.customerDetails, ...details }
    }));
  };

  const updateExtras = (extras: Partial<BookingData['extras']>) => {
    setBookingData(prev => ({
      ...prev,
      extras: { ...prev.extras, ...extras }
    }));
  };

  const calculateTotal = () => {
    if (!bookingData.selectedCar) return;
    
    const days = bookingData.searchParams.pickupDate && bookingData.searchParams.returnDate 
      ? Math.ceil((new Date(bookingData.searchParams.returnDate).getTime() - new Date(bookingData.searchParams.pickupDate).getTime()) / (1000 * 60 * 60 * 24)) || 1
      : 1;
    
    let total = bookingData.selectedCar.price * days;
    
    if (bookingData.extras.gps) total += 10 * days;
    if (bookingData.extras.childSeat) total += 15 * days;
    if (bookingData.extras.insurance) total += 25 * days;
    if (bookingData.extras.additionalDriver) total += 20 * days;
    
    setBookingData(prev => ({ ...prev, totalPrice: total }));
  };

  const resetBooking = () => {
    setBookingData(initialBookingData);
  };

  return (
    <BookingContext.Provider value={{
      bookingData,
      updateSearchParams,
      selectCar,
      updateCustomerDetails,
      updateExtras,
      calculateTotal,
      resetBooking,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};