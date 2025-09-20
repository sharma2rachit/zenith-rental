import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Car, Clock } from 'lucide-react';

interface BookingCalendarProps {
  bookings: any[];
  onDateSelect?: (date: string) => void;
}

const BookingCalendar = ({ bookings, onDateSelect }: BookingCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(booking => {
      const pickupDate = new Date(booking.searchParams.pickupDate);
      const returnDate = new Date(booking.searchParams.returnDate || booking.searchParams.pickupDate);
      const bookingDate = new Date(dateStr);
      
      return bookingDate >= pickupDate && bookingDate <= returnDate;
    });
  };

  const getDateStatus = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      return 'past';
    } else if (date.getTime() === today.getTime()) {
      return 'today';
    } else {
      const bookings = getBookingsForDate(date);
      if (bookings.length > 0) {
        return 'booked';
      }
      return 'available';
    }
  };

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    onDateSelect?.(dateStr);
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10 w-10"></div>
      );
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const status = getDateStatus(date);
      const dayBookings = getBookingsForDate(date);
      const isSelected = selectedDate === date.toISOString().split('T')[0];
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          disabled={status === 'past'}
          className={`
            h-10 w-10 rounded-lg text-sm font-medium transition-colors
            ${status === 'past' 
              ? 'text-gray-400 cursor-not-allowed' 
              : status === 'today'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : status === 'booked'
              ? 'bg-red-100 text-red-800 hover:bg-red-200'
              : 'hover:bg-gray-100 text-gray-900'
            }
            ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
          `}
        >
          <div className="flex flex-col items-center">
            <span>{day}</span>
            {dayBookings.length > 0 && (
              <div className="w-1 h-1 bg-red-500 rounded-full mt-0.5"></div>
            )}
          </div>
        </button>
      );
    }
    
    return days;
  };

  const getSelectedDateBookings = () => {
    if (!selectedDate) return [];
    const date = new Date(selectedDate);
    return getBookingsForDate(date);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Booking Calendar</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-lg font-semibold min-w-[120px] text-center">
                {monthNames[month]} {year}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
              <span>Past</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Bookings */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Bookings for {new Date(selectedDate).toLocaleDateString()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getSelectedDateBookings().length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No bookings for this date
              </p>
            ) : (
              <div className="space-y-3">
                {getSelectedDateBookings().map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Car className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{booking.car.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {booking.customer.firstName} {booking.customer.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">
                        {booking.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        ₹{booking.totalPrice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingCalendar;
