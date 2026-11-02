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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      hadiths: {
        Row: {
          bab: string | null
          code: string
          created_at: string
          derajat: string | null
          id: string
          is_published: boolean
          jenis: string | null
          kategori: Database["public"]["Enums"]["tanda_kategori"] | null
          kitab: string | null
          link_sumber: string | null
          matan_ringkas_en: string | null
          matan_ringkas_id: string | null
          nomor: string | null
          penilai_derajat: string | null
          rujukan_syarah: string | null
          status: Database["public"]["Enums"]["hadith_status"] | null
          syarah_ringkas: string | null
          teks_arab: string
          tema: string | null
          terjemah_en: string | null
          terjemah_id: string | null
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          bab?: string | null
          code: string
          created_at?: string
          derajat?: string | null
          id?: string
          is_published?: boolean
          jenis?: string | null
          kategori?: Database["public"]["Enums"]["tanda_kategori"] | null
          kitab?: string | null
          link_sumber?: string | null
          matan_ringkas_en?: string | null
          matan_ringkas_id?: string | null
          nomor?: string | null
          penilai_derajat?: string | null
          rujukan_syarah?: string | null
          status?: Database["public"]["Enums"]["hadith_status"] | null
          syarah_ringkas?: string | null
          teks_arab: string
          tema?: string | null
          terjemah_en?: string | null
          terjemah_id?: string | null
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          bab?: string | null
          code?: string
          created_at?: string
          derajat?: string | null
          id?: string
          is_published?: boolean
          jenis?: string | null
          kategori?: Database["public"]["Enums"]["tanda_kategori"] | null
          kitab?: string | null
          link_sumber?: string | null
          matan_ringkas_en?: string | null
          matan_ringkas_id?: string | null
          nomor?: string | null
          penilai_derajat?: string | null
          rujukan_syarah?: string | null
          status?: Database["public"]["Enums"]["hadith_status"] | null
          syarah_ringkas?: string | null
          teks_arab?: string
          tema?: string | null
          terjemah_en?: string | null
          terjemah_id?: string | null
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      sign_hadiths: {
        Row: {
          created_at: string
          hadith_id: string
          sign_id: string
        }
        Insert: {
          created_at?: string
          hadith_id: string
          sign_id: string
        }
        Update: {
          created_at?: string
          hadith_id?: string
          sign_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sign_hadiths_hadith_id_fkey"
            columns: ["hadith_id"]
            isOneToOne: false
            referencedRelation: "hadiths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sign_hadiths_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs"
            referencedColumns: ["id"]
          },
        ]
      }
      signs: {
        Row: {
          created_at: string
          deskripsi_singkat: string | null
          id: string
          kategori: Database["public"]["Enums"]["tanda_kategori"] | null
          nama: string
          slug: string
          status: Database["public"]["Enums"]["sign_status"]
          updated_at: string
          urutan: number
        }
        Insert: {
          created_at?: string
          deskripsi_singkat?: string | null
          id?: string
          kategori?: Database["public"]["Enums"]["tanda_kategori"] | null
          nama: string
          slug: string
          status?: Database["public"]["Enums"]["sign_status"]
          updated_at?: string
          urutan?: number
        }
        Update: {
          created_at?: string
          deskripsi_singkat?: string | null
          id?: string
          kategori?: Database["public"]["Enums"]["tanda_kategori"] | null
          nama?: string
          slug?: string
          status?: Database["public"]["Enums"]["sign_status"]
          updated_at?: string
          urutan?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "reviewer"
      hadith_status:
        | "sudah_terjadi"
        | "sedang_berlangsung"
        | "belum_terjadi"
        | "tidak_berlaku"
      sign_status: "sudah_terjadi" | "sedang_berlangsung" | "belum_terjadi"
      tanda_kategori:
        | "tanda_kecil"
        | "tanda_besar"
        | "fitnah"
        | "akhirat"
        | "umum"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "reviewer"],
      hadith_status: [
        "sudah_terjadi",
        "sedang_berlangsung",
        "belum_terjadi",
        "tidak_berlaku",
      ],
      sign_status: ["sudah_terjadi", "sedang_berlangsung", "belum_terjadi"],
      tanda_kategori: [
        "tanda_kecil",
        "tanda_besar",
        "fitnah",
        "akhirat",
        "umum",
      ],
    },
  },
} as const
