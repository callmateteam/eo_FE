# 맛 일지

이후 작업 판단에 영향을 주는 결정만 기록한다.

---

## 고정 규칙

- `app/globals.css` — 보호 파일. 수정 전 반드시 사용자 허락.
- `index` 배럴 export — 사용 안 함.
- 이미지 경로 — `public/assets/` 사용. `figmaImg/`는 원본 보관 전용.
- 자산 참조 — `lib/assets.ts` 상수 우선.
- 인터랙티브 UI — `cursor-pointer` 기본 적용, 비활성만 `cursor-not-allowed`.

## 아키텍처

- **인증**: 백엔드 쿠키 세션. `fetch` 공통 클라이언트 + TanStack Query로 `401 → refresh → 재시도` 처리.
- **회원가입**: `validate-username → signup → login` 순서. 백엔드가 세션 쿠키를 직접 발급하지 않아도 자동 로그인 유지.
- **대시보드 라우트**: `app/(dashboard)` 그룹. 공통 `AppShell` + 사이드바 공유.

## UI 구현 기준

- 제공된 이미지 또는 Figma MCP 기준으로 100% 일치 구현.
- Figma 조회는 하위 노드 개별 `get_metadata` / `get_design_context`로 최소 범위만.
- 불명확한 점은 구현 전에 먼저 확인.

---

## 기록 형식

```
- Decision: 무엇이 바뀌었는가
- Why: 이후 작업에 어떤 영향을 주는가
```
