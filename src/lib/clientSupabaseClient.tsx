import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types'
import { SUPABASE_TOKEN } from '@/contants/localstorage'

let supabase: any

function readToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(SUPABASE_TOKEN)?.replaceAll('"', '')
  }
  return null
}

function createSupabaseClient<
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any
>({isSingleton = true}: { isSingleton?: boolean } = {}): SupabaseClient<
  Database,
  SchemaName,
  Schema
> {
  const token = readToken()
  if (!token) throw new Error('No token provided')

  const createNewClient = function () {
    return createClient<Database, SchemaName, Schema>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )
  }

  if (isSingleton) {
    const _supabase = supabase ?? createNewClient()
    // For SSG and SSR always create a new Supabase client
    if (typeof window === 'undefined') return _supabase
    // Create the Supabase client once in the client
    if (!supabase) supabase = _supabase
    return supabase
  }

  return createNewClient()
}

export default createSupabaseClient
