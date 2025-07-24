// app/dashboard/actions.ts

"use server";

import { createClient } from "@/utils/supabase/server"; // Use our modern helper
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createFolder(folderName: string) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // This should not happen if the page is protected, but it's a good safeguard
    return redirect("/");
  }

  if (!folderName || folderName.length < 3) {
    return { error: "Folder name must be at least 3 characters long." };
  }

  const { error } = await supabase
    .from("folders")
    .insert({ name: folderName, user_id: user.id });

  if (error) {
    console.error("Error creating folder:", error);
    return { error: "Could not create the folder. Please try again." };
  }

  // Revalidate the dashboard path to show the new folder immediately
  revalidatePath("/dashboard");

  return { success: true };
}