import { createClient } from "@/lib/supabase/server";

export abstract class BaseRepository {
  protected static async db() {
    return createClient();
  }
}