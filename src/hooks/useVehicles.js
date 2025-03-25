// src/hooks/useVehicles.js
'use client';

import { useState } from 'react';
import { db } from '@/lib/supabase';
import { toast } from 'sonner';

export function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Get all vehicles
  const getVehicles = async () => {
    setLoading(true);
    try {
      const { data, error } = await db.vehicles.getAll();
      
      if (error) throw error;
      
      setVehicles(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to fetch vehicles');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Get a single vehicle
  const getVehicle = async (id) => {
    if (!id) return null;
    
    setLoading(true);
    try {
      const { data, error } = await db.vehicles.getById(id);
      
      if (error) throw error;
      
      setVehicle(data);
      return data;
    } catch (error) {
      console.error(`Error fetching vehicle with ID ${id}:`, error);
      toast.error('Failed to fetch vehicle details');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new vehicle
  const createVehicle = async (vehicleData) => {
    setLoading(true);
    try {
      const { data, error } = await db.vehicles.create(vehicleData);
      
      if (error) throw error;
      
      toast.success('Vehicle created successfully');
      return data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      toast.error('Failed to create vehicle');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Update a vehicle
  const updateVehicle = async (id, vehicleData) => {
    if (!id) return null;
    
    setLoading(true);
    try {
      const { data, error } = await db.vehicles.update(id, vehicleData);
      
      if (error) throw error;
      
      toast.success('Vehicle updated successfully');
      return data;
    } catch (error) {
      console.error(`Error updating vehicle with ID ${id}:`, error);
      toast.error('Failed to update vehicle');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a vehicle
  const deleteVehicle = async (id) => {
    if (!id) return false;
    
    setLoading(true);
    try {
      const { error } = await db.vehicles.delete(id);
      
      if (error) throw error;
      
      toast.success('Vehicle deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting vehicle with ID ${id}:`, error);
      toast.error('Failed to delete vehicle');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    vehicles,
    vehicle,
    loading,
    getVehicles,
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle
  };
}