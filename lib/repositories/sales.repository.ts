import type { Database } from "@/lib/database.types";
import { BaseRepository } from "./base.repository";

type SaleInsert =
  Database["public"]["Tables"]["sales"]["Insert"];

type SaleUpdate =
  Database["public"]["Tables"]["sales"]["Update"];

export class SalesRepository extends BaseRepository {
  static async create(sale: SaleInsert) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("sales")
      .insert(sale)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  static async findById(id: string) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  }

  static async update(
    id: string,
    values: SaleUpdate
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("sales")
      .update(values)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  static async delete(id: string) {
    const supabase = await this.db();

    const { error } = await supabase
      .from("sales")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  static async findByCustomer(
    customerId: string
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    return data;
  }

  static async findToday(
    organizationId: string
  ) {
    const supabase = await this.db();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("organization_id", organizationId)
      .gte(
        "created_at",
        today.toISOString()
      );

    if (error) throw error;

    return data;
  }
}