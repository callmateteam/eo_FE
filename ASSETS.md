# Asset Guide

이 프로젝트의 자산은 아래 기준으로 관리합니다.

## 원칙

- `figmaImg/`는 Figma 원본 보관 폴더입니다.
- 실제 서비스에서 사용하는 파일은 `public/assets/`만 참조합니다.
- 코드에서는 가능하면 경로 문자열을 직접 쓰지 말고 [lib/assets.ts](/C:/Users/USER/Desktop/coding/eo/lib/assets.ts)를 통해 가져옵니다.
- 공용 UI 아이콘은 가능한 경우 [`components/ui/Icon.tsx`](/C:/Users/USER/Desktop/coding/eo/components/ui/Icon.tsx)를 먼저 사용합니다.
- `Icon.tsx`에 없는 아이콘만 `iconAssets` 경로를 통해 이미지로 사용합니다.

## 폴더 구조

- `public/assets/icons`: SVG 아이콘
- `public/assets/social`: SNS 이미지
- `public/assets/editor/font-icons`: 에디터용 폰트 아이콘 PNG
- `public/assets/landing/cards`: 랜딩 카드 이미지
- `public/assets/landing/screens`: 랜딩 전체 화면 참조 이미지
- `public/assets/common`: 공용 브랜드 자산
- `public/assets/references`: 컴포넌트 및 스타일 참조 이미지

## 권장 사용법

### 1. SVG 아이콘

기존 공용 아이콘이면 [`components/ui/Icon.tsx](/C:/Users/USER/Desktop/coding/eo/components/ui/Icon.tsx)`를 우선 사용합니다.

```tsx
<Icon name="play-line" />
```

아직 코드 아이콘으로 등록하지 않은 SVG면 `iconAssets`를 사용합니다.

```tsx
import Image from "next/image";
import { iconAssets } from "@/lib/assets";

<Image alt="닫기" src={iconAssets.close} width={24} height={24} />
```

### 2. 일반 이미지

```tsx
import Image from "next/image";
import { socialAssets, landingAssets } from "@/lib/assets";

<Image alt="인스타그램" src={socialAssets.instagram} width={24} height={24} />
<Image alt="랜딩 카드" src={landingAssets.cards.characterChef} width={210} height={261} />
```

### 3. 참조 이미지

`referenceAssets`는 실제 서비스 노출용보다 구현 참고용입니다.

## 네이밍 규칙

- 파일명은 소문자 kebab-case를 사용합니다.
- 경로는 기능 기준으로 묶습니다.
- Figma 기본 이름 (`Property 1=...`, `Frame 170...`)은 서비스용 경로에서 사용하지 않습니다.
