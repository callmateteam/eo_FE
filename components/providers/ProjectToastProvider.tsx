"use client";

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { getVideoInfo } from "@/lib/api/video-edit";
import { ApiError } from "@/lib/api/client";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SpinnerDots } from "@/components/ui/SpinnerDots";

type TrackingPayload = {
  projectId: string;
  storyboardId: string;
};

type CompletionPayload = TrackingPayload & {
  title?: string;
};

const TRACKING_STORAGE_KEY = "eo:project-video-tracking";

type ProjectToastContextValue = {
  hideCompletionToast: () => void;
  startVideoGenerationTracking: (payload: TrackingPayload) => void;
  stopVideoGenerationTracking: () => void;
};

const ProjectToastContext = createContext<ProjectToastContextValue | null>(null);

function readTrackingFromStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.localStorage.getItem(TRACKING_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(storedValue) as TrackingPayload;

    if (parsed.projectId && parsed.storyboardId) {
      return parsed;
    }
  } catch {
    window.localStorage.removeItem(TRACKING_STORAGE_KEY);
  }

  return null;
}

export function useProjectToast() {
  const context = useContext(ProjectToastContext);

  if (!context) {
    throw new Error("useProjectToast must be used within ProjectToastProvider");
  }

  return context;
}

export function ProjectToastProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [tracking, setTracking] = useState<TrackingPayload | null>(() =>
    readTrackingFromStorage()
  );
  const [completion, setCompletion] = useState<CompletionPayload | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!tracking) {
      window.localStorage.removeItem(TRACKING_STORAGE_KEY);

      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    window.localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(tracking));

    const poll = async () => {
      try {
        const info = await getVideoInfo(tracking.storyboardId);
        const status = info.status?.toUpperCase();

        // Only mark complete when video is actually ready
        if (status === "READY" || status === "COMPLETED" || status === "COMPLETE") {
          setCompletion({
            projectId: tracking.projectId,
            storyboardId: tracking.storyboardId,
            title: info.title,
          });
          setTracking(null);
        } else if (status === "FAILED" || status === "ERROR") {
          // Video generation failed — stop polling silently
          setTracking(null);
        }
        // Other statuses (e.g. RENDERING) — keep polling
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          // Still rendering, keep polling
          return;
        }

        // Unexpected error, stop tracking
        setTracking(null);
      }
    };

    void poll();
    intervalRef.current = window.setInterval(() => {
      void poll();
    }, 15000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [tracking]);

  // Auto-dismiss completion toast after 6 seconds
  useEffect(() => {
    if (!completion) return;
    const timer = setTimeout(() => setCompletion(null), 6000);
    return () => clearTimeout(timer);
  }, [completion]);

  const value = useMemo<ProjectToastContextValue>(
    () => ({
      hideCompletionToast: () => setCompletion(null),
      startVideoGenerationTracking: (payload) => {
        setCompletion(null);
        setTracking(payload);
      },
      stopVideoGenerationTracking: () => {
        setTracking(null);
      },
    }),
    []
  );

  return (
    <ProjectToastContext.Provider value={value}>
      {children}

      {tracking ? (
        <div className="pointer-events-none fixed bottom-[28px] left-[107px] z-[80]">
          <div className="flex min-w-[300px] items-center gap-3 rounded-[18px] border border-[#2f2f36] bg-[#1f1f24] px-[18px] py-[16px] shadow-[0_14px_40px_rgba(0,0,0,0.28)]">
            <div className="flex size-7 items-center justify-center rounded-full border border-[#2e2e34] bg-[#232328] text-primary-500">
              <SpinnerDots className="scale-[0.42]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold leading-none text-white">
                영상 생성중
              </span>
              <span className="pt-[6px] text-[12px] font-medium leading-none text-[#8f8f98]">
                예상 소요 시간: 약 3분
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {completion ? (
        <div className="pointer-events-none fixed bottom-[28px] left-[107px] z-[90]">
          <div className="pointer-events-auto flex min-w-[398px] items-center justify-between gap-6 rounded-[20px] bg-[linear-gradient(90deg,#9747ff_0%,#d456ff_100%)] px-[22px] py-[14px] shadow-[0_12px_30px_rgba(151,71,255,0.3)]">
            <div className="flex items-center gap-4">
              <div className="flex size-7 items-center justify-center rounded-full bg-[#1f1f24] text-white">
                <Icon className="size-4" name="check" />
              </div>
              <span className="text-[14px] font-semibold text-white">
                영상 생성이 완료되었어요
              </span>
            </div>

            <Button
              className="min-w-[92px] bg-[#1f1f24] shadow-none"
              size="tiny"
              onClick={() => {
                setCompletion(null);
                router.push(
                  `/project/${completion.projectId}/edit?storyboardId=${encodeURIComponent(
                    completion.storyboardId
                  )}`
                );
              }}
            >
              보러가기
            </Button>
          </div>
        </div>
      ) : null}
    </ProjectToastContext.Provider>
  );
}
