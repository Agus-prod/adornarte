import { BaseRepository } from "./base.repository";
import type { Database } from "@/lib/database.types";

type CashClosingInsert =
  Database["public"]["Tables"]["cash_closings"]["Insert"];

type CashClosingUpdate =
  Database["public"]["Tables"]["cash_closings"]["Update"];

type CashMovementInsert =
  Database["public"]["Tables"]["cash_movements"]["Insert"];

export class CashRepository extends BaseRepository {
  static async createMovement(
    movement: CashMovementInsert
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("cash_movements")
      .insert(movement)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  static async getOpenCash(
    organizationId: string
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("cash_closings")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("is_closed", false)
      .maybeSingle();

    if (error) throw error;

    return data;
  }

  static async findById(id: string) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("cash_closings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  }

  static async create(
    values: CashClosingInsert
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("cash_closings")
      .insert(values)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  static async close(
    id: string,
    values: CashClosingUpdate
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("cash_closings")
      .update(values)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  static async getMovements(
    cashClosingId: string
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("cash_movements")
      .select(`
        type,
        amount
      `)
      .eq(
        "cash_closing_id",
        cashClosingId
      );

    if (error) throw error;

    return data ?? [];
  }
}