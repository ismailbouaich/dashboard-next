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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVehicles } from '@/hooks/useVehicles';
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import CustomerForm from '../customers/customer-form';

export default function BookingForm({ bookingId, isEdit = false }) {
  const router = useRouter();
  const { getBooking, createBookingWithCustomer, updateBooking, loading: bookingLoading } = useBookings();
  const { vehicles, getVehicles, loading: vehiclesLoading } = useVehicles();
  const { user, isAdmin } = useAuth();
  
  const [activeTab, setActiveTab] = useState('vehicle');
  const [formData, setFormData] = useState({
    car_id: '',
    user_id: user?.id || '',
    start_date: new Date(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 1)),
    total_amount: 0,
    status: 'pending',
  });
  
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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
          
          // Set selected customer
          if (data.customer) {
            setSelectedCustomer(data.customer);
          }
          
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
    
    // Move to next tab if vehicle is selected
    if (vehicle && !isEdit) {
      setActiveTab('customer');
    }
  };
  
  // Handle customer selection from CustomerForm
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    
    // Move to next tab if customer is selected and not in edit mode
    if (customer && !isEdit) {
      setActiveTab('details');
    }
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
    
    if (!selectedVehicle) {
      alert('Please select a vehicle');
      return;
    }
    
    if (!selectedCustomer) {
      alert('Please provide customer information');
      return;
    }
    
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
      result = await createBookingWithCustomer(
        bookingData, 
        selectedCustomer, 
        false // Customer is already created/selected
      );
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="vehicle">1. Select Vehicle</TabsTrigger>
        <TabsTrigger value="customer">2. Customer Info</TabsTrigger>
        <TabsTrigger value="details">3. Booking Details</TabsTrigger>
      </TabsList>
      
      <TabsContent value="vehicle" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Select a Vehicle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Vehicle Selection */}
            <div className="space-y-2">
              <Label htmlFor="car_id">Select Vehicle</Label>
              <Select
                id="car_id"
                value={formData.car_id}
                onValueChange={handleVehicleSelect}
                disabled={vehiclesLoading || (isEdit && !isAdmin())}
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
            
            {/* Show selected vehicle details */}
            {selectedVehicle && (
              <div className="mt-4 p-4 border rounded-md">
                <h3 className="font-medium text-lg mb-2">Selected Vehicle:</h3>
                <div className="flex items-start gap-4">
                  <img 
                    src={selectedVehicle.image_url || '/placeholder.svg'} 
                    alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                    className="w-24 h-16 rounded-md object-cover"
                  />
                  <div>
                    <p className="font-medium">{selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})</p>
                    <p className="text-sm text-muted-foreground">License: {selectedVehicle.license_plate}</p>
                    <p className="text-sm text-muted-foreground">Daily Rate: ${selectedVehicle.daily_rate}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/dashboard/bookings')}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => setActiveTab('customer')}
              disabled={!selectedVehicle}
            >
              Next
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="customer" className="space-y-4 mt-4">
        <CustomerForm
          onCustomerSelect={handleCustomerSelect}
          initialCustomer={selectedCustomer}
        />
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="outline"
            onClick={() => setActiveTab('vehicle')}
          >
            Back
          </Button>
          <Button
            onClick={() => setActiveTab('details')}
            disabled={!selectedCustomer}
          >
            Next
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="details" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Date Selection */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <div className="rounded-lg border p-4 space-y-2 mt-4">
              <h3 className="font-medium">Booking Summary</h3>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Selected Vehicle:</div>
                <div>{selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : 'None selected'}</div>
                
                <div className="text-muted-foreground">Customer:</div>
                <div>{selectedCustomer ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}` : 'None selected'}</div>
                
                <div className="text-muted-foreground">Daily Rate:</div>
                <div>{selectedVehicle ? `${selectedVehicle.daily_rate}` : '$0'}</div>
                
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
              onClick={() => setActiveTab('customer')}
            >
              Back
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={bookingLoading || !selectedVehicle || !selectedCustomer}
            >
              {bookingLoading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Booking' : 'Create Booking')}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}