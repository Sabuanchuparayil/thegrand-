import { createClient } from "@sanity/client";

// Get Sanity configuration from environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Create client only if projectId is available
// During build, if projectId is missing, we'll use a placeholder that won't cause errors
export const client = createClient({
  projectId: projectId || "placeholder-for-build",
  dataset: dataset,
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
  // Disable requests if projectId is not set (build-time safety)
  ...(projectId ? {} : { token: undefined }),
});

