import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

export function getSupabaseAdmin() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase configuration is missing");
  client = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  return client;
}

export async function uploadRegistrationImage(file: File, bucket: string, path: string) {
  const supabase = getSupabaseAdmin();
  const result = await supabase.storage.from(bucket).upload(path, Buffer.from(await file.arrayBuffer()), {
    contentType: file.type || "image/jpeg", upsert: false,
  });
  if (result.error) throw result.error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
