import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (typeof window !== 'undefined') {
    console.log('[Supabase Config] URL:', supabaseUrl);
    console.log('[Supabase Config] Key Present:', !!supabaseAnonKey);
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Please add them to your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
