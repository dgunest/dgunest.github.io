# NEST Lab 홈페이지 관리 매뉴얼

NEST Lab(나노바이오 융합 연구실, 동국대학교 의생명공학과) 랩 홈페이지의 소스 저장소입니다.
이 문서는 **사람과 LLM(AI 코딩 도구) 모두**가 읽고 사이트를 수정할 수 있도록 작성되었습니다.

## 사이트 개요

- **정적 사이트**: 프레임워크·빌드 도구 없음. 순수 HTML/CSS/JS.
- **배포**: GitHub Pages (저장소 `main` 브랜치의 루트를 그대로 서빙).
- **공통 헤더/푸터**: 모든 페이지가 `assets/js/main.js`를 통해 `partials/header.html`,
  `partials/footer.html`을 fetch로 불러와 주입합니다. 메뉴를 한 곳에서만 수정하면 전 페이지에
  반영됩니다.
- **경로 규칙**: 모든 링크·리소스 경로는 **상대경로**입니다 (`assets/...`, `partials/...`,
  `index.html` 등). 루트 배포든 서브경로 배포든 그대로 동작하도록 절대경로(`/`로 시작)는
  사용하지 않습니다.

## 파일 구조

```
lab-website/
├─ index.html            # Home
├─ research.html         # Research (연구 주제 섹션들)
├─ people.html           # People (PI / Current Members / Alumni 앵커 섹션)
├─ publications.html     # Research Outcomes > Publication
├─ patents.html          # Research Outcomes > Patents
├─ conferences.html      # Research Outcomes > Conferences
├─ awards.html           # Research Outcomes > Awards
├─ gallery.html          # Gallery (연도별 사진 그리드)
├─ contact.html          # Contact
├─ partials/
│  ├─ header.html        # 공통 상단 메뉴(드롭다운·햄버거) — 메뉴 수정은 여기 한 곳
│  └─ footer.html        # 공통 푸터
├─ assets/
│  ├─ css/style.css      # 전체 스타일 + 반응형 + 애니메이션
│  ├─ js/main.js         # include 주입 + 메뉴/드롭다운/스크롤/reveal
│  └─ img/               # 이미지 (favicon.svg = 탭 마크, people/·research/·gallery/ 하위 폴더)
├─ .nojekyll             # GitHub Pages가 Jekyll 처리 안 하게
├─ .gitignore
└─ README.md             # 이 문서
```

## 공통 규칙

- **메뉴 수정**: `partials/header.html` **한 곳만** 수정합니다. 여기 있는 `<ul class="menu">`
  구조가 모든 페이지에 동일하게 주입됩니다.
- **색상/디자인 토큰 수정**: `assets/css/style.css` 맨 위 `:root { --navy: ...; --blue: ...; }`
  의 CSS 변수를 바꾸면 사이트 전체 색이 함께 바뀝니다.
- **페이지 콘텐츠 수정**: 각 `.html` 파일의 `<main>...</main>` 안쪽만 편집하면 됩니다.
  `<head>`, 헤더(`#site-header`), 푸터(`#site-footer`), `<script>` 태그는 모든 페이지에서
  동일한 구조를 유지해야 합니다.
- **클래스명은 임의로 바꾸지 않습니다.** `style.css` / `partials/header.html` /
  `assets/js/main.js` 세 파일이 클래스명(`.menu`, `.dropdown`, `.submenu`, `.hamburger`,
  `.reveal` 등)과 `data-nav` 값을 공유합니다. 한 곳만 바꾸면 나머지와 어긋나 동작이 깨집니다.

## 자주 하는 편집 (레시피)

### 논문 추가
`publications.html`의 `<ul class="list">` 안에 아래 형태로 `<li>`를 추가합니다 (최신순 권장).

```html
<li><span class="year">2026</span> Author A, Author B, "논문 제목", <i>Journal Name</i>, 2026.</li>
```

### 특허 / 학회 발표 / 수상 추가
같은 방식으로 각각 `patents.html`, `conferences.html`, `awards.html`의 `<ul class="list">`에
`<li>`를 추가합니다.

