import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { ORBIT_AGENTS } from '../../src/config/models.js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseInstance && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  }
  return supabaseInstance;
}

/**
 * Retrieves model configuration securely from Supabase table `model_configs` or server environment variables.
 * Key Resolution Order:
 * 1. Supabase model_configs table
 * 2. Server environment variables (GEMINI_API_KEY, MISTRAL_API_KEY, CEREBRAS_API_KEY)
 * 3. User BYOK key (passed per request)
 * 4. Error if none available
 */
export async function getModelServerApiKey(modelId: string): Promise<{ provider: string; apiKey: string | null }> {
  const agent = ORBIT_AGENTS.find((a) => a.modelId === modelId || a.model === modelId);
  const provider = agent ? agent.provider : 'Unknown Provider';

  // 1. Try Supabase
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('model_configs')
        .select('provider, api_key')
        .or(`model_id.eq.${modelId},model_name.eq.${modelId}`)
        .single();

      if (!error && data && data.api_key) {
        return { provider: data.provider || provider, apiKey: data.api_key };
      }
    } catch {
      // Fallback to env
    }
  }

  // 2. Try Server Environment Variables
  if (agent && process.env[agent.envKeyName]) {
    return { provider, apiKey: process.env[agent.envKeyName] || null };
  }

  return { provider, apiKey: null };
}

export async function hasDefaultConfigs(): Promise<boolean> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { count, error } = await client
        .from('model_configs')
        .select('*', { count: 'exact', head: true });
      if (!error && count && count > 0) {
        return true;
      }
    } catch {
      // ignore
    }
  }

  // Check if env variables exist
  return ORBIT_AGENTS.some((agent) => Boolean(process.env[agent.envKeyName]));
}
