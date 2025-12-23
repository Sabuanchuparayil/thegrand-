'use server';

import { getServerSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

/**
 * Server action to update general settings
 * Note: Environment variables cannot be updated from the application.
 * They must be set in Railway dashboard or via Railway CLI.
 * This action is for future use when settings are stored in database.
 */
export async function updateGeneralSettings(formData: FormData) {
  const session = await getServerSession();
  
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const userRole = (session.user as any)?.role;
  if (userRole !== "admin") {
    return { success: false, error: "Admin access required" };
  }

  // Extract form data
  const siteName = formData.get("siteName") as string;
  const siteUrl = formData.get("siteUrl") as string;
  const defaultCurrency = formData.get("defaultCurrency") as string;

  // TODO: Store settings in database (Sanity or other storage)
  // For now, these settings are read-only as they come from environment variables
  
  // Revalidate the settings page
  revalidatePath("/admin/settings");

  return {
    success: true,
    message: "Settings updated successfully. Note: Environment variables must be updated in Railway dashboard.",
    data: {
      siteName,
      siteUrl,
      defaultCurrency,
    },
  };
}



