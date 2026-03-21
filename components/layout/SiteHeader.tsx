import Image from "next/image";
import Link from "next/link";

type SiteHeaderProps = {
  ctaHref?: string;
};

export function SiteHeader({ ctaHref = "/login" }: SiteHeaderProps) {
  return (
    <header className="relative z-30 h-20 bg-[rgba(44,44,49,0.88)] backdrop-blur-[10px]">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-10 md:px-20">
        <Link href="/">
          <Image
            alt="Eastaid Video 로고"
            src="/Logo/Logo-168_56.svg"
            width={168}
            height={56}
            priority
          />
        </Link>
        <Link
          className="inline-flex h-12 items-center justify-center rounded-full border border-primary-500 bg-gray-800 px-4 text-label-md text-gray-50 shadow-[0_1px_8px_4px_rgba(186,78,255,0.13)]"
          href={ctaHref}
        >
          회원가입 / 로그인
        </Link>
      </div>
    </header>
  );
}
