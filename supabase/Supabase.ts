import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
// import Config from 'react-native-config';

const supabaseUrl: string = process.env.EXPO_SUPABASE_URL ?? "";
const supabaseAnonKey: string = process.env.EXPO_SUPABASE_ANON_KEY ?? "";
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});