"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createListing(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const organization = formData.get("organization") as string;

  const { error } = await supabase.from("listings").insert({
    title,
    description,
    location,
    organization,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/dashboard/listings");
  revalidatePath("/listings");
  redirect("/admin/dashboard/listings");
}
