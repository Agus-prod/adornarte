import { BaseRepository } from "./base.repository";
import type { Database } from "@/lib/database.types";

type SaleItemInsert =
  Database["public"]["Tables"]["sale_items"]["Insert"];

export class SaleItemsRepository extends BaseRepository {
  static async createMany(
    items: SaleItemInsert[]
  ) {
    const supabase = await this.db();

    const { error } = await supabase
      .from("sale_items")
      .insert(items);

    if (error) throw error;
  }
}