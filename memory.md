# Memory

이 파일은 프로젝트의 "맛 일지"입니다.
짧게 유지하되, 앞으로의 작업에 영향을 주는 오래가는 결정 위주로 적습니다.

## 현재 상태

- 프로젝트는 Next.js App Router, React 19, TypeScript를 사용합니다.
- Tailwind CSS 4가 설치되어 있으며, 코드상 더 강한 로컬 패턴이 보이지 않는 한 기본 스타일링 경로로 유지합니다.
- 이 저장소의 패키지 매니저는 `npm`입니다.

## 작업 관례

- 넓은 재작성보다 작고 국소적인 수정을 우선합니다.
- 수정 검증은 실제 신뢰를 줄 수 있는 가장 가벼운 명령으로 수행합니다.
- 사용자가 명시적으로 요구하지 않는 한 기존 UI 언어를 유지합니다.

## 지속되는 결정

- 이 저장소에서 `AGENTS.md`는 Claude 스타일 `claude.md`에 대응하는 Codex 진입 파일입니다.
- 보조 문서는 역할별로 분리합니다.
- `orchestration.md`: 실행 흐름
- `agent.md`: 작업 역할
- `skills.md`: 재사용 레시피
- `memory.md`: 지속되는 프로젝트 맥락
- [`app/globals.css`](/C:/Users/USER/Desktop/coding/eo/app/globals.css)는 보호 파일로 취급하며, 수정이나 추가가 필요할 때는 항상 사용자 허락을 먼저 받습니다.
- 이 프로젝트에서는 `index` 방식과 `index` 배럴 export 패턴을 사용하지 않습니다.
- `figmaImg/`는 Figma 원본 보관 폴더로 유지하고, 실제 앱에서는 `public/assets/`만 사용합니다.
- 자산 경로는 가능하면 [`lib/assets.ts`](/C:/Users/USER/Desktop/coding/eo/lib/assets.ts) 상수로 참조합니다.
- Decision: 인증은 백엔드 쿠키 세션 기반으로 유지하고, 프론트는 `fetch` 공통 클라이언트 + TanStack Query로 세션과 서버 상태를 관리합니다.
- Why it matters: 토큰을 브라우저 저장소에 보관하지 않고 `me` 조회, `401 -> refresh -> 재시도` 흐름을 공통 계층에서 재사용할 수 있습니다.
- Decision: 회원가입은 `validate-username -> signup -> login` 순서로 처리해 자동 로그인합니다.
- Why it matters: 백엔드 `signup` 응답이 세션 쿠키를 직접 발급하지 않아도 프론트 UX를 유지할 수 있습니다.

## 업데이트 템플릿

새 메모를 추가할 때는 아래 형식을 사용합니다.

- Decision: 무엇이 바뀌었는가
- Why it matters: 이후 작업에 어떤 영향을 주는가