### 구성원 추가 (Current Members)
`people.html`의 `#members` 안 `.members` 블록에서 `.member` 하나를 복사해 붙여넣고
이름(`.name`)과 직급(`.pos`)을 수정합니다.

```html
<div class="member"><div class="photo"></div><div class="name">이름</div><div class="pos">직급</div></div>
```

사진이 있다면 `assets/img/`에 이미지 파일을 넣고, `<div class="photo"></div>`를
`<div class="photo"><img src="assets/img/파일명.jpg" alt="이름"></div>`로 교체합니다.

### 졸업생(Alumni) 추가
`people.html`의 `#alumni` 안 `.placeholder-box`(안내 문구)를 실제 졸업생 목록(예: `<ul class="list">`
+ `<li>`)으로 교체합니다.

### 갤러리 사진/연도 추가
`gallery.html`에서 연도 블록 전체(`<div class="gyear">...</div>` + `<div class="gallery">...</div>`
를 감싼 `<div class="reveal">`)를 복사해 새 연도로 만들고, 사진과 캡션을 수정합니다. 최신 연도를
위쪽에 둡니다.

### 이미지 교체 규칙
지금은 모든 이미지가 자리표시자(`<div class="ph">이미지</div>` 또는 `<div class="photo">...</div>`)
입니다. 실제 이미지가 준비되면:

1. `assets/img/`에 파일을 넣습니다.
2. 자리표시자 `<div class="ph">…</div>`를 `<img src="assets/img/파일명" alt="설명">`로 바꿉니다.

### 한/영 이중언어 (KOR/ENG 토글)
상단 오른쪽 `ENG/KOR` 버튼으로 언어를 전환합니다 (선택은 브라우저에 기억됨).

- **원리**: `<html lang="ko">`가 기본. 번역이 필요한 곳은 한/영 텍스트를 **함께** 넣고, CSS가
  현재 언어에 맞는 쪽만 보여줍니다.
- **새 문구를 이중언어로 넣는 법**: 한글과 영문을 각각 span으로 감쌉니다.

  ```html
  <span class="lang-ko">한국어 문장</span><span class="lang-en">English sentence</span>
  ```

- 이미 영어인 것(메뉴, `RESEARCH AREAS` 같은 라벨, 직급, 구성원 이름 등)은 감싸지 않아도 됩니다.
- 토글 버튼·로직은 `partials/header.html`의 `.lang-toggle`와 `assets/js/main.js`에 있습니다.
  자세한 전체 번역 목록은 `docs/superpowers/plans/2026-07-02-nest-lab-i18n.md` 참고.

## 로컬 미리보기

VS Code Remote-SSH로 서버에 접속해 작업하는 환경 기준입니다.

```bash
cd /home/aibox-dgu-a/lab-website
python3 -m http.server 8000
```

VS Code의 **PORTS 패널 → Forward a Port → 8000**을 선택한 뒤, 표시되는 로컬 주소로 접속해
확인합니다.

## 배포 (GitHub Pages)

저장소가 GitHub에 연결되어 있다면, 변경 사항을 커밋 후 push하면 1-2분 내에 사이트에 반영됩니다.

```bash
git add -A
git commit -m "설명"
git push
```

(저장소 생성, SSH 키 등록, Pages 활성화, 커스텀 도메인 연결 등 최초 배포 설정은 이 저장소의
`docs/superpowers/plans/2026-07-02-nest-lab-website.md` 계획 문서의 Phase 4·5를 참고하세요.)

---

## LLM 안내 블록

이 저장소를 수정하는 AI에게: 메뉴는 `partials/header.html`, 색은 `style.css`의 `:root`,
콘텐츠는 각 html의 `<main>`. 새 항목은 기존 마크업 패턴을 복사해 추가할 것. 새로 넣는 한글 문구는
한/영을 각각 `<span class="lang-ko">…</span><span class="lang-en">…</span>`로 감쌀 것. 절대 파일
구조나 클래스명(`.lang-ko`/`.lang-en` 포함)을 임의로 변경하지 말 것.
