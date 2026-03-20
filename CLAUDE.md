# 셰프의 뇌

## 프로젝트

Next.js App Router + React 19 + TypeScript + Tailwind CSS 4 앱.
패키지 매니저: `npm`

## 자주 쓰는 명령어

```bash
npm run dev      # 개발 서버
npm run build    # 빌드
npm run lint     # 린트
```

## 핵심 규칙

- `app/globals.css` 수정은 사용자 허락 없이 절대 하지 않는다.
- `index` 배럴 export 패턴 사용 안 한다.
- 이미지는 `public/assets/`만 사용한다. (`figmaImg/`는 원본 보관용)
- 자산 경로는 `lib/assets.ts` 상수로 참조한다.
- UI 구현은 제공된 이미지 또는 Figma MCP 기준으로 100% 일치를 목표로 한다.
- 불명확한 점은 구현 전에 반드시 먼저 묻는다.

## 아키텍처

- **인증**: 백엔드 쿠키 세션 + TanStack Query (`401 → refresh → 재시도` 공통 계층)
- **회원가입**: `validate-username → signup → login` 순서로 자동 로그인
- **라우트 구조**: 인증 필요 화면은 `app/(dashboard)` 그룹 아래, 공통 `AppShell` 공유

## 참고 문서

| 파일 | 역할 |
|------|------|
| [.claude/orchestration.md](.claude/orchestration.md) | 작업 흐름 및 검증 기준 |
| [.claude/agent.md](.claude/agent.md) | 작업 모드 정의 |
| [.claude/skills.md](.claude/skills.md) | 반복 작업 레시피 |
| [.claude/memory.md](.claude/memory.md) | 프로젝트 맥락 및 결정 기록 |
