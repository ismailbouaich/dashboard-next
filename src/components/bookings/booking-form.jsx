// src/components/bookings/booking-form.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useVehicles } from '@/hooks/useVehicles';
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export default function BookingForm({ bookingId, isEdit = false }) {
  const router = useRouter();
  const { getBooking, createBooking, updateBooking, loading: bookingLoading } = useBookings();
  const { vehicles, getVehicles, loading: vehiclesLoading } = useVehicles();
  const { user, profile, isAdmin } = useAuth();
  
  const [formData, setFormData] = useState({
    car_id: '',
    user_id: user?.id || '',
    start_date: new Date(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 1)),
    total_amount: 0,
    status: 'pending',
  });
  
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [totalDays, setTotalDays] = useState(1);
  
  // Fetch booking data if in edit mode
  useEffect(() => {
    if (isEdit && bookingId) {
      const fetchBooking = async () => {
        const data = await getBooking(bookingId);
        if (data) {
          setFormData({
            ...data,
            start_date: new Date(data.start_date),
            end_date: new Date(data.end_date),
          });
          
          // Find the vehicle
          const vehicle = vehicles.find(v => v.id === data.car_id);
          if (vehicle) {
            setSelectedVehicle(vehicle);
          }
        }
      };
      
      fetchBooking();
    }
  }, [isEdit, bookingId, getBooking, vehicles]);
  
  // Fetch vehicles
  useEffect(() => {
    getVehicles();
  }, []);
  
  // Calculate total days and amount whenever dates or vehicle changes
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      // Calculate difference in days
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      setTotalDays(diffDays || 1);
      
      // Calculate total amount if a vehicle is selected
      if (selectedVehicle) {
        const totalAmount = selectedVehicle.daily_rate * diffDays;
        setFormData(prev => ({ ...prev, total_amount: totalAmount }));
      }
    }
  }, [formData.start_date, formData.end_date, selectedVehicle]);
  
  // Handle vehicle selection
  const handleVehicleSelect = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    setSelectedVehicle(vehicle);
    setFormData(prev => ({ 
      ...prev, 
      car_id: vehicleId,
      total_amount: vehicle ? vehicle.daily_rate * totalDays : 0
    }));
  };
  
  // Handle date changes
  const handleStartDateChange = (date) => {
    setFormData(prev => ({ ...prev, start_date: date }));
    
    // Ensure end_date is not before start_date
    if (date > formData.end_date) {
      setFormData(prev => ({ 
        ...prev, 
        start_date: date,
        end_date: new Date(date.getTime() + 24 * 60 * 60 * 1000) // Next day
      }));
    }
  };
  
  const handleEndDateChange = (date) => {
    // Ensure end_date is not before start_date
    if (date >= formData.start_date) {
      setFormData(prev => ({ ...prev, end_date: date }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format dates for submission
    const bookingData = {
      ...formData,
      start_date: formData.start_date.toISOString(),
      end_date: formData.end_date.toISOString(),
    };
    
    let result;
    
    if (isEdit) {
      result = await updateBooking(bookingId, bookingData);
    } else {
      result = await createBooking(bookingData);
    }
    
    if (result) {
      router.push('/dashboard/bookings');
    }
  };
  
  // Filter available vehicles based on the selected dates
  const availableVehicles = isEdit 
    ? vehicles 
    : vehicles.filter(vehicle => vehicle.is_available);
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Booking' : 'Create New Booking'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Vehicle Selection */}
          <div className="space-y-2">
            <Label htmlFor="car_id">Select Vehicle</Label>
            <Select
              id="car_id"
              value={formData.car_id}
              onValueChange={handleVehicleSelect}
              disabled={vehiclesLoading || (isEdit && !isAdmin())}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {availableVehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} ({vehicle.license_plate}) - ${vehicle.daily_rate}/day
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {vehiclesLoading && <p className="text-sm text-muted-foreground">Loading vehicles...</p>}
            {!vehiclesLoading && availableVehicles.length === 0 && (
              <p className="text-sm text-red-500">No available vehicles for the selected dates.</p>
            )}
          </div>
          
          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start_date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.start_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date ? format(formData.start_date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.start_date}
                    onSelect={handleStartDateChange}
                    initialFocus
                    disabled={date => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="end_date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.end_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.end_date ? format(formData.end_date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.end_date}
                    onSelect={handleEndDateChange}
                    initialFocus
                    disabled={date => date < formData.start_date}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Booking Status (admin only) */}
          {isAdmin() && (
            <div className="space-y-2">
              <Label htmlFor="status">Booking Status</Label>
              <Select
                id="status"
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Booking Summary */}
          <div className="rounded-lg border p-4 space-y-2">
            <h3 className="font-medium">Booking Summary</h3>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Selected Vehicle:</div>
              <div>{selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : 'None selected'}</div>
              
              <div className="text-muted-foreground">Daily Rate:</div>
              <div>{selectedVehicle ? `$${selectedVehicle.daily_rate}` : '$0'}</div>
              
              <div className="text-muted-foreground">Total Days:</div>
              <div>{totalDays} day{totalDays !== 1 ? 's' : ''}</div>
              
              <div className="text-muted-foreground font-medium">Total Amount:</div>
              <div className="font-medium">${Number(formData.total_amount).toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/dashboard/bookings')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={bookingLoading}>
            {bookingLoading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Booking' : 'Create Booking')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}