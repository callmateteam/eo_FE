import Image from "next/image";
import Link from "next/link";

import { socialAssets } from "@/lib/assets";

const SOCIAL_LINKS = [
  { name: "YouTube", src: socialAssets.youtube, href: "#" },
  { name: "TikTok", src: socialAssets.tiktok, href: "#" },
  { name: "Instagram", src: socialAssets.instagram, href: "#" },
] as const;

const POLICY_LINKS = [
  { label: "이용약관", href: "#" },
  { label: "개인정보처리방침", href: "#" },
  { label: "고객센터", href: "#" },
] as const;

export function LandingFooter() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-10 py-8 md:px-20">
        {/* 좌측: 로고 + 회사 정보 */}
        <div className="flex flex-col gap-2">
          <Image
            alt="Eastaid Video 로고"
            src="/Logo/Logo-120_40.svg"
            width={120}
            height={40}
          />
          <p className="text-sm text-gray-500">
            이스트에이드 | contact@eastaid.com
          </p>
        </div>

        {/* 중앙: 카피라이트 */}
        <p className="text-sm text-gray-500">
          © 2026 Eastaid Video. All rights reserved.
        </p>

        {/* 우측: 정책 링크 + 소셜 아이콘 */}
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            {POLICY_LINKS.map((link, i) => (
              <span key={link.label} className="flex items-center gap-1">
                {i > 0 && <span>|</span>}
                <Link href={link.href} className="hover:text-gray-300 transition-colors">
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="flex size-9 items-center justify-center rounded-full border border-gray-700 hover:border-primary-500 transition-colors"
                aria-label={social.name}
              >
                <Image
                  alt={social.name}
                  src={social.src}
                  width={18}
                  height={18}
                  className="object-contain"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
