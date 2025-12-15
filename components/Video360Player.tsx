"use client";

import { useEffect, useRef } from "react";

interface Video360PlayerProps {
  videoUrl: string;
  className?: string;
}

const MAX_DURATION = 20; // 20 seconds maximum

export default function Video360Player({ videoUrl, className = "" }: Video360PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= MAX_DURATION) {
        video.pause();
        video.currentTime = 0; // Reset to start
      }
    };

    const handleLoadedMetadata = () => {
      // If video is longer than 20 seconds, we'll limit playback
      if (video.duration > MAX_DURATION) {
        video.addEventListener("timeupdate", handleTimeUpdate);
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoUrl]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden luxury-shadow ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-auto"
        controls
        playsInline
        style={{ maxHeight: "500px" }}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute bottom-2 right-2 bg-charcoal/70 text-white px-2 py-1 rounded text-xs">
        Max: {MAX_DURATION}s
      </div>
    </div>
  );
}



