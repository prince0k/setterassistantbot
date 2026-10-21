import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kmxhaymtvpbuwjztdmuq.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtteGhheW10dnBidXdqenRkbXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1Nzc0MDksImV4cCI6MjEwODE1MzQwOX0.BvDBmEUsPuV803w106g1mbZ0-mYLZIovlMP2VcclC6M';

export const supabase = createClient(supabaseUrl, supabaseKey);
