import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatorWithCategory } from "./useCreators";

export function useFavorites(fanProfileId?: string) {
  return useQuery({
    queryKey: ["favorites", fanProfileId],
    queryFn: async () => {
      // For now, get all favorites (no auth yet)
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          id,
          created_at,
          creator:creators (
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
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return (data || []).map((fav) => ({
        favoriteId: fav.id,
        createdAt: fav.created_at,
        creator: {
          ...fav.creator,
          category: (fav.creator as unknown as CreatorWithCategory).categories?.[0]?.category?.name || "General",
        },
      }));
    },
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ fanProfileId, creatorId }: { fanProfileId: string; creatorId: string }) => {
      const { data, error } = await supabase
        .from("favorites")
        .insert({ fan_profile_id: fanProfileId, creator_id: creatorId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ fanProfileId, creatorId }: { fanProfileId: string; creatorId: string }) => {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("fan_profile_id", fanProfileId)
        .eq("creator_id", creatorId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
