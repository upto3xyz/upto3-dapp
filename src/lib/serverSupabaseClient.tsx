import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types';
import { cookies } from 'next/headers';

function readCookiesToken() {
  const cookieStore = cookies();
  const token = cookieStore.get('my-access-token');

  return token?.value;
}

function createServerSupabaseClient<Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database ? 'public' : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema ? Database[SchemaName] : any>(): SupabaseClient<Database, SchemaName, Schema> {

  const token = readCookiesToken();
  if (!token) throw new Error('No token provided');

  return createClient<Database, SchemaName, Schema>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    }
  );

}

export default createServerSupabaseClient;