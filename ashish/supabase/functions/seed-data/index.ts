import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Categories to seed
const CATEGORIES = [
  "Fitness", "Tech", "Gaming", "Music", "Finance", "Comedy", "Cooking", "Fashion"
];

// Status options for creators
const STATUSES = ["Live", "Online", "Busy", "Offline"] as const;

// Bio templates
const BIO_TEMPLATES = [
  "Passionate {category} enthusiast with years of experience. Let's connect!",
  "Your go-to expert for all things {category}. Book a call today!",
  "Sharing my {category} journey and helping others succeed.",
  "Professional {category} creator. Tips, tricks, and live sessions!",
  "{category} is my life! Join me for personalized advice.",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse the CSV data from the request body
    const { csvData } = await req.json();
    
    if (!csvData) {
      throw new Error("No CSV data provided");
    }

    // Parse CSV
    const lines = csvData.trim().split("\n");
    const headers = lines[0].split(",");
    
    const users = lines.slice(1).map((line: string) => {
      const values = line.split(",");
      const user: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        user[header.trim()] = values[index]?.trim() || "";
      });
      return user;
    });

    console.log(`Parsed ${users.length} users from CSV`);

    // Separate fans and creators
    const fans = users.filter((u: Record<string, string>) => u.role_id === "2");
    const creators = users.filter((u: Record<string, string>) => u.role_id === "3");

    console.log(`Found ${fans.length} fans and ${creators.length} creators`);

    // Get category IDs
    const { data: categoryData, error: catError } = await supabase
      .from("categories")
      .select("id, name");
    
    if (catError) throw catError;
    
    const categoryMap = new Map(categoryData.map((c: { id: string; name: string }) => [c.name, c.id]));

    // Insert profiles (all users)
    const profilesInsert = users.map((u: Record<string, string>) => ({
      original_id: parseInt(u.id),
      name: u.name,
      dob: u.dob || null,
      role: u.role_id === "3" ? "creator" : "fan",
      state: u.state || null,
      city: u.city || null,
      wallet_balance_inr: u.wallet_balance_inr ? parseInt(u.wallet_balance_inr) : 0,
    }));

    // Batch insert profiles
    const batchSize = 500;
    let insertedProfiles = 0;
    
    for (let i = 0; i < profilesInsert.length; i += batchSize) {
      const batch = profilesInsert.slice(i, i + batchSize);
      const { error: profError } = await supabase
        .from("profiles")
        .insert(batch);
      
      if (profError) {
        console.error(`Profile batch error at ${i}:`, profError);
        throw profError;
      }
      insertedProfiles += batch.length;
    }

    console.log(`Inserted ${insertedProfiles} profiles`);

    // Get all profiles to link creators
    const { data: allProfiles, error: fetchError } = await supabase
      .from("profiles")
      .select("id, original_id, name")
      .eq("role", "creator");
    
    if (fetchError) throw fetchError;

    const profileMap = new Map(allProfiles.map((p: { id: string; original_id: number }) => [p.original_id, p.id]));

    // Insert creators with mock data
    const creatorsInsert = creators.map((c: Record<string, string>, index: number) => {
      const profileId = profileMap.get(parseInt(c.id));
      const randomStatus = STATUSES[Math.floor(Math.random() * STATUSES.length)];
      const isAvailable = randomStatus === "Live" || randomStatus === "Online";
      const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const bioTemplate = BIO_TEMPLATES[Math.floor(Math.random() * BIO_TEMPLATES.length)];
      
      return {
        profile_id: profileId,
        video_call_price_inr: c.video_call_price_inr_per_min ? parseInt(c.video_call_price_inr_per_min) : Math.floor(Math.random() * 100) + 50,
        audio_call_price_inr: c.audio_call_price_inr_per_min ? parseInt(c.audio_call_price_inr_per_min) : Math.floor(Math.random() * 50) + 25,
        status: randomStatus,
        available_slots: isAvailable ? Math.floor(Math.random() * 6) + 1 : 0,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`,
        bio: bioTemplate.replace("{category}", randomCategory),
        is_trending: Math.random() < 0.15, // 15% chance of trending
      };
    });

    // Insert creators
    const { data: insertedCreators, error: creatorsError } = await supabase
      .from("creators")
      .insert(creatorsInsert)
      .select("id, profile_id");
    
    if (creatorsError) {
      console.error("Creators insert error:", creatorsError);
      throw creatorsError;
    }

    console.log(`Inserted ${insertedCreators.length} creators`);

    // Assign random categories to creators
    const creatorCategoriesInsert: { creator_id: string; category_id: string }[] = [];
    
    insertedCreators.forEach((creator: { id: string }) => {
      // Each creator gets 1-3 random categories
      const numCategories = Math.floor(Math.random() * 3) + 1;
      const shuffledCategories = [...CATEGORIES].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < numCategories; i++) {
        const categoryId = categoryMap.get(shuffledCategories[i]);
        if (categoryId) {
          creatorCategoriesInsert.push({
            creator_id: creator.id,
            category_id: categoryId,
          });
        }
      }
    });

    // Insert creator categories
    const { error: ccError } = await supabase
      .from("creator_categories")
      .insert(creatorCategoriesInsert);
    
    if (ccError) {
      console.error("Creator categories error:", ccError);
      throw ccError;
    }

    console.log(`Assigned ${creatorCategoriesInsert.length} category links`);

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          totalUsers: users.length,
          fans: fans.length,
          creators: creators.length,
          categoryLinks: creatorCategoriesInsert.length,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Seed error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
