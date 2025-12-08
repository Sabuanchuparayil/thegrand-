"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { createFaceMesh, startCamera } from "@/lib/ar/mediapipe-config";
import { getEarPosition, getNecklacePosition, drawJewelryOnCanvas } from "@/lib/ar/face-overlay";
import type { FaceMesh } from "@mediapipe/face_mesh";

interface ARViewer2DProps {
  jewelryImage?: string;
  jewelryType: "necklace" | "earring";
  onClose?: () => void;
}

export default function ARViewer2D({
  jewelryImage,
  jewelryType,
  onClose,
}: ARViewer2DProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const jewelryImgRef = useRef<HTMLImageElement | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLeftEar, setIsLeftEar] = useState(true);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Load jewelry image if provided
    if (jewelryImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = jewelryImage;
      img.onload = () => {
        jewelryImgRef.current = img;
      };
      img.onerror = () => {
        setError("Failed to load jewelry image");
      };
    }

    // Initialize MediaPipe FaceMesh
    createFaceMesh((results) => {
      if (!canvas || !ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];

        if (jewelryImgRef.current) {
          let position;

          if (jewelryType === "earring") {
            position = getEarPosition(landmarks, isLeftEar);
          } else {
            position = getNecklacePosition(landmarks);
          }

          if (position) {
            drawJewelryOnCanvas(
              ctx,
              position,
              jewelryImgRef.current,
              canvas.width,
              canvas.height
            );
          }
        }
      }
    })
      .then((faceMesh) => {
        faceMeshRef.current = faceMesh;

        // Start camera
        return startCamera(video, faceMesh);
      })
      .then(() => {
        setIsLoading(false);
        // Set canvas size to match video
        const updateCanvasSize = () => {
          if (canvas && video) {
            canvas.width = video.videoWidth || 1280;
            canvas.height = video.videoHeight || 720;
          }
        };
        video.addEventListener("loadedmetadata", updateCanvasSize);
        updateCanvasSize();
      })
      .catch((err) => {
        console.error("Camera error:", err);
        setError("Failed to access camera. Please ensure camera permissions are granted.");
        setIsLoading(false);
      });

    return () => {
      if (video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }
      if (faceMeshRef.current) {
        faceMeshRef.current.close();
      }
    };
  }, [jewelryImage, jewelryType, isLeftEar]);

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-charcoal/90 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4">
          <h3 className="text-xl font-serif font-bold text-charcoal mb-4">
            Camera Error
          </h3>
          <p className="text-charcoal/70 mb-6">{error}</p>
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
          AR Try-On - {jewelryType === "earring" ? "Earring" : "Necklace"}
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

      {/* Video and Canvas */}
      <div className="flex-1 relative flex items-center justify-center">
        <video
          ref={videoRef}
          className="hidden"
          autoPlay
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/50">
            <div className="text-center text-white">
              <Camera className="w-12 h-12 mx-auto mb-4 animate-pulse" />
              <p>Initializing camera...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {jewelryType === "earring" && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={() => setIsLeftEar(!isLeftEar)}
            className="px-6 py-3 bg-gold text-charcoal rounded-lg font-semibold hover:bg-gold-light transition-colors"
          >
            Switch to {isLeftEar ? "Right" : "Left"} Ear
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 text-center text-white/80 text-sm">
        <p>Position your face in the frame to see the jewelry</p>
      </div>
    </div>
  );
}

