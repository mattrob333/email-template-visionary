
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://angcbasjhsllynxdvios.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZ2NiYXNqaHNsbHlueGR2aW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNTY3NjUsImV4cCI6MjA1NjkzMjc2NX0.bc_4GpzbpPwOeiyfu8MbnXiyzi26dac4hIWdjuTHI_s";

// Define the site URL for redirects
export const SITE_URL = "https://email-template-visionary.lovable.app";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
    // The redirectTo should be set in the signInWithOtp function, not here
  }
});
