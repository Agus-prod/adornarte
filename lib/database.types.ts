export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      branches: {
        Row: {
          address: string | null
          code: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          organization_id: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          banner_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          organization_id: string
          slug: string
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          organization_id: string
          slug: string
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          organization_id?: string
          slug?: string
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_closings: {
        Row: {
          closed_at: string | null
          closed_by: string | null
          counted_amount: number
          created_at: string
          difference: number
          expected_amount: number
          id: string
          is_closed: boolean
          notes: string | null
          opened_by: string | null
          opening_amount: number
          organization_id: string
          start_at: string | null
        }
        Insert: {
          closed_at?: string | null
          closed_by?: string | null
          counted_amount?: number
          created_at?: string
          difference?: number
          expected_amount?: number
          id?: string
          is_closed?: boolean
          notes?: string | null
          opened_by?: string | null
          opening_amount?: number
          organization_id: string
          start_at?: string | null
        }
        Update: {
          closed_at?: string | null
          closed_by?: string | null
          counted_amount?: number
          created_at?: string
          difference?: number
          expected_amount?: number
          id?: string
          is_closed?: boolean
          notes?: string | null
          opened_by?: string | null
          opening_amount?: number
          organization_id?: string
          start_at?: string | null
        }
        Relationships: []
      }
      cash_movements: {
        Row: {
          amount: number
          cash_closing_id: string
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
          organization_id: string
          reference_id: string | null
          reference_type: string | null
          type: string
        }
        Insert: {
          amount: number
          cash_closing_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          reference_id?: string | null
          reference_type?: string | null
          type: string
        }
        Update: {
          amount?: number
          cash_closing_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          reference_id?: string | null
          reference_type?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_movements_cash_closing_id_fkey"
            columns: ["cash_closing_id"]
            isOneToOne: false
            referencedRelation: "cash_closings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_movements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          banner_url: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          meta_description: string | null
          meta_title: string | null
          name: string
          organization_id: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name: string
          organization_id: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          organization_id?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_cart_items: {
        Row: {
          cart_id: string
          created_at: string
          id: string
          image_url: string | null
          name: string
          notes: string | null
          organization_id: string
          product_id: string
          quantity: number
          sku: string | null
          unit_price: number
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          cart_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          notes?: string | null
          organization_id: string
          product_id: string
          quantity?: number
          sku?: string | null
          unit_price?: number
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          cart_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          notes?: string | null
          organization_id?: string
          product_id?: string
          quantity?: number
          sku?: string | null
          unit_price?: number
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalog_cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "catalog_carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_cart_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_analytics_events: {
        Row: {
          cart_id: string | null
          created_at: string
          customer_email: string | null
          event_type: string
          id: string
          metadata: Json
          order_id: string | null
          organization_id: string
          product_id: string | null
          value: number | null
        }
        Insert: {
          cart_id?: string | null
          created_at?: string
          customer_email?: string | null
          event_type: string
          id?: string
          metadata?: Json
          order_id?: string | null
          organization_id: string
          product_id?: string | null
          value?: number | null
        }
        Update: {
          cart_id?: string | null
          created_at?: string
          customer_email?: string | null
          event_type?: string
          id?: string
          metadata?: Json
          order_id?: string | null
          organization_id?: string
          product_id?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "catalog_analytics_events_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "catalog_carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_analytics_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "catalog_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_analytics_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_analytics_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_branch_inventory: {
        Row: {
          available_stock: number
          branch_id: string
          id: string
          organization_id: string
          product_id: string
          reserved_stock: number
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          available_stock?: number
          branch_id: string
          id?: string
          organization_id: string
          product_id: string
          reserved_stock?: number
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          available_stock?: number
          branch_id?: string
          id?: string
          organization_id?: string
          product_id?: string
          reserved_stock?: number
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalog_branch_inventory_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_branch_inventory_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_branch_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_branch_inventory_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_carts: {
        Row: {
          coupon_code: string | null
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          discount_total: number
          id: string
          notes: string | null
          organization_id: string
          payment_method: string | null
          shipping_address: string | null
          shipping_city: string | null
          shipping_notes: string | null
          shipping_total: number
          status: string
          subtotal: number
          tax_total: number
          total: number
          updated_at: string
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_total?: number
          id?: string
          notes?: string | null
          organization_id: string
          payment_method?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_notes?: string | null
          shipping_total?: number
          status?: string
          subtotal?: number
          tax_total?: number
          total?: number
          updated_at?: string
        }
        Update: {
          coupon_code?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_total?: number
          id?: string
          notes?: string | null
          organization_id?: string
          payment_method?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_notes?: string | null
          shipping_total?: number
          status?: string
          subtotal?: number
          tax_total?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_carts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_cms_pages: {
        Row: {
          banner_url: string | null
          content: string | null
          created_at: string
          id: string
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          organization_id: string
          published_at: string | null
          slug: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          organization_id: string
          published_at?: string | null
          slug: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          organization_id?: string
          published_at?: string | null
          slug?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_cms_pages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_coupons: {
        Row: {
          code: string
          created_at: string
          customer_id: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          minimum_subtotal: number
          name: string
          organization_id: string
          starts_at: string | null
          type: string
          updated_at: string
          usage_limit: number | null
          used_count: number
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          customer_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          minimum_subtotal?: number
          name: string
          organization_id: string
          starts_at?: string | null
          type: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          value?: number
        }
        Update: {
          code?: string
          created_at?: string
          customer_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          minimum_subtotal?: number
          name?: string
          organization_id?: string
          starts_at?: string | null
          type?: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "catalog_coupons_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_coupons_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_customer_addresses: {
        Row: {
          address: string
          city: string
          created_at: string
          customer_id: string
          id: string
          is_default: boolean
          label: string
          notes: string | null
          organization_id: string
          phone: string | null
          recipient_name: string
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          customer_id: string
          id?: string
          is_default?: boolean
          label?: string
          notes?: string | null
          organization_id: string
          phone?: string | null
          recipient_name: string
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          customer_id?: string
          id?: string
          is_default?: boolean
          label?: string
          notes?: string | null
          organization_id?: string
          phone?: string | null
          recipient_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "catalog_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_customer_addresses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_customers: {
        Row: {
          auth_user_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          organization_id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          organization_id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          organization_id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_inventory_sync_events: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          product_id: string
          source: string
          stock: number
          synced_at: string
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          product_id: string
          source: string
          stock?: number
          synced_at?: string
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          product_id?: string
          source?: string
          stock?: number
          synced_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalog_inventory_sync_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_inventory_sync_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_inventory_sync_events_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_gift_cards: {
        Row: {
          code: string
          created_at: string
          current_balance: number
          expires_at: string | null
          id: string
          initial_balance: number
          organization_id: string
          purchaser_email: string | null
          recipient_email: string | null
          status: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          current_balance?: number
          expires_at?: string | null
          id?: string
          initial_balance?: number
          organization_id: string
          purchaser_email?: string | null
          recipient_email?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          current_balance?: number
          expires_at?: string | null
          id?: string
          initial_balance?: number
          organization_id?: string
          purchaser_email?: string | null
          recipient_email?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_gift_cards_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_notifications: {
        Row: {
          body: string
          channel: string
          created_at: string
          id: string
          organization_id: string
          recipient: string
          reference_id: string | null
          reference_type: string | null
          sent_at: string | null
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          body: string
          channel: string
          created_at?: string
          id?: string
          organization_id: string
          recipient: string
          reference_id?: string | null
          reference_type?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          channel?: string
          created_at?: string
          id?: string
          organization_id?: string
          recipient?: string
          reference_id?: string | null
          reference_type?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_marketplace_feeds: {
        Row: {
          channel: string
          created_at: string
          id: string
          is_active: boolean
          last_generated_at: string | null
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          channel: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_generated_at?: string | null
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          channel?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_generated_at?: string | null
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_marketplace_feeds_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_loyalty_accounts: {
        Row: {
          created_at: string
          customer_email: string
          id: string
          organization_id: string
          points_balance: number
          tier: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          id?: string
          organization_id: string
          points_balance?: number
          tier?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          id?: string
          organization_id?: string
          points_balance?: number
          tier?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_loyalty_accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_loyalty_movements: {
        Row: {
          created_at: string
          id: string
          loyalty_account_id: string
          notes: string | null
          organization_id: string
          points: number
          reference_id: string | null
          reference_type: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          loyalty_account_id: string
          notes?: string | null
          organization_id: string
          points: number
          reference_id?: string | null
          reference_type?: string | null
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          loyalty_account_id?: string
          notes?: string | null
          organization_id?: string
          points?: number
          reference_id?: string | null
          reference_type?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_loyalty_movements_loyalty_account_id_fkey"
            columns: ["loyalty_account_id"]
            isOneToOne: false
            referencedRelation: "catalog_loyalty_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_loyalty_movements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_order_items: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          name: string
          notes: string | null
          order_id: string
          organization_id: string
          product_id: string | null
          quantity: number
          sku: string | null
          total: number
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          notes?: string | null
          order_id: string
          organization_id: string
          product_id?: string | null
          quantity: number
          sku?: string | null
          total?: number
          unit_price?: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          notes?: string | null
          order_id?: string
          organization_id?: string
          product_id?: string | null
          quantity?: number
          sku?: string | null
          total?: number
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalog_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "catalog_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_order_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_orders: {
        Row: {
          cart_id: string | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          discount_total: number
          id: string
          order_number: string
          organization_id: string
          payment_method: string | null
          sale_id: string | null
          shipping_address: string
          shipping_city: string
          shipping_notes: string | null
          shipping_total: number
          status: string
          subtotal: number
          tax_total: number
          total: number
          updated_at: string
        }
        Insert: {
          cart_id?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          discount_total?: number
          id?: string
          order_number: string
          organization_id: string
          payment_method?: string | null
          sale_id?: string | null
          shipping_address: string
          shipping_city: string
          shipping_notes?: string | null
          shipping_total?: number
          status?: string
          subtotal?: number
          tax_total?: number
          total?: number
          updated_at?: string
        }
        Update: {
          cart_id?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          discount_total?: number
          id?: string
          order_number?: string
          organization_id?: string
          payment_method?: string | null
          sale_id?: string | null
          shipping_address?: string
          shipping_city?: string
          shipping_notes?: string | null
          shipping_total?: number
          status?: string
          subtotal?: number
          tax_total?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_orders_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "catalog_carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_orders_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_payments: {
        Row: {
          amount: number
          cart_id: string | null
          created_at: string
          id: string
          method: string
          notes: string | null
          order_id: string | null
          organization_id: string
          paid_at: string | null
          provider: string | null
          reference: string | null
          receipt_image_path: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          cart_id?: string | null
          created_at?: string
          id?: string
          method: string
          notes?: string | null
          order_id?: string | null
          organization_id: string
          paid_at?: string | null
          provider?: string | null
          reference?: string | null
          receipt_image_path?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          cart_id?: string | null
          created_at?: string
          id?: string
          method?: string
          notes?: string | null
          order_id?: string | null
          organization_id?: string
          paid_at?: string | null
          provider?: string | null
          reference?: string | null
          receipt_image_path?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_payments_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "catalog_carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "catalog_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_settings: {
        Row: {
          bank_accounts: Json
          billing_address: string | null
          billing_email: string | null
          billing_name: string | null
          billing_phone: string | null
          billing_rtn: string | null
          checkout_notes: string | null
          created_at: string
          id: string
          order_whatsapp_recipient: string | null
          organization_id: string
          privacy_policy_url: string | null
          shop_description: string | null
          shop_name: string
          shop_tagline: string | null
          terms_url: string | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          bank_accounts?: Json
          billing_address?: string | null
          billing_email?: string | null
          billing_name?: string | null
          billing_phone?: string | null
          billing_rtn?: string | null
          checkout_notes?: string | null
          created_at?: string
          id?: string
          order_whatsapp_recipient?: string | null
          organization_id: string
          privacy_policy_url?: string | null
          shop_description?: string | null
          shop_name?: string
          shop_tagline?: string | null
          terms_url?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          bank_accounts?: Json
          billing_address?: string | null
          billing_email?: string | null
          billing_name?: string | null
          billing_phone?: string | null
          billing_rtn?: string | null
          checkout_notes?: string | null
          created_at?: string
          id?: string
          order_whatsapp_recipient?: string | null
          organization_id?: string
          privacy_policy_url?: string | null
          shop_description?: string | null
          shop_name?: string
          shop_tagline?: string | null
          terms_url?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalog_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_promotions: {
        Row: {
          buy_quantity: number | null
          created_at: string
          expires_at: string | null
          get_quantity: number | null
          id: string
          is_active: boolean
          minimum_quantity: number | null
          name: string
          organization_id: string
          product_id: string | null
          starts_at: string | null
          type: string
          updated_at: string
          value: number
        }
        Insert: {
          buy_quantity?: number | null
          created_at?: string
          expires_at?: string | null
          get_quantity?: number | null
          id?: string
          is_active?: boolean
          minimum_quantity?: number | null
          name: string
          organization_id: string
          product_id?: string | null
          starts_at?: string | null
          type: string
          updated_at?: string
          value?: number
        }
        Update: {
          buy_quantity?: number | null
          created_at?: string
          expires_at?: string | null
          get_quantity?: number | null
          id?: string
          is_active?: boolean
          minimum_quantity?: number | null
          name?: string
          organization_id?: string
          product_id?: string | null
          starts_at?: string | null
          type?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "catalog_promotions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_promotions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_promotion_items: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          product_id: string
          promotion_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          product_id: string
          promotion_id: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          product_id?: string
          promotion_id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_promotion_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_promotion_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_promotion_items_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "catalog_promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_reviews: {
        Row: {
          comment: string | null
          created_at: string
          customer_email: string
          customer_name: string
          id: string
          organization_id: string
          photo_url: string | null
          product_id: string
          rating: number
          status: string
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          id?: string
          organization_id: string
          photo_url?: string | null
          product_id: string
          rating: number
          status?: string
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          id?: string
          organization_id?: string
          photo_url?: string | null
          product_id?: string
          rating?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_reviews_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_shipping_zones: {
        Row: {
          base_rate: number
          city: string | null
          courier: string | null
          created_at: string
          free_shipping_minimum: number | null
          id: string
          is_active: boolean
          name: string
          organization_id: string
          rate_per_kg: number
          updated_at: string
        }
        Insert: {
          base_rate?: number
          city?: string | null
          courier?: string | null
          created_at?: string
          free_shipping_minimum?: number | null
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          rate_per_kg?: number
          updated_at?: string
        }
        Update: {
          base_rate?: number
          city?: string | null
          courier?: string | null
          created_at?: string
          free_shipping_minimum?: number | null
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          rate_per_kg?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_shipping_zones_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_search_documents: {
        Row: {
          embedding: Json | null
          id: string
          organization_id: string
          product_id: string
          search_text: string
          updated_at: string
        }
        Insert: {
          embedding?: Json | null
          id?: string
          organization_id: string
          product_id: string
          search_text: string
          updated_at?: string
        }
        Update: {
          embedding?: Json | null
          id?: string
          organization_id?: string
          product_id?: string
          search_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_search_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_search_documents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_shipments: {
        Row: {
          cost: number
          courier: string | null
          created_at: string
          id: string
          order_id: string
          organization_id: string
          status: string
          tracking_number: string | null
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          cost?: number
          courier?: string | null
          created_at?: string
          id?: string
          order_id: string
          organization_id: string
          status?: string
          tracking_number?: string | null
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          cost?: number
          courier?: string | null
          created_at?: string
          id?: string
          order_id?: string
          organization_id?: string
          status?: string
          tracking_number?: string | null
          updated_at?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalog_shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "catalog_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_shipments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_shipments_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "catalog_shipping_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_wishlist_items: {
        Row: {
          created_at: string
          customer_email: string
          id: string
          organization_id: string
          product_id: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          id?: string
          organization_id: string
          product_id: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          id?: string
          organization_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_wishlist_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_products: {
        Row: {
          collection_id: string
          created_at: string
          id: string
          organization_id: string
          product_id: string
          sort_order: number
        }
        Insert: {
          collection_id: string
          created_at?: string
          id?: string
          organization_id: string
          product_id: string
          sort_order?: number
        }
        Update: {
          collection_id?: string
          created_at?: string
          id?: string
          organization_id?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "collection_products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          banner_url: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          meta_description: string | null
          meta_title: string | null
          name: string
          organization_id: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name: string
          organization_id: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          organization_id?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_payments: {
        Row: {
          amount: number
          cash_closing_id: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          id: string
          notes: string | null
          organization_id: string
          payment_method: string
          sale_id: string | null
        }
        Insert: {
          amount: number
          cash_closing_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          id?: string
          notes?: string | null
          organization_id: string
          payment_method: string
          sale_id?: string | null
        }
        Update: {
          amount?: number
          cash_closing_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          id?: string
          notes?: string | null
          organization_id?: string
          payment_method?: string
          sale_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_payments_cash_closing_id_fkey"
            columns: ["cash_closing_id"]
            isOneToOne: false
            referencedRelation: "cash_closings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payments_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string | null
          credit_enabled: boolean | null
          credit_limit: number | null
          current_balance: number | null
          email: string | null
          id: string
          is_active: boolean
          last_payment_at: string | null
          last_purchase_at: string | null
          name: string
          organization_id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credit_enabled?: boolean | null
          credit_limit?: number | null
          current_balance?: number | null
          email?: string | null
          id?: string
          is_active?: boolean
          last_payment_at?: string | null
          last_purchase_at?: string | null
          name: string
          organization_id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credit_enabled?: boolean | null
          credit_limit?: number | null
          current_balance?: number | null
          email?: string | null
          id?: string
          is_active?: boolean
          last_payment_at?: string | null
          last_purchase_at?: string | null
          name?: string
          organization_id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          plan: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          plan?: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          plan?: string
          slug?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          active: boolean
          barcode: string | null
          cost_price: number
          created_at: string | null
          id: string
          is_default: boolean
          name: string
          organization_id: string
          product_id: string
          sale_price: number
          sku: string | null
          stock: number
        }
        Insert: {
          active?: boolean
          barcode?: string | null
          cost_price?: number
          created_at?: string | null
          id?: string
          is_default?: boolean
          name: string
          organization_id: string
          product_id: string
          sale_price?: number
          sku?: string | null
          stock?: number
        }
        Update: {
          active?: boolean
          barcode?: string | null
          cost_price?: number
          created_at?: string | null
          id?: string
          is_default?: boolean
          name?: string
          organization_id?: string
          product_id?: string
          sale_price?: number
          sku?: string | null
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          brand_id: string | null
          category_id: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          min_stock: number | null
          name: string
          offer_price: number | null
          organization_id: string
          sale_price: number | null
          sku: string | null
          stock: number | null
          updated_at: string | null
        }
        Insert: {
          barcode?: string | null
          brand_id?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          min_stock?: number | null
          name: string
          offer_price?: number | null
          organization_id: string
          sale_price?: number | null
          sku?: string | null
          stock?: number | null
          updated_at?: string | null
        }
        Update: {
          barcode?: string | null
          brand_id?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          min_stock?: number | null
          name?: string
          offer_price?: number | null
          organization_id?: string
          sale_price?: number | null
          sku?: string | null
          stock?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attributes: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string
          product_id: string
          sort_order: number
          type: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
          product_id: string
          sort_order?: number
          type?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          product_id?: string
          sort_order?: number
          type?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_attributes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_attributes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          is_primary: boolean
          organization_id: string
          path: string
          product_id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          organization_id: string
          path: string
          product_id: string
          sort_order?: number
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          organization_id?: string
          path?: string
          product_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_publications: {
        Row: {
          canonical_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_featured: boolean
          is_visible: boolean
          meta_description: string | null
          meta_title: string | null
          open_graph_description: string | null
          open_graph_image_url: string | null
          open_graph_title: string | null
          organization_id: string
          product_id: string
          published_at: string | null
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_featured?: boolean
          is_visible?: boolean
          meta_description?: string | null
          meta_title?: string | null
          open_graph_description?: string | null
          open_graph_image_url?: string | null
          open_graph_title?: string | null
          organization_id: string
          product_id: string
          published_at?: string | null
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_featured?: boolean
          is_visible?: boolean
          meta_description?: string | null
          meta_title?: string | null
          open_graph_description?: string | null
          open_graph_image_url?: string | null
          open_graph_title?: string | null
          organization_id?: string
          product_id?: string
          published_at?: string | null
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_publications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_publications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          branch_id: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          organization_id: string | null
          role: string
        }
        Insert: {
          avatar_url?: string | null
          branch_id?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          organization_id?: string | null
          role?: string
        }
        Update: {
          avatar_url?: string | null
          branch_id?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          cost_price: number
          id: string
          product_id: string
          purchase_order_id: string
          quantity: number
          subtotal: number
        }
        Insert: {
          cost_price: number
          id?: string
          product_id: string
          purchase_order_id: string
          quantity: number
          subtotal: number
        }
        Update: {
          cost_price?: number
          id?: string
          product_id?: string
          purchase_order_id?: string
          quantity?: number
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string
          created_by: string | null
          discount: number
          expected_date: string | null
          id: string
          notes: string | null
          number: string | null
          order_date: string
          organization_id: string
          received_at: string | null
          received_by: string | null
          status: string
          subtotal: number
          supplier_id: string
          tax: number
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          discount?: number
          expected_date?: string | null
          id?: string
          notes?: string | null
          number?: string | null
          order_date?: string
          organization_id: string
          received_at?: string | null
          received_by?: string | null
          status?: string
          subtotal?: number
          supplier_id: string
          tax?: number
          total?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          discount?: number
          expected_date?: string | null
          id?: string
          notes?: string | null
          number?: string | null
          order_date?: string
          organization_id?: string
          received_at?: string | null
          received_by?: string | null
          status?: string
          subtotal?: number
          supplier_id?: string
          tax?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          id: string
          price: number
          product_id: string
          quantity: number
          sale_id: string
        }
        Insert: {
          id?: string
          price: number
          product_id: string
          quantity: number
          sale_id: string
        }
        Update: {
          id?: string
          price?: number
          product_id?: string
          quantity?: number
          sale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_payments: {
        Row: {
          amount: number
          cash_closing_id: string | null
          created_at: string | null
          created_by: string | null
          customer_payment_id: string | null
          id: string
          method: string
          organization_id: string
          reference: string | null
          sale_id: string
        }
        Insert: {
          amount: number
          cash_closing_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_payment_id?: string | null
          id?: string
          method: string
          organization_id: string
          reference?: string | null
          sale_id: string
        }
        Update: {
          amount?: number
          cash_closing_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_payment_id?: string | null
          id?: string
          method?: string
          organization_id?: string
          reference?: string | null
          sale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sale_payments_cash_closing_id_fkey"
            columns: ["cash_closing_id"]
            isOneToOne: false
            referencedRelation: "cash_closings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_payments_customer_payment_id_fkey"
            columns: ["customer_payment_id"]
            isOneToOne: false
            referencedRelation: "customer_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_payments_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          cash_closing_id: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          invoice_number: string | null
          organization_id: string
          paid_amount: number | null
          payment_method: string | null
          payment_status: string | null
          pending_amount: number | null
          total: number
          updated_at: string | null
        }
        Insert: {
          cash_closing_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          invoice_number?: string | null
          organization_id: string
          paid_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          pending_amount?: number | null
          total: number
          updated_at?: string | null
        }
        Update: {
          cash_closing_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          invoice_number?: string | null
          organization_id?: string
          paid_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          pending_amount?: number | null
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_cash_closing_id_fkey"
            columns: ["cash_closing_id"]
            isOneToOne: false
            referencedRelation: "cash_closings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          movement_type: string
          notes: string | null
          organization_id: string | null
          product_id: string
          quantity: number
          reference_id: string | null
          reference_type: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          movement_type: string
          notes?: string | null
          organization_id?: string | null
          product_id: string
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          movement_type?: string
          notes?: string | null
          organization_id?: string | null
          product_id?: string
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_method: string | null
          purchase_order_id: string
          reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          payment_method?: string | null
          purchase_order_id: string
          reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_method?: string | null
          purchase_order_id?: string
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_payments_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          organization_id: string
          phone: string | null
          rtn: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          organization_id: string
          phone?: string | null
          rtn?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          organization_id?: string
          phone?: string | null
          rtn?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      receive_purchase_order: {
        Args: { p_purchase_order_id: string; p_received_by: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
