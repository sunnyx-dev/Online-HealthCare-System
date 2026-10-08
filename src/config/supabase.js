import { createClient } from '@supabase/supabase-js';
import { getApiConfig, isSupabaseConfigured } from './apiConfig';

let supabase = null;

export const initSupabase = () => {
  const config = getApiConfig();
  if (isSupabaseConfigured()) {
    try {
      supabase = createClient(config.supabase.url, config.supabase.anonKey);
      console.log("⚡ Supabase Client initialized successfully!");
      return { supabase, isLive: true };
    } catch (err) {
      console.warn("⚠️ Supabase Client init warning:", err.message);
    }
  }
  return { supabase: null, isLive: false };
};

initSupabase();

export { supabase, isSupabaseConfigured };

// Supabase SQL Schema for easy deployment in PostgreSQL
export const SUPABASE_SQL_SCHEMA = `-- AuraHealth Supabase PostgreSQL Database Schema
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'patient',
  phone VARCHAR(50),
  avatar TEXT,
  blood_group VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;
