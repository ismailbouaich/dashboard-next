'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Get all customers
  const getCustomers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCustomers(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Get a single customer by ID
  const getCustomer = async (id) => {
    if (!id) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      setCustomer(data);
      return data;
    } catch (error) {
      console.error(`Error fetching customer with ID ${id}:`, error);
      toast.error('Failed to fetch customer details');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Get customer by email
  const getCustomerByEmail = async (email) => {
    if (!email) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found" error
        throw error;
      }
      
      if (data) setCustomer(data);
      return data || null;
    } catch (error) {
      console.error(`Error fetching customer with email ${email}:`, error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Get customer by user ID (for authenticated users)
  const getCustomerByUserId = async (userId) => {
    if (!userId) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found" error
        throw error;
      }
      
      if (data) setCustomer(data);
      return data || null;
    } catch (error) {
      console.error(`Error fetching customer with user ID ${userId}:`, error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const createCustomer = async (customerData) => {
    setLoading(true);
    try {
      // Check if customer with this email already exists
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id, email')
        .eq('email', customerData.email)
        .maybeSingle();
      
      if (existingCustomer) {
        // Return existing customer with warning
        toast.warning('Customer with this email already exists');
        return existingCustomer;
      }
      
      // Make sure there is no unexpected id field that could cause issues
      const { id, ...safeCustomerData } = customerData;
      
      // Try to create new customer using direct SQL request
      // This avoids RLS issues by using the service role which bypasses policies
      const { data, error } = await supabase
        .from('customers')
        .insert([safeCustomerData])
        .select();
      
      if (error) {
        console.error("Insert error details:", error);
        
        // If there's an RLS error, log details for debugging
        if (error.code === 'PGRST301') {
          console.error("This appears to be an RLS policy error. Ensure proper policies are in place.");
        }
        
        throw error;
      }
      
      toast.success('Customer created successfully');
      return data[0];
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error(`Failed to create customer: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Create or update customer by email
  const createOrUpdateCustomer = async (customerData) => {
    setLoading(true);
    try {
      // Check if customer with this email already exists
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customerData.email)
        .maybeSingle();
      
      if (existingCustomer) {
        // Update existing customer
        return await updateCustomer(existingCustomer.id, customerData);
      } else {
        // Create new customer
        return await createCustomer(customerData);
      }
    } catch (error) {
      console.error('Error in createOrUpdateCustomer:', error);
      toast.error('Failed to process customer data');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Update a customer
  const updateCustomer = async (id, customerData) => {
    if (!id) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      toast.success('Customer updated successfully');
      return data[0];
    } catch (error) {
      console.error(`Error updating customer with ID ${id}:`, error);
      toast.error('Failed to update customer');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Link customer to user account
  const linkCustomerToUser = async (customerId, userId) => {
    if (!customerId || !userId) return false;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .update({ user_id: userId })
        .eq('id', customerId)
        .select();
      
      if (error) throw error;
      
      toast.success('Customer linked to user account');
      return data[0];
    } catch (error) {
      console.error(`Error linking customer ${customerId} to user ${userId}:`, error);
      toast.error('Failed to link customer to user account');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a customer (admin only)
  const deleteCustomer = async (id) => {
    if (!id) return false;
    
    setLoading(true);
    try {
      // Check if customer has any bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id')
        .eq('customer_id', id);
      
      if (bookingsError) throw bookingsError;
      
      if (bookings && bookings.length > 0) {
        toast.error('Cannot delete customer with existing bookings');
        return false;
      }
      
      // Delete customer if no bookings exist
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Customer deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting customer with ID ${id}:`, error);
      toast.error('Failed to delete customer');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    customers,
    customer,
    loading,
    getCustomers,
    getCustomer,
    getCustomerByEmail,
    getCustomerByUserId,
    createCustomer,
    createOrUpdateCustomer,
    updateCustomer,
    linkCustomerToUser,
    deleteCustomer
  };
}