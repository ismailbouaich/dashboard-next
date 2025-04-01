'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Get all bookings with related car and user data
  const getBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          car:car_id(*),
          user:user_id(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setBookings(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Get a single booking with related data
  const getBooking = async (id) => {
    if (!id) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          car:car_id(*),
          user:user_id(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      setBooking(data);
      return data;
    } catch (error) {
      console.error(`Error fetching booking with ID ${id}:`, error);
      toast.error('Failed to fetch booking details');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new booking
  const createBooking = async (bookingData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select();
      
      if (error) throw error;
      
      toast.success('Booking created successfully');
      return data[0];
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Update a booking
  const updateBooking = async (id, bookingData) => {
    if (!id) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(bookingData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      toast.success('Booking updated successfully');
      return data[0];
    } catch (error) {
      console.error(`Error updating booking with ID ${id}:`, error);
      toast.error('Failed to update booking');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Change booking status
  const changeBookingStatus = async (id, status) => {
    if (!id) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      toast.success(`Booking marked as ${status}`);
      return data[0];
    } catch (error) {
      console.error(`Error changing booking status with ID ${id}:`, error);
      toast.error('Failed to update booking status');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a booking (admin only)
  const deleteBooking = async (id) => {
    if (!id) return false;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Booking deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting booking with ID ${id}:`, error);
      toast.error('Failed to delete booking');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    bookings,
    booking,
    loading,
    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    changeBookingStatus,
    deleteBooking
  };
}