import Image from "next/image";

import { cn } from "@/components/ui/utils";

type Props = {
  alt?: string;
  className?: string;
};

export function MediaStackIllustration({
  alt = "Drag and drop illustration",
  className,
}: Props) {
  return (
    <div className={cn("relative h-[160px] w-[255px]", className)}>
      <Image
        alt={alt}
        fill
        priority={false}
        sizes="255px"
        src="/drag-drop-illustration.png"
      />
    </div>
  );
}
