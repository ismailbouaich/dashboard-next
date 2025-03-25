// src/components/vehicles/vehicle-form.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useVehicles } from '@/hooks/useVehicles';

export default function VehicleForm({ vehicleId, isEdit = false }) {
  const router = useRouter();
  const { getVehicle, createVehicle, updateVehicle, loading } = useVehicles();
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: '',
    daily_rate: 0,
    is_available: true,
    image_url: '/placeholder.svg?height=80&width=120'
  });
  
  // Fetch vehicle data if in edit mode
  useEffect(() => {
    if (isEdit && vehicleId) {
      const fetchVehicle = async () => {
        const data = await getVehicle(vehicleId);
        if (data) {
          setFormData(data);
        }
      };
      
      fetchVehicle();
    }
  }, [isEdit, vehicleId, getVehicle]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle number inputs
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let result;
    
    if (isEdit) {
      result = await updateVehicle(vehicleId, formData);
    } else {
      result = await createVehicle({
        ...formData,
        created_at: new Date().toISOString()
      });
    }
    
    if (result) {
      router.push('/vehicles');
    }
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input 
                id="make" 
                name="make" 
                value={formData.make} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input 
                id="model" 
                name="model" 
                value={formData.model} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input 
                id="year" 
                name="year" 
                type="number" 
                value={formData.year} 
                onChange={handleNumberChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="license_plate">License Plate</Label>
              <Input 
                id="license_plate" 
                name="license_plate" 
                value={formData.license_plate} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="daily_rate">Daily Rate ($)</Label>
              <Input 
                id="daily_rate" 
                name="daily_rate" 
                type="number" 
                step="0.01" 
                value={formData.daily_rate} 
                onChange={handleNumberChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input 
                id="image_url" 
                name="image_url" 
                value={formData.image_url} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="is_available" 
              name="is_available" 
              checked={formData.is_available} 
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_available: checked }))} 
            />
            <Label htmlFor="is_available">Available for Rent</Label>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/vehicles')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Vehicle' : 'Create Vehicle')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}