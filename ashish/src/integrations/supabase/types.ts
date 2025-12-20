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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          call_type: Database["public"]["Enums"]["call_type"]
          created_at: string | null
          creator_id: string
          dwell_percent: number | null
          fan_profile_id: string
          id: string
          scheduled_at: string | null
          status: Database["public"]["Enums"]["booking_status"]
        }
        Insert: {
          call_type: Database["public"]["Enums"]["call_type"]
          created_at?: string | null
          creator_id: string
          dwell_percent?: number | null
          fan_profile_id: string
          id?: string
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
        }
        Update: {
          call_type?: Database["public"]["Enums"]["call_type"]
          created_at?: string | null
          creator_id?: string
          dwell_percent?: number | null
          fan_profile_id?: string
          id?: string
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
        }
        Relationships: [
          {
            foreignKeyName: "bookings_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_fan_profile_id_fkey"
            columns: ["fan_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      creator_categories: {
        Row: {
          category_id: string
          creator_id: string
        }
        Insert: {
          category_id: string
          creator_id: string
        }
        Update: {
          category_id?: string
          creator_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_categories_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
      creators: {
        Row: {
          audio_call_price_inr: number
          available_slots: number
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          is_trending: boolean | null
          profile_id: string
          status: Database["public"]["Enums"]["creator_status"]
          video_call_price_inr: number
        }
        Insert: {
          audio_call_price_inr?: number
          available_slots?: number
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          is_trending?: boolean | null
          profile_id: string
          status?: Database["public"]["Enums"]["creator_status"]
          video_call_price_inr?: number
        }
        Update: {
          audio_call_price_inr?: number
          available_slots?: number
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          is_trending?: boolean | null
          profile_id?: string
          status?: Database["public"]["Enums"]["creator_status"]
          video_call_price_inr?: number
        }
        Relationships: [
          {
            foreignKeyName: "creators_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          creator_id: string
          fan_profile_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          fan_profile_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          fan_profile_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_fan_profile_id_fkey"
            columns: ["fan_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string | null
          dob: string | null
          id: string
          name: string
          original_id: number
          role: Database["public"]["Enums"]["user_role"]
          state: string | null
          wallet_balance_inr: number | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          dob?: string | null
          id?: string
          name: string
          original_id: number
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          wallet_balance_inr?: number | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          dob?: string | null
          id?: string
          name?: string
          original_id?: number
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          wallet_balance_inr?: number | null
        }
        Relationships: []
      }
      user_categories: {
        Row: {
          category_id: string
          profile_id: string
        }
        Insert: {
          category_id: string
          profile_id: string
        }
        Update: {
          category_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_categories_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          created_at: string | null
          creator_id: string
          id: string
          thumbnail_url: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          id?: string
          thumbnail_url?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          id?: string
          thumbnail_url?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "completed" | "cancelled"
      call_type: "video" | "audio"
      creator_status: "Live" | "Online" | "Busy" | "Offline"
      user_role: "fan" | "creator"
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
    Enums: {
      booking_status: ["pending", "confirmed", "completed", "cancelled"],
      call_type: ["video", "audio"],
      creator_status: ["Live", "Online", "Busy", "Offline"],
      user_role: ["fan", "creator"],
    },
  },
} as const
