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

import { getApiBaseUrl } from "@/lib/api/client";

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
  startStoryboardTracking: (payload: TrackingPayload) => void;
  stopStoryboardTracking: () => void;
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

function getWsBaseUrl() {
  return getApiBaseUrl().replace(/^https/, "wss").replace(/^http/, "ws");
}

function formatRemainingTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m > 0) return `약 ${m}분 ${s.toString().padStart(2, "0")}초 남음`;
  return `약 ${s}초 남음`;
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

  // ── Storyboard generation tracking ──────────────────────────────────────
  const [sbTracking, setSbTracking] = useState<TrackingPayload | null>(null);
  const [sbProgress, setSbProgress] = useState(0);
  const [sbStep, setSbStep] = useState<string | null>(null);
  const sbWsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!sbTracking) {
      sbWsRef.current?.close();
      sbWsRef.current = null;
      return;
    }

    setSbProgress(0);
    setSbStep(null);

    const wsUrl = `${getWsBaseUrl()}/api/storyboards/ws/${sbTracking.storyboardId}`;
    const ws = new WebSocket(wsUrl);
    sbWsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as {
          status?: string;
          progress?: number;
          step?: string;
        };
        if (typeof data.progress === "number") setSbProgress(data.progress);
        if (typeof data.step === "string") setSbStep(data.step);

        const status = data.status?.toUpperCase();
        if (status === "COMPLETED") {
          const { projectId, storyboardId } = sbTracking;
          setSbTracking(null);
          router.push(
            `/project/create/storyboard?projectId=${encodeURIComponent(projectId)}&storyboardId=${encodeURIComponent(storyboardId)}`,
          );
        } else if (status === "FAILED" || status === "ERROR") {
          setSbTracking(null);
        }
      } catch {
        // ignore malformed messages
      }
    };

    ws.onerror = () => setSbTracking(null);

    return () => {
      ws.close();
      sbWsRef.current = null;
    };
  }, [sbTracking, router]);

  // ── Video generation tracking ────────────────────────────────────────────
  const [tracking, setTracking] = useState<TrackingPayload | null>(() =>
    readTrackingFromStorage()
  );
  const [completion, setCompletion] = useState<CompletionPayload | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!tracking) {
      window.localStorage.removeItem(TRACKING_STORAGE_KEY);
      wsRef.current?.close();
      wsRef.current = null;
      return;
    }

    window.localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(tracking));
    setProgress(0);
    setRemainingSeconds(null);

    const wsUrl = `${getWsBaseUrl()}/api/storyboards/ws/${tracking.storyboardId}/video`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as {
          status?: string;
          overall_progress?: number;
          estimated_remaining_seconds?: number;
          final_video_url?: string | null;
        };

        if (typeof data.overall_progress === "number") {
          setProgress(data.overall_progress);
        }
        if (typeof data.estimated_remaining_seconds === "number") {
          setRemainingSeconds(data.estimated_remaining_seconds);
        }

        const status = data.status?.toUpperCase();
        if (
          status === "COMPLETED" ||
          status === "READY" ||
          data.final_video_url
        ) {
          setCompletion({
            projectId: tracking.projectId,
            storyboardId: tracking.storyboardId,
          });
          setTracking(null);
        } else if (status === "FAILED" || status === "ERROR") {
          setTracking(null);
        }
      } catch {
        // ignore malformed messages
      }
    };

    ws.onerror = () => {
      setTracking(null);
    };

    return () => {
      ws.close();
      wsRef.current = null;
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
      startStoryboardTracking: (payload) => setSbTracking(payload),
      stopStoryboardTracking: () => setSbTracking(null),
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

      {/* ── 스토리보드 생성 토스트 ── */}
      {sbTracking ? (
        <div className="pointer-events-none fixed bottom-[28px] left-[107px] z-[80]">
          <div className="flex min-w-[300px] flex-col gap-3 rounded-[18px] border border-[#2f2f36] bg-[#1f1f24] px-4.5 py-4 shadow-[0_14px_40px_rgba(0,0,0,0.28)]">
            <div className="flex items-center gap-3">
              <div className="flex size-7 items-center justify-center rounded-full border border-[#2e2e34] bg-[#232328] text-primary-500">
                <SpinnerDots size="sm" />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <span className="text-[14px] font-semibold leading-none text-white">
                  스토리보드 생성중
                </span>
                <span className="text-[13px] font-semibold leading-none text-primary-400">
                  {sbProgress}%
                </span>
              </div>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-[#2f2f36]">
              <div
                className="h-full rounded-full bg-linear-to-r from-[#9747ff] to-[#d456ff] transition-all duration-500"
                style={{ width: `${sbProgress}%` }}
              />
            </div>
            <span className="text-[12px] font-medium leading-none text-[#8f8f98]">
              {sbStep ?? "씬 구성 및 이미지 생성 중..."}
            </span>
          </div>
        </div>
      ) : null}

      {/* ── 씬 영상 생성 토스트 ── */}
      {tracking ? (
        <div className="pointer-events-none fixed bottom-[28px] left-[107px] z-[80]">
          <div className="flex min-w-[300px] flex-col gap-3 rounded-[18px] border border-[#2f2f36] bg-[#1f1f24] px-4.5 py-4 shadow-[0_14px_40px_rgba(0,0,0,0.28)]">
            <div className="flex items-center gap-3">
              <div className="flex size-7 items-center justify-center rounded-full border border-[#2e2e34] bg-[#232328] text-primary-500">
                <SpinnerDots size="sm" />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <span className="text-[14px] font-semibold leading-none text-white">
                  영상 생성중
                </span>
                <span className="text-[13px] font-semibold leading-none text-primary-400">
                  {progress}%
                </span>
              </div>
            </div>

            <div className="h-1 w-full overflow-hidden rounded-full bg-[#2f2f36]">
              <div
                className="h-full rounded-full bg-linear-to-r from-[#9747ff] to-[#d456ff] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <span className="text-[12px] font-medium leading-none text-[#8f8f98]">
              {remainingSeconds !== null
                ? formatRemainingTime(remainingSeconds)
                : "예상 소요 시간: 약 3분"}
            </span>
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
