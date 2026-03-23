"use client";

import { useRef, useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { landingVideo } from "@/lib/assets";

export function LandingHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function handlePlay() {
    const video = videoRef.current;
    if (!video) return;
    void video.play();
    setIsPlaying(true);
  }

  return (
    <div
      className="relative mx-auto h-[602px] w-full max-w-[397px] cursor-pointer overflow-hidden rounded-[32px] border border-gray-700 bg-gray-800 shadow-[0_1px_36px_8px_rgba(186,78,255,0.08)]"
      onClick={!isPlaying ? handlePlay : undefined}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        muted
        playsInline
        loop
        src={landingVideo}
        onEnded={() => setIsPlaying(false)}
      />
      {!isPlaying && (
        <>
          <div className="absolute inset-4 rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(186,78,255,0.12),transparent_38%)]" />
          <div className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(18,18,20,0.7)]">
            <Icon className="size-9 text-gray-50" name="play-line" />
          </div>
        </>
      )}
    </div>
  );
}
