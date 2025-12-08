"use client";

import { useEffect, useRef, createElement } from "react";
import { X } from "lucide-react";

interface ARViewer3DProps {
  modelUrl?: string;
  onClose?: () => void;
}

export default function ARViewer3D({ modelUrl, onClose }: ARViewer3DProps) {
  const modelViewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Dynamically import model-viewer to avoid SSR issues
    const loadModelViewer = async () => {
      if (typeof window !== "undefined" && !customElements.get("model-viewer")) {
        const modelViewerModule = await import("@google/model-viewer");
        // Handle different export patterns
        const ModelViewer = (modelViewerModule as any).default || modelViewerModule;
        if (ModelViewer) {
          customElements.define("model-viewer", ModelViewer);
        }
      }
    };

    loadModelViewer();
  }, []);

  if (!modelUrl) {
    return (
      <div className="fixed inset-0 z-50 bg-charcoal/90 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4">
          <h3 className="text-xl font-serif font-bold text-charcoal mb-4">
            No 3D Model Available
          </h3>
          <p className="text-charcoal/70 mb-6">
            This product does not have a 3D model for AR viewing.
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-3 bg-emerald text-white rounded-lg hover:bg-emerald-dark transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-charcoal flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 glass-morphism p-4 flex items-center justify-between">
        <h2 className="text-xl font-serif font-bold text-white">
          3D AR Viewer
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:text-gold transition-colors"
            aria-label="Close AR viewer"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Model Viewer */}
      <div className="flex-1 relative">
        {typeof window !== "undefined" &&
          createElement(
            "model-viewer",
            {
              ref: modelViewerRef,
              src: modelUrl,
              ar: true,
              "ar-modes": "webxr scene-viewer quick-look",
              "auto-rotate": true,
              "camera-controls": true,
              style: {
                width: "100%",
                height: "100%",
                backgroundColor: "#141414",
              },
              alt: "3D Jewelry Model",
            } as any
          )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 text-center text-white/80 text-sm space-y-2">
        <p>Tap the AR button to view in augmented reality</p>
        <p className="text-xs text-white/60">
          Works on iOS (Quick Look) and Android (Scene Viewer)
        </p>
      </div>
    </div>
  );
}

