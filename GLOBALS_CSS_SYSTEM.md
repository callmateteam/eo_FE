# Globals CSS System

이 문서는 이 프로젝트의 [`app/globals.css`](C:\Users\USER\Desktop\coding\eo\app\globals.css) 구조를 다른 프로젝트에 1:1로 복제하기 위한 기준 문서다.

목표는 `값만 바꾸고 구조와 규칙은 그대로 유지`하는 것이다.

## 시스템 이름

이 시스템은 아래처럼 부르면 된다.

- `Tailwind v4 globals.css token system`
- `@theme + @utility + @layer base 기반 디자인 시스템`
- `globals.css 단일 소스 디자인 토큰 시스템`

## 핵심 원칙

다른 프로젝트에서 그대로 재현할 때 반드시 지켜야 하는 규칙:

1. 파일 구조는 항상 `@import -> @theme -> @utility -> @layer base` 순서를 유지한다.
2. Pretendard import 여부만 프로젝트 상황에 맞게 바꾸고, 나머지 구조는 유지한다.
3. 컬러는 `@theme` 안의 `--color-*` 토큰만 교체한다.
4. 타이포는 `@utility text-*` 정의 안의 값만 교체한다.
5. `body`의 기본 폰트 적용 방식과 base reset 구조는 유지한다.
6. 컴포넌트에서는 가능한 한 `bg-gray-900`, `text-primary-500`, `text-display-xl`, `text-body-l` 같은 토큰 클래스만 사용한다.
7. 직접 값은 gradient, shadow, rgba overlay 같은 효과값에서만 허용한다.

## 구조 템플릿

다른 프로젝트에서 동일한 방식으로 만들 때 기본 뼈대는 아래 구조를 유지한다.

```css
@import "pretendard/dist/web/variable/pretendardvariable.css";
@import "tailwindcss";

@theme {
  /* font tokens */
  --font-sans: ...;
  --font-pretendard: ...;

  /* color tokens */
  --color-...: ...;
}

@utility text-display-xl { ... }
@utility text-display-l { ... }
@utility text-display-m { ... }
@utility text-headline-l { ... }
@utility text-headline-m { ... }
@utility text-title-l { ... }
@utility text-title-m { ... }
@utility text-title-s { ... }
@utility text-body-l { ... }
@utility text-body-m { ... }
@utility text-label-l { ... }
@utility text-caption-m { ... }
@utility text-caption-s { ... }

@layer base {
  html { ... }
  body { ... }
  * { ... }
  a { ... }
}
```

## 현재 표준 네이밍

### 폰트 토큰

- `--font-sans`
- `--font-pretendard`

### 컬러 토큰

- `--color-white`
- `--color-gray-50`
- `--color-gray-100`
- `--color-gray-300`
- `--color-gray-500`
- `--color-gray-700`
- `--color-gray-800`
- `--color-gray-900`
- `--color-primary-500`
- `--color-primary-600`
- `--color-primary-700`
- `--color-secondary-500`
- `--color-warning-500`
- `--color-error-500`
- `--color-success-500`
- `--gradient-brand`

### 타이포 유틸

- `text-display-xl`
- `text-display-l`
- `text-display-m`
- `text-headline-l`
- `text-headline-m`
- `text-title-l`
- `text-title-m`
- `text-title-s`
- `text-body-l`
- `text-body-m`
- `text-label-l`
- `text-caption-m`
- `text-caption-s`

## 값만 바꿔도 되는 영역

다른 프로젝트에서 아래만 바꾸면 된다.

### 1. 폰트 스택

```css
--font-sans: "Pretendard Variable", "Pretendard", system-ui, sans-serif;
--font-pretendard: "Pretendard", sans-serif;
```

### 2. 컬러 값

예:

```css
--color-primary-500: #ba4eff;
--color-gray-900: #121214;
--gradient-brand: linear-gradient(135deg, #6954f9 0%, #ba4eff 100%);
```

### 3. 타이포 수치

예:

```css
@utility text-display-xl {
  font-size: 4.25rem;
  line-height: 5.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}
```

### 4. body 기본 색상

예:

```css
body {
  font-family: var(--font-sans);
  @apply text-body-l bg-gray-50 text-gray-900;
}
```

## 바꾸면 안 되는 영역

아래는 가능하면 유지한다.

1. `@theme`, `@utility`, `@layer base` 블록 순서
2. utility 이름
3. color token 이름
4. `body`에서 `font-family: var(--font-sans)` 를 적용하는 방식
5. base reset 항목
6. `globals.css`를 디자인 시스템 단일 소스로 쓰는 원칙

## 다른 프로젝트에 요청할 때 쓰는 문장

아래 문장을 그대로 써도 된다.

```md
현재 프로젝트의 app/globals.css를 기준으로 Tailwind v4 globals.css token system을 그대로 복제해줘.
구조는 @import -> @theme -> @utility -> @layer base 순서를 유지하고,
토큰 이름과 utility 이름은 동일하게 유지해.
값만 새 프로젝트 디자인 가이드에 맞게 바꾸고,
설정 방식과 네이밍 규칙은 1:1로 맞춰줘.
```

더 강하게 고정하고 싶으면:

```md
app/globals.css를 디자인 시스템의 단일 소스로 보고 동일한 구조를 재현해줘.
폰트 토큰, 컬러 토큰, 타이포 utility, base layer 적용 방식까지 모두 같아야 해.
바뀌는 건 값만이고, 시스템 구조와 클래스 네이밍은 절대 바꾸지 마.
```

## 구현 체크리스트

새 프로젝트에 적용할 때 체크할 항목:

- `@import "tailwindcss";` 가 포함되어 있는가
- Pretendard import 또는 대체 폰트 import 가 준비되어 있는가
- `@theme` 안에 font/color token 이 있는가
- `@utility text-*` 가 현재 표준 이름으로 정의되어 있는가
- `@layer base` 에 `html`, `body`, `*`, `a` 가 있는가
- 컴포넌트에서 old semantic class 대신 theme color class 를 쓰는가
- 직접 arbitrary color 값을 남발하지 않는가

## 현재 원본 파일

원본 기준 파일:

- [`app/globals.css`](C:\Users\USER\Desktop\coding\eo\app\globals.css)

이 문서를 사용할 때는 위 파일을 최종 기준으로 보고, 이 문서는 구조 설명과 재사용 규칙 문서로 사용한다.
