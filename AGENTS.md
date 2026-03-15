# Codex 작업 가이드

이 파일은 이 저장소에서 Codex가 가장 먼저 참고하는 진입점입니다.
Claude 스타일 구성을 기준으로 보면 `claude.md`를 대체하며, 전체 작업의 "셰프의 뇌" 역할을 합니다.

## 문서 읽는 순서

이 저장소에서 작업할 때는 아래 순서로 문서를 참고합니다.

1. [orchestration.md](/C:/Users/USER/Desktop/coding/eo/orchestration.md): 작업 분기와 실행 흐름
2. [agent.md](/C:/Users/USER/Desktop/coding/eo/agent.md): 역할 분담과 기대 행동
3. [skills.md](/C:/Users/USER/Desktop/coding/eo/skills.md): 재사용 가능한 작업 레시피
4. [memory.md](/C:/Users/USER/Desktop/coding/eo/memory.md): 오래 유지해야 하는 프로젝트 맥락과 결정

## 저장소 개요

- 스택: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4
- 패키지 매니저: `npm` (`package-lock.json` 존재)
- 주요 목표: 기존 구조를 크게 깨지 않으면서 UI 변경을 빠르게 반영

## 작업 원칙

- 수정 전에 먼저 확인합니다. 코드에서 직접 읽을 수 있는 패턴은 추측하지 않습니다.
- 요청이 명확하게 리디자인을 요구하지 않는 한, 기존 UI와 레이아웃 관례를 유지합니다.
- UI 구현은 사용자가 제공한 이미지 또는 Figma MCP를 기준으로 진행하고, 기준 시안과 100% 일치하게 구현하는 것을 기본 목표로 합니다.
- UI 작업 중 궁금한 점, 확실하지 않은 점, 필요한 데이터, 인터랙션 정의 누락이 있으면 구현 전에 반드시 사용자에게 확인합니다.
- 큰 재작성보다 작고 검증 가능한 변경을 우선합니다.
- 가능하면 수정 후에는 범위를 좁힌 검증을 수행합니다.
- 이후에도 중요할 결정이라면 [memory.md](/C:/Users/USER/Desktop/coding/eo/memory.md)에 기록합니다.

## 프로젝트 고정 규칙

- [`app/globals.css`](/C:/Users/USER/Desktop/coding/eo/app/globals.css)는 절대 임의로 수정하지 않습니다.
- [`app/globals.css`](/C:/Users/USER/Desktop/coding/eo/app/globals.css)에 수정이나 추가가 필요하면 반드시 사용자 허락을 먼저 받습니다.
- `index` 방식은 사용하지 않습니다.
- 새 파일 구성이나 import/export 정리 시에도 `index` 배럴 패턴은 만들지 않습니다.

## 작업 분기

- 신규 기능 또는 리팩터링: [orchestration.md](/C:/Users/USER/Desktop/coding/eo/orchestration.md)부터 보고, 맞는 레시피를 [skills.md](/C:/Users/USER/Desktop/coding/eo/skills.md)에서 적용합니다.
- 버그 수정: 먼저 영향 파일을 확인하고, 문제를 해결하는 가장 작은 수정부터 적용한 뒤 검증을 추가하거나 실행합니다.
- 디자인 또는 UX 작업: 우선 현재 저장소의 스타일 패턴을 따르고, 사용자가 제공한 이미지 또는 Figma MCP를 기준으로 100% 일치 구현을 목표로 하며, 불명확한 점은 먼저 확인합니다.
- 리뷰 요청: 버그, 회귀 가능성, 테스트 누락, 유지보수 리스크를 우선 확인합니다.

## 메모리 업데이트 기준

아래 중 하나가 생기면 [memory.md](/C:/Users/USER/Desktop/coding/eo/memory.md)를 업데이트합니다.

- 새로운 아키텍처 관례가 도입됨
- 반복 작업의 기본 워크플로우가 정해짐
- 디자인 시스템 규칙이 더 명확해짐
- 코드만 보고는 바로 알기 어려운 프로젝트 제약이 발견됨
