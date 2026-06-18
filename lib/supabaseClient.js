import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'TU_URL_DE_SUPABASE'; // La obtienes en tu dashboard
const supabaseAnonKey = 'TU_ANON_KEY'; // La obtienes en tu dashboard

export const supabase = createClient(supabaseUrl, supabaseAnonKey);