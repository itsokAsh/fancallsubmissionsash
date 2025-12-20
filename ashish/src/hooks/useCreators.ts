import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Creator {
  id: string;
  profile_id: string;
  video_call_price_inr: number;
  audio_call_price_inr: number;
  status: "Live" | "Online" | "Busy" | "Offline";
  available_slots: number;
  avatar_url: string | null;
  bio: string | null;
  is_trending: boolean;
  created_at: string;
  profile: {
    id: string;
    name: string;
    original_id: number;
    dob: string | null;
    state: string | null;
    city: string | null;
  };
  categories: {
    category: {
      id: string;
      name: string;
      icon: string | null;
    };
  }[];
}

export interface CreatorWithCategory extends Creator {
  category: string; // Primary category for display
}

export function useCreators() {
  return useQuery({
    queryKey: ["creators"],
    queryFn: async (): Promise<CreatorWithCategory[]> => {
      const { data, error } = await supabase
        .from("creators")
        .select(`
          *,
          profile:profiles!creators_profile_id_fkey (
            id,
            name,
            original_id,
            dob,
            state,
            city
          ),
          categories:creator_categories (
            category:categories (
              id,
              name,
              icon
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform to add primary category
      return (data || []).map((creator) => ({
        ...creator,
        category: creator.categories?.[0]?.category?.name || "General",
      }));
    },
  });
}

export function useCreator(id: string) {
  return useQuery({
    queryKey: ["creator", id],
    queryFn: async (): Promise<CreatorWithCategory | null> => {
      const { data, error } = await supabase
        .from("creators")
        .select(`
          *,
          profile:profiles!creators_profile_id_fkey (
            id,
            name,
            original_id,
            dob,
            state,
            city
          ),
          categories:creator_categories (
            category:categories (
              id,
              name,
              icon
            )
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        category: data.categories?.[0]?.category?.name || "General",
      };
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });
}

export function useSimilarCreators(category: string, excludeId: string) {
  return useQuery({
    queryKey: ["similar-creators", category, excludeId],
    queryFn: async (): Promise<CreatorWithCategory[]> => {
      // Get creators in the same category who are available
      const { data, error } = await supabase
        .from("creators")
        .select(`
          *,
          profile:profiles!creators_profile_id_fkey (
            id,
            name,
            original_id,
            dob,
            state,
            city
          ),
          categories:creator_categories (
            category:categories (
              id,
              name,
              icon
            )
          )
        `)
        .neq("id", excludeId)
        .in("status", ["Live", "Online"])
        .gt("available_slots", 0)
        .limit(3);

      if (error) throw error;

      // Filter by category and transform
      return (data || [])
        .filter((c) => c.categories?.some((cat: { category: { name: string } }) => cat.category?.name === category))
        .map((creator) => ({
          ...creator,
          category: creator.categories?.[0]?.category?.name || "General",
        }));
    },
    enabled: !!category && !!excludeId,
  });
}
