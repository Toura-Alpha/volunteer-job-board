"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function getAdminUsers() {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  const [{ data: authData }, { data: profiles }] = await Promise.all([
    adminSupabase.auth.admin.listUsers(),
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const authUsers = authData?.users || [];
  const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

  return authUsers.map((authUser) => {
    const profile = profileMap.get(authUser.id) as
      | {
          role?: string;
          location?: string;
          phone?: string;
          bio?: string;
          admin_password?: string;
        }
      | undefined;

    return {
      id: authUser.id,
      email: authUser.email || "No email found",
      created_at: authUser.created_at,
      role: profile?.role || "applicant",
      location: profile?.location || "",
      phone: profile?.phone || "",
      bio: profile?.bio || "",
      admin_password: profile?.admin_password || "",
    };
  });
}

export async function updateUserRoleAndPass(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  if (!currentUser) throw new Error("Unauthorized");

  const targetUserId = formData.get("userId") as string;
  const newRole = formData.get("role") as string;
  const targetAdminPassword = formData.get("adminPassword") as string;
  const authorizingPassword = formData.get("authorizingPassword") as string;

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("admin_password, role")
    .eq("id", currentUser.id)
    .single();

  if (
    !currentProfile ||
    currentProfile.role !== "admin" ||
    currentProfile.admin_password !== authorizingPassword
  ) {
    throw new Error(
      "Invalid admin authorization password. Changes could not be saved.",
    );
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      role: newRole,
      admin_password: newRole === "admin" ? targetAdminPassword : null,
    })
    .eq("id", targetUserId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/dashboard/users");
}
