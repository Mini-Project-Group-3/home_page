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
      marketplace_crops: {
        Row: {
          created_at: string
          crop_id: string | null
          grade: string | null
          harvest_date: string | null
          id: string
          images: Json | null
          is_organic: boolean | null
          listing_id: string
          moisture_pct: number | null
          name: string
          negotiable: boolean | null
          price_per_qtl: number | null
          quantity_qtl: number | null
          season: string | null
          storage_type: string | null
          variety: string | null
        }
        Insert: {
          created_at?: string
          crop_id?: string | null
          grade?: string | null
          harvest_date?: string | null
          id?: string
          images?: Json | null
          is_organic?: boolean | null
          listing_id: string
          moisture_pct?: number | null
          name: string
          negotiable?: boolean | null
          price_per_qtl?: number | null
          quantity_qtl?: number | null
          season?: string | null
          storage_type?: string | null
          variety?: string | null
        }
        Update: {
          created_at?: string
          crop_id?: string | null
          grade?: string | null
          harvest_date?: string | null
          id?: string
          images?: Json | null
          is_organic?: boolean | null
          listing_id?: string
          moisture_pct?: number | null
          name?: string
          negotiable?: boolean | null
          price_per_qtl?: number | null
          quantity_qtl?: number | null
          season?: string | null
          storage_type?: string | null
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_crops_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_listings: {
        Row: {
          created_at: string
          district: string | null
          farmer_id: string | null
          farmer_name: string
          govt_notes: string | null
          id: string
          language: string | null
          lat: number | null
          lng: number | null
          location_source: string | null
          nearest_mandi: string | null
          phone: string
          pincode: string | null
          session_id: string | null
          state: string | null
          status: string
          village: string | null
        }
        Insert: {
          created_at?: string
          district?: string | null
          farmer_id?: string | null
          farmer_name: string
          govt_notes?: string | null
          id?: string
          language?: string | null
          lat?: number | null
          lng?: number | null
          location_source?: string | null
          nearest_mandi?: string | null
          phone: string
          pincode?: string | null
          session_id?: string | null
          state?: string | null
          status?: string
          village?: string | null
        }
        Update: {
          created_at?: string
          district?: string | null
          farmer_id?: string | null
          farmer_name?: string
          govt_notes?: string | null
          id?: string
          language?: string | null
          lat?: number | null
          lng?: number | null
          location_source?: string | null
          nearest_mandi?: string | null
          phone?: string
          pincode?: string | null
          session_id?: string | null
          state?: string | null
          status?: string
          village?: string | null
        }
        Relationships: []
      }
      scheme_applications: {
        Row: {
          aadhaar_last_four: string | null
          created_at: string
          district: string
          email: string | null
          farmer_name: string
          id: string
          land_area_acres: number | null
          message: string | null
          phone: string
          scheme_name: string
          state: string
          village: string | null
        }
        Insert: {
          aadhaar_last_four?: string | null
          created_at?: string
          district: string
          email?: string | null
          farmer_name: string
          id?: string
          land_area_acres?: number | null
          message?: string | null
          phone: string
          scheme_name: string
          state: string
          village?: string | null
        }
        Update: {
          aadhaar_last_four?: string | null
          created_at?: string
          district?: string
          email?: string | null
          farmer_name?: string
          id?: string
          land_area_acres?: number | null
          message?: string | null
          phone?: string
          scheme_name?: string
          state?: string
          village?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
