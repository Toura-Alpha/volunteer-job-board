"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function submitApplication(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const listingId = formData.get("listingId") as string;
  const name = formData.get("name") as string;
  const coverMessage = formData.get("coverMessage") as string;

  if (!listingId || !name || !coverMessage) {
    throw new Error("Missing required fields");
  }

  const { error } = await supabase.from("applications").insert({
    listing_id: listingId,
    applicant_id: user.id,
    name: name,
    cover_message: coverMessage,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/listings/${listingId}`);
  return { success: true };
}
