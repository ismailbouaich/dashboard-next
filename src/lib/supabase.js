// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Make sure to set your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database query helpers
export const db = {
  // Cars
  vehicles: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });
      return { data, error };
    },

    getById: async(id) => {
        const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();
        return { data, error };
    },

    create: async(vehicleData) => {
        const { data, error } = await supabase
        .from('cars')
        .insert([vehicleData])
        .select();
        return { data: data?.[0], error };
    },

    update: async(id, vehicleData) => {
        const { data, error } = await supabase
        .from('cars')
        .update(vehicleData)
        .eq('id', id)
        .select();
        return { data: data?.[0], error };
    },
    
    delete: async (id) => {
        const { error } = await supabase
          .from('cars')
          .delete()
          .eq('id', id);
        return { error };
    }
  },
  
  // Bookings
  customers: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      return { data, error };
    },
    
    getById: async (id) => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    },
    
    getByEmail: async (email) => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .single();
      return { data, error };
    },
    
    create: async (customerData) => {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select();
      return { data: data?.[0], error };
    },
    
    update: async (id, customerData) => {
      const { data, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', id)
        .select();
      return { data: data?.[0], error };
    }
  },
  
  // Bookings
  bookings: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          car:car_id(*),
          customer:customer_id(*)
        `)
        .order('created_at', { ascending: false });
      return { data, error };
    },
    
    getById: async (id) => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          car:car_id(*),
          customer:customer_id(*)
        `)
        .eq('id', id)
        .single();
      return { data, error };
    },
    
    getByCustomerId: async (customerId) => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          car:car_id(*),
          customer:customer_id(*)
        `)
        .eq('customer_id', customerId)
        .order('start_date', { ascending: false });
      return { data, error };
    },
    
    create: async (bookingData) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select();
      return { data: data?.[0], error };
    },
    
    update: async (id, bookingData) => {
      const { data, error } = await supabase
        .from('bookings')
        .update(bookingData)
        .eq('id', id)
        .select();
      return { data: data?.[0], error };
    },
    
    delete: async (id) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      return { error };
    }
  },
  
  // Profiles
  profiles: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      return { data, error };
    },
    
    getById: async (id) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    },
    
    create: async (profileData) => {
      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select();
      return { data: data?.[0], error };
    },
    
    update: async (id, profileData) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', id)
        .select();
      return { data: data?.[0], error };
    }
  },
  
  // Reviews
  reviews: {
    getByCarId: async (carId) => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:user_id(*)
        `)
        .eq('car_id', carId)
        .order('created_at', { ascending: false });
      return { data, error };
    },
    
    create: async (reviewData) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select();
      return { data: data?.[0], error };
    }
  }
};