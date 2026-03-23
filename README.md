# EO — Eastaid Video

> 입문자부터 전문가까지 쉽게 영상을 제작하세요
> **Every One, Every Output**

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

---

## 소개

EO는 AI가 캐릭터·씬·나레이션·음악을 자동 생성해주는 숏폼 영상 제작 플랫폼입니다.
키워드 하나로 스토리보드를 구성하고, 편집까지 완료해 YouTube에 바로 업로드할 수 있습니다.

---

## 주요 기능

- **캐릭터 시스템** — 프리셋 캐릭터 라이브러리 제공 및 AI 커스텀 캐릭터 생성 (6가지 아트 스타일)
- **프로젝트 워크플로우** — 키워드 입력 → AI 아이디어 풍부화 → 자동 스토리보드 생성
- **영상 편집** — 자막, TTS 오버레이, BGM, 전환 효과, 속도 조절, 썸네일 설정
- **YouTube 연동** — OAuth 인증 후 완성된 영상을 YouTube에 직접 업로드

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) + React 19 + TypeScript |
| 스타일링 | Tailwind CSS 4 |
| 서버 상태 | TanStack Query 5 |
| 폼 검증 | React Hook Form + Zod |
| 인증 | Google OAuth, YouTube OAuth, 백엔드 쿠키 세션 |
| 컴포넌트 문서화 | Storybook 10 |

---

## 시작하기

### 사전 조건

- Node.js 18 이상
- npm

### 설치

```bash
git clone https://github.com/callmateteam/eo_FE.git
cd eo_FE
npm install
```

### 환경변수

루트에 `.env.local` 파일을 생성하고 아래 값을 설정합니다.

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
```

### 실행

```bash
npm run dev        # 개발 서버 (http://localhost:3000)
npm run build      # 프로덕션 빌드
npm start          # 프로덕션 서버 실행
npm run lint       # ESLint 검사
npm run storybook  # 스토리북 (http://localhost:6006)
```

---

## 프로젝트 구조

```
eo/
├── app/                    # Next.js App Router 페이지
│   ├── (auth)/             # 비인증 라우트 (로그인, 회원가입)
│   └── (dashboard)/        # 인증 필요 라우트 (대시보드, 캐릭터, 프로젝트)
├── components/             # 기능별 React 컴포넌트
├── hooks/                  # 커스텀 훅
├── lib/                    # API 클라이언트, 유틸리티, 상수
│   └── assets.ts           # 이미지 경로 상수
└── public/assets/          # 정적 이미지 및 영상 자산
```
