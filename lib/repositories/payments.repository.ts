import { BaseRepository } from "./base.repository";
import type { Database } from "@/lib/database.types";

type SalePaymentInsert =
  Database["public"]["Tables"]["sale_payments"]["Insert"];

export class PaymentsRepository extends BaseRepository {
  static async create(
    payment: SalePaymentInsert
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("sale_payments")
      .insert(payment)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  static async findBySale(
    saleId: string
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("sale_payments")
      .select("*")
      .eq("sale_id", saleId)
      .order("created_at");

    if (error) throw error;

    return data ?? [];
  }
}