// Runtime loader for @mediapipe/face_mesh to avoid build-time import issues
export async function loadFaceMesh() {
  if (typeof window === "undefined") {
    throw new Error("FaceMesh can only be loaded in the browser");
  }

  // Use dynamic import to load the package at runtime
  const module = await import("@mediapipe/face_mesh");
  
  // The package exports FaceMesh in a non-standard way
  // Try different possible export patterns
  const FaceMesh = (module as any).FaceMesh || 
                   (module as any).default?.FaceMesh || 
                   (module as any).default ||
                   module;
  
  if (!FaceMesh) {
    throw new Error("Could not find FaceMesh in @mediapipe/face_mesh package");
  }

  return FaceMesh;
}

