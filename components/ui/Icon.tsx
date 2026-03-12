import type { SVGProps } from "react";

import { cn } from "@/components/ui/utils";

export type IconName =
  | "avatar"
  | "check"
  | "dashboard"
  | "down"
  | "left"
  | "line"
  | "pause"
  | "pause-line"
  | "play"
  | "play-line"
  | "plus"
  | "redo"
  | "right"
  | "sound"
  | "up"
  | "video";

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
};

function baseProps(props: IconProps) {
  const { className, size = 24, ...rest } = props;

  return {
    className: cn("shrink-0", className),
    height: size,
    viewBox: "0 0 24 24",
    width: size,
    ...rest,
  };
}

export function Icon(props: IconProps) {
  const { name } = props;
  const svgProps = baseProps(props);

  switch (name) {
    case "dashboard":
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
          <rect x="4" y="4" width="6" height="6" rx="1.5" />
          <rect x="14" y="4" width="6" height="6" rx="1.5" />
          <rect x="4" y="14" width="6" height="6" rx="1.5" />
          <rect x="14" y="14" width="6" height="6" rx="1.5" />
        </svg>
      );
    case "video":
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
          <rect x="3.5" y="6.5" width="11" height="11" rx="2.5" />
          <path d="M14.5 10 20 7.75v8.5L14.5 14" />
        </svg>
      );
    case "avatar":
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
          <circle cx="12" cy="8" r="3.25" />
          <path d="M5 19a7 7 0 0 1 14 0" />
        </svg>
      );
    case "plus":
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "redo":
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
          <path d="M20 7v6h-6" />
          <path d="M20 13a8 8 0 1 1-2.34-5.66L20 10" />
        </svg>
      );
    case "sound":
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
          <path d="M5 14h3l4 4V6L8 10H5z" />
          <path d="M16 9a5 5 0 0 1 0 6" />
          <path d="M18.5 6.5a8.5 8.5 0 0 1 0 11" />
        </svg>
      );
    case "up":
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
          <path d="m6 14 6-6 6 6" />
        </svg>
      );
    case "right":
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
          <path d="m10 6 6 6-6 6" />
        </svg>
      );
    case "down":
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
          <path d="m6 10 6 6 6-6" />
        </svg>
      );
    case "left":
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
          <path d="m14 6-6 6 6 6" />
        </svg>
      );
    case "line":
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
          <path d="M5 12h14" />
        </svg>
      );
    case "play":
      return (
        <svg {...svgProps} fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 6.75c0-1.13 1.24-1.81 2.18-1.2l7.77 5.25a1.44 1.44 0 0 1 0 2.4l-7.77 5.25A1.44 1.44 0 0 1 8 17.25z" />
        </svg>
      );
    case "play-line":
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
          <path d="m8 6.75 9 5.25L8 17.25z" />
        </svg>
      );
    case "pause":
      return (
        <svg {...svgProps} fill="currentColor" viewBox="0 0 24 24">
          <rect x="7" y="5.5" width="3.75" height="13" rx="1.5" />
          <rect x="13.25" y="5.5" width="3.75" height="13" rx="1.5" />
        </svg>
      );
    case "pause-line":
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
          <path d="M9 6v12M15 6v12" />
        </svg>
      );
    case "check":
      return (
        <svg {...svgProps} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path d="m5 12.5 4.25 4.25L19 7" />
        </svg>
      );
    default:
      return null;
  }
}
