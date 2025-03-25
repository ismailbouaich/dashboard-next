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

    getById: async(id)=>{
        const {data,error}= await supabase
        .form('cars')
        .select('*')
        .eq('id',id)
        .single();
        return {data,error};
    },

    create: async(vehicleData)=>{
        const {data,error}=await supabase
        .from('cars')
        .insert([vehicleData])
        .select();
        return {data,error};
    },

    update: async(id,vehicleData)=>{
        const {data,error}= await supabase.from('cars').update([vehicleData]).eq('id',id).select();
        return{data,error};
    },

    
    delete: async (id) => {
        const { error } = await supabase
          .from('cars')
          .delete()
          .eq('id', id);
        return { error };
      }

  },


  
  // Profiles
  profiles: {
    getById: async (id) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    },
    // Add other profile methods as needed
  },
  
};