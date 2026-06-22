export type UserRole = "mother" | "partner" | "family_viewer" | "admin" | "sponsor";
export type PrivacyLevel = "private" | "partner" | "family";
export type MediaAssetType = "photo" | "video" | "scan" | "document" | "voice_note";

export type JourneyInsert = {
  role: UserRole;
  due_date: string | null;
  country: string;
  baby_nickname: string;
  invite_partner_email: string | null;
  privacy_level: PrivacyLevel;
  notification_preferences: string[];
};

export type Database = {
  public: {
    Tables: {
      lead_captures: {
        Row: { id: string; email: string; source: string; marketing_consent: boolean; created_at: string; };
        Insert: { id?: string; email: string; source: string; marketing_consent?: boolean; created_at?: string; };
        Update: { email?: string; source?: string; marketing_consent?: boolean; };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          country: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          country?: string | null;
          created_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          role?: UserRole;
          country?: string | null;
        };
        Relationships: [];
      };
      families: {
        Row: {
          id: string;
          owner_id: string;
          baby_nickname: string;
          due_date: string | null;
          country: string | null;
          privacy_level: PrivacyLevel;
          subscription_plan: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          baby_nickname: string;
          due_date?: string | null;
          country?: string | null;
          privacy_level?: PrivacyLevel;
          subscription_plan?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
        };
        Update: {
          baby_nickname?: string;
          due_date?: string | null;
          country?: string | null;
          privacy_level?: PrivacyLevel;
          subscription_plan?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
        };
        Relationships: [];
      };
      family_members: {
        Row: {
          family_id: string;
          profile_id: string;
          member_role: UserRole;
          consent_granted_at: string | null;
        };
        Insert: {
          family_id: string;
          profile_id: string;
          member_role: UserRole;
          consent_granted_at?: string | null;
        };
        Update: {
          member_role?: UserRole;
          consent_granted_at?: string | null;
        };
        Relationships: [];
      };
      partner_invites: {
        Row: {
          id: string;
          family_id: string;
          invited_email: string;
          invited_by: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          invited_email: string;
          invited_by: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          status?: string;
        };
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          family_id: string;
          title: string;
          appointment_type: string | null;
          starts_at: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          title: string;
          appointment_type?: string | null;
          starts_at: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          appointment_type?: string | null;
          starts_at?: string;
          notes?: string | null;
        };
        Relationships: [];
      };
      health_entries: {
        Row: {
          id: string;
          family_id: string;
          entry_type: string;
          value: Record<string, unknown>;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          entry_type: string;
          value: Record<string, unknown>;
          recorded_at?: string;
        };
        Update: {
          entry_type?: string;
          value?: Record<string, unknown>;
          recorded_at?: string;
        };
        Relationships: [];
      };
      journal_entries: {
        Row: {
          id: string;
          family_id: string;
          author_id: string;
          title: string | null;
          body: string;
          pregnancy_week: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          author_id: string;
          title?: string | null;
          body: string;
          pregnancy_week?: number | null;
          created_at?: string;
        };
        Update: {
          title?: string | null;
          body?: string;
          pregnancy_week?: number | null;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          id: string;
          family_id: string;
          owner_id: string;
          asset_type: MediaAssetType;
          storage_path: string;
          caption: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          owner_id: string;
          asset_type: MediaAssetType;
          storage_path: string;
          caption?: string | null;
          created_at?: string;
        };
        Update: {
          asset_type?: MediaAssetType;
          storage_path?: string;
          caption?: string | null;
        };
        Relationships: [];
      };
      baby_milestones: {
        Row: {
          id: string;
          family_id: string;
          title: string;
          happened_on: string | null;
          notes: string | null;
          media_asset_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          title: string;
          happened_on?: string | null;
          notes?: string | null;
          media_asset_id?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          happened_on?: string | null;
          notes?: string | null;
          media_asset_id?: string | null;
        };
        Relationships: [];
      };
      couple_tasks: {
        Row: {
          id: string;
          family_id: string;
          created_by: string;
          title: string;
          notes: string | null;
          due_date: string | null;
          assignee_label: string;
          status: "todo" | "in_progress" | "done";
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          created_by: string;
          title: string;
          notes?: string | null;
          due_date?: string | null;
          assignee_label?: string;
          status?: "todo" | "in_progress" | "done";
          created_at?: string;
        };
        Update: {
          title?: string;
          notes?: string | null;
          due_date?: string | null;
          assignee_label?: string;
          status?: "todo" | "in_progress" | "done";
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      privacy_level: PrivacyLevel;
    };
    CompositeTypes: Record<string, never>;
  };
};
