// src/components/bookings/customer-form.jsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCustomers } from '@/hooks/useCustomers';
import { useAuth } from '@/hooks/useAuth';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

export default function CustomerForm({ onCustomerSelect, initialCustomer = null }) {
  const { user, profile } = useAuth();
  const { getCustomerByEmail, createOrUpdateCustomer, loading } = useCustomers();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    license_number: '',
    license_expiry: new Date(),
    user_id: user?.id || null
  });
  
  const [emailLookupDone, setEmailLookupDone] = useState(false);
  const [useProfileData, setUseProfileData] = useState(false);
  
  // Initialize form with profile data if available
  useEffect(() => {
    if (initialCustomer) {
      setFormData({
        ...initialCustomer,
        license_expiry: initialCustomer.license_expiry ? new Date(initialCustomer.license_expiry) : new Date()
      });
    }
  }, [initialCustomer]);
  
  // Handle using profile data for logged-in users
  useEffect(() => {
    if (profile && useProfileData) {
      setFormData(prev => ({
        ...prev,
        first_name: profile.first_name || prev.first_name,
        last_name: profile.last_name || prev.last_name,
        email: user?.email || prev.email,
        phone: profile.phone || prev.phone,
        user_id: user?.id
      }));
    }
  }, [profile, user, useProfileData]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle license expiry date change
  const handleExpiryChange = (date) => {
    setFormData(prev => ({ ...prev, license_expiry: date }));
  };
  
  // Look up customer by email
  const handleEmailLookup = async () => {
    if (!formData.email) return;
    
    const customer = await getCustomerByEmail(formData.email);
    
    if (customer) {
      setFormData({
        ...customer,
        license_expiry: customer.license_expiry ? new Date(customer.license_expiry) : new Date()
      });
      if (onCustomerSelect) onCustomerSelect(customer);
    }
    
    setEmailLookupDone(true);
  };
  
  // Toggle using profile data
  const handleUseProfileData = (checked) => {
    setUseProfileData(checked);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format license_expiry as ISO string
    const customerData = {
      ...formData,
      license_expiry: formData.license_expiry.toISOString()
    };
    
    const customer = await createOrUpdateCustomer(customerData);
    
    if (customer && onCustomerSelect) {
      onCustomerSelect(customer);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {user && (
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="useProfile"
                checked={useProfileData}
                onCheckedChange={handleUseProfileData}
              />
              <Label htmlFor="useProfile">Use my profile information</Label>
            </div>
          )}
          
          {/* Email with lookup function */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="sm:col-span-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sm:col-span-1 self-end">
              <Button 
                type="button"
                variant="outline"
                onClick={handleEmailLookup}
                disabled={!formData.email || loading}
              >
                Look Up
              </Button>
            </div>
          </div>
          
          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Address */}
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          
          {/* City, State, Zip */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input
                id="zip_code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* License Number and Expiry */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="license_number">Driver License Number</Label>
              <Input
                id="license_number"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="license_expiry">License Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="license_expiry"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.license_expiry && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.license_expiry ? format(formData.license_expiry, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.license_expiry}
                    onSelect={handleExpiryChange}
                    initialFocus
                    disabled={date => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-4"
            disabled={loading}
          >
            {initialCustomer ? 'Update Customer' : 'Continue with Customer Info'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}