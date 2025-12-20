import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Booking {
  id: string;
  fan_profile_id: string;
  creator_id: string;
  call_type: "video" | "audio";
  dwell_percent: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  scheduled_at: string | null;
  created_at: string;
}

export function useBookings(fanProfileId?: string) {
  return useQuery({
    queryKey: ["bookings", fanProfileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          creator:creators (
            *,
            profile:profiles!creators_profile_id_fkey (
              id,
              name
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      fanProfileId,
      creatorId,
      callType,
      dwellPercent,
      scheduledAt,
    }: {
      fanProfileId: string;
      creatorId: string;
      callType: "video" | "audio";
      dwellPercent: number;
      scheduledAt?: string;
    }) => {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          fan_profile_id: fanProfileId,
          creator_id: creatorId,
          call_type: callType,
          dwell_percent: dwellPercent,
          scheduled_at: scheduledAt || null,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
