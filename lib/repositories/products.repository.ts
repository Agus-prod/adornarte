import { BaseRepository } from "./base.repository";
import type { Database } from "@/lib/database.types";

type Product =
  Database["public"]["Tables"]["products"]["Row"];

type ProductUpdate =
  Database["public"]["Tables"]["products"]["Update"];

export class ProductsRepository extends BaseRepository {
  static async findById(id: string) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  }

  static async create(
  values: Database["public"]["Tables"]["products"]["Insert"]
) {
  const supabase = await this.db();

  const { data, error } = await supabase
    .from("products")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data;
}

  static async update(
    id: string,
    values: ProductUpdate
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("products")
      .update(values)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  static async updateStock(
    id: string,
    stock: number
  ) {
    const supabase = await this.db();

    const { error } = await supabase
      .from("products")
      .update({
        stock,
      })
      .eq("id", id);

    if (error) throw error;
  }

  static async search(
    organizationId: string,
    text: string
  ): Promise<Product[]> {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq(
        "organization_id",
        organizationId
      )
      .or(
        `name.ilike.%${text}%,sku.ilike.%${text}%,barcode.ilike.%${text}%`
      )
      .order("name");

    if (error) throw error;

    return data ?? [];
  }

  static async findByBarcode(
    organizationId: string,
    barcode: string
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq(
        "organization_id",
        organizationId
      )
      .eq("barcode", barcode)
      .maybeSingle();

    if (error) throw error;

    return data;
  }

  static async findBySku(
    organizationId: string,
    sku: string
  ) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq(
        "organization_id",
        organizationId
      )
      .eq("sku", sku)
      .maybeSingle();

    if (error) throw error;

    return data;
  }
}