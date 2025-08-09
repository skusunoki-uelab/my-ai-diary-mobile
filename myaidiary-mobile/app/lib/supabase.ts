import { createClient } from '@supabase/supabase-js';

// SupabaseのURLと公開鍵を環境変数から取得
const supabaseUrl = 'https://<your-supabase-url>.supabase.co';
const supabaseAnonKey = '<your-supabase-anon-key>';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);