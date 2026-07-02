# NEST Lab 홈페이지 구현 계획 (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** NEST Lab(나노바이오 융합 연구실) 랩 홈페이지를 순수 HTML/CSS/JS 정적 사이트로 만들어 GitHub Pages에 배포하고, dongguk.edu 도메인 연결과 관리 매뉴얼까지 완성한다.

**Architecture:** 프레임워크·빌드도구 없는 정적 사이트. 각 페이지는 별도 `.html`이지만 공통 헤더/푸터를 `partials/`에서 작은 vanilla JS로 주입해 메뉴는 한 곳에서만 수정. 공통 `style.css` 하나 + `main.js` 하나. 모든 경로는 상대경로(루트/서브경로 배포 모두 대응).

**Tech Stack:** HTML5, CSS3(변수·flex·grid·media query), Vanilla JS(fetch include, IntersectionObserver), 로컬 미리보기는 `python3 -m http.server`, 배포는 GitHub Pages.

**환경 메모:** 사용자는 VS Code Remote-SSH로 랩 서버 작업. 브라우저 미리보기는 **VS Code PORTS 패널에서 포트 포워딩** 필요. 서버에 `python3`·`git` 있음, `gh` 없음(→ 배포는 SSH 키 방식).

---

## 파일 구조 (File Structure)

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
│  └─ img/               # 로고·연구·갤러리 이미지(지금은 더미)
├─ .nojekyll             # GitHub Pages가 Jekyll 처리 안 하게
├─ .gitignore
└─ README.md             # 사이트 관리 매뉴얼(LLM이 읽고 수정 가능)
```

각 페이지 `<body>`는 `<div id="site-header"></div>` … 본문 … `<div id="site-footer"></div>` 형태로, `main.js`가 헤더/푸터를 주입한다. 콘텐츠 편집자는 본문만 건드리면 된다.

---

## Phase 0 — 프로젝트 뼈대

### Task 0.1: git 저장소 초기화 + 무시파일

**Files:**
- Create: `/home/aibox-dgu-a/lab-website/.gitignore`
- Create: `/home/aibox-dgu-a/lab-website/.nojekyll` (빈 파일)

- [ ] **Step 1: git 초기화**

```bash
cd /home/aibox-dgu-a/lab-website
git init -b main
git config user.name "NEST Lab"
git config user.email "<랩계정 이메일>"   # 실제 값으로 교체
```

- [ ] **Step 2: `.gitignore` 작성**

```
.superpowers/
.DS_Store
*.log
```

- [ ] **Step 3: `.nojekyll` 빈 파일 생성**

```bash
touch /home/aibox-dgu-a/lab-website/.nojekyll
```

- [ ] **Step 4: 확인**

Run: `cd /home/aibox-dgu-a/lab-website && git status`
Expected: `On branch main`, `.gitignore`/`.nojekyll` 등이 untracked로 보임. `.superpowers/`는 목록에 없음.

- [ ] **Step 5: 커밋**

```bash
git add .gitignore .nojekyll
git commit -m "chore: init repo with gitignore and nojekyll"
```

---

## Phase 1 — 공통 레이어 (CSS / JS / 헤더 / 푸터)

이 Phase가 사이트의 뼈대다. 여기서 만든 헤더/푸터/스타일을 모든 페이지가 공유한다.

### Task 1.1: 전역 스타일시트 `assets/css/style.css`

**Files:**
- Create: `assets/css/style.css`

- [ ] **Step 1: 전체 CSS 작성** (팔레트 변수 → 기본 → 헤더/드롭다운 → 히어로/섹션 → People/Outcomes/Gallery → 반응형 → 애니메이션)

```css
/* ===== 팔레트 & 토큰 ===== */
:root{
  --navy:#293681; --blue:#4274D9; --sky:#95CCDD; --tint:#D0E7E6;
  --ink:#3a4460; --muted:#7581a0; --line:#e9edf5; --bg:#ffffff;
  --maxw:1100px; --radius:10px;
  --shadow:0 8px 30px rgba(41,54,129,.10);
  --font:"Pretendard","Noto Sans KR",-apple-system,"Segoe UI",sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--font);color:var(--ink);background:var(--bg);line-height:1.7;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.container{max-width:var(--maxw);margin:0 auto;padding:0 24px}
.section{padding:56px 0}
.label{font-size:12px;letter-spacing:1.5px;font-weight:700;color:var(--muted)}
h1,h2,h3{color:var(--navy);line-height:1.25}
.page-title{font-size:30px;font-weight:800;margin-bottom:24px}

/* ===== 헤더 ===== */
.site-header{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.92);
  backdrop-filter:blur(6px);border-bottom:1px solid var(--line);transition:box-shadow .25s}
.site-header.scrolled{box-shadow:0 4px 18px rgba(41,54,129,.08)}
.nav{display:flex;align-items:center;justify-content:space-between;height:64px}
.brand{font-size:20px;font-weight:800;color:var(--navy);letter-spacing:.5px}
.brand small{display:block;font-size:11px;font-weight:500;color:var(--muted);letter-spacing:0}
.menu{display:flex;align-items:center;gap:22px;font-size:15px}
.menu>li{position:relative;list-style:none}
.menu a{color:var(--ink);padding:6px 0;transition:color .15s}
.menu a:hover,.menu a.active{color:var(--navy);font-weight:700}
.menu a.active{border-bottom:2px solid var(--blue)}
.btn-contact{background:var(--blue);color:#fff!important;padding:8px 16px;border-radius:8px;font-weight:600}
.btn-contact:hover{background:var(--navy)}
.caret{font-size:10px;margin-left:3px;color:var(--muted)}

/* 드롭다운 (데스크톱: hover) */
.dropdown>.submenu{position:absolute;top:100%;left:0;min-width:190px;background:#fff;
  border:1px solid var(--line);border-radius:10px;box-shadow:var(--shadow);padding:6px 0;
  opacity:0;visibility:hidden;transform:translateY(6px);transition:all .18s;list-style:none}
.dropdown:hover>.submenu{opacity:1;visibility:visible;transform:translateY(0)}
.submenu a{display:block;padding:9px 16px;font-size:14px}
.submenu a:hover{background:var(--tint);color:var(--navy)}

/* 햄버거 (모바일에서만 표시) */
.hamburger{display:none;flex-direction:column;gap:5px;background:none;border:0;cursor:pointer;padding:6px}
.hamburger span{width:24px;height:2px;background:var(--navy);transition:.25s}

/* ===== 히어로 ===== */
.hero{background:linear-gradient(135deg,var(--tint),#eaf4f4 55%,#fff);padding:64px 0 48px}
.hero .eyebrow{color:var(--blue);font-weight:700;letter-spacing:1.5px;font-size:13px}
.hero h1{font-size:36px;font-weight:800;margin:12px 0}
.hero p{max-width:620px;color:var(--ink);font-size:16px}
.hero .cta{margin-top:22px;display:flex;gap:10px;flex-wrap:wrap}
.btn{display:inline-block;padding:11px 20px;border-radius:8px;font-weight:600;font-size:14px}
.btn-primary{background:var(--navy);color:#fff}
.btn-ghost{color:var(--blue);font-weight:700}

/* ===== 카드 그리드(연구 요약/연구주제) ===== */
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.card{background:var(--tint);border-radius:var(--radius);padding:18px}
.card .dot{width:30px;height:30px;background:var(--blue);border-radius:8px}
.card h3{font-size:15px;margin:10px 0 4px}
.card p{font-size:13px;color:var(--ink)}

/* 연구 주제 상세(이미지 3장 + 캡션) */
.topic{padding:28px 0;border-top:1px solid var(--line)}
.topic h2{font-size:20px}
.topic .desc{color:var(--ink);font-size:14px;margin:6px 0 16px;max-width:760px}
.thumbs{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.thumb figure{margin:0}
.thumb .ph{aspect-ratio:4/3;background:linear-gradient(160deg,var(--sky),var(--tint));
  border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--blue);font-size:13px}
.thumb figcaption{text-align:center;color:var(--navy);font-weight:600;font-size:13px;margin-top:8px}

/* ===== People ===== */
.pi{display:flex;gap:24px;align-items:center;flex-wrap:wrap}
.pi .photo{width:130px;height:165px;border-radius:10px;flex-shrink:0;
  background:linear-gradient(160deg,var(--sky),var(--tint));display:flex;align-items:center;justify-content:center;color:var(--blue);font-size:12px}
.pi h3{font-size:22px}
.pi .role{color:var(--ink);font-size:14px;margin-top:4px}
.members{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:16px}
.member .photo{aspect-ratio:1/1;background:var(--tint);border-radius:10px}
.member .name{font-weight:700;color:var(--navy);font-size:14px;margin-top:8px}
.member .pos{font-size:12px;color:var(--muted)}
.placeholder-box{border:1.5px dashed #cdd6e8;border-radius:10px;padding:16px 18px;color:var(--muted);font-size:14px}

/* ===== Outcomes 목록 ===== */
.list{list-style:none}
.list li{padding:14px 0;border-bottom:1px solid var(--line);font-size:14px}
.list .year{color:var(--blue);font-weight:700;margin-right:10px}

/* ===== Gallery ===== */
.gyear{font-size:26px;font-weight:800;margin:8px 0 20px}
.gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.gallery figure{margin:0;overflow:hidden;border-radius:8px}
.gallery .ph{aspect-ratio:4/3;background:linear-gradient(160deg,var(--sky),var(--tint));
  display:flex;align-items:center;justify-content:center;color:var(--blue);
  transition:transform .3s}
.gallery figure:hover .ph{transform:scale(1.06)}
.gallery figcaption{text-align:center;color:var(--navy);font-weight:700;font-size:13px;margin-top:10px}

/* ===== Contact ===== */
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:30px}
.contact-grid .row{margin-bottom:14px}
.contact-grid .k{font-size:12px;color:var(--muted);letter-spacing:1px}
.contact-grid .v{font-size:15px;color:var(--navy);font-weight:600}
.map-ph{background:var(--tint);border-radius:10px;min-height:240px;display:flex;align-items:center;justify-content:center;color:var(--blue)}

/* ===== 푸터 ===== */
.site-footer{background:var(--navy);color:#bcc6ea;font-size:13px}
.site-footer .container{padding-top:22px;padding-bottom:22px}
.site-footer a{color:#dfe6ff}

/* ===== 은은한 애니메이션 ===== */
.reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}
.reveal.visible{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}}

/* ===== 반응형 (모바일 ≤820px) ===== */
@media (max-width:820px){
  .hamburger{display:flex}
  .menu{position:fixed;inset:64px 0 auto 0;flex-direction:column;align-items:stretch;gap:0;
    background:#fff;border-bottom:1px solid var(--line);padding:8px 0;
    max-height:0;overflow:hidden;transition:max-height .3s ease}
  .menu.open{max-height:80vh;overflow:auto}
  .menu>li{padding:0 24px}
  .menu>li>a{display:block;padding:12px 0}
  .btn-contact{display:inline-block;margin:8px 0}
  .dropdown>.submenu{position:static;opacity:1;visibility:visible;transform:none;
    box-shadow:none;border:0;padding:0 0 6px 12px;display:none}
  .dropdown.open>.submenu{display:block}
  .grid-3,.thumbs,.gallery{grid-template-columns:1fr}
  .members{grid-template-columns:repeat(2,1fr)}
  .contact-grid{grid-template-columns:1fr}
  .hero h1{font-size:28px}
}
```

- [ ] **Step 2: 커밋**

```bash
git add assets/css/style.css
git commit -m "feat: global stylesheet with palette, layout, responsive, animations"
```

---

### Task 1.2: 공통 헤더/푸터 partial

**Files:**
- Create: `partials/header.html`
- Create: `partials/footer.html`

- [ ] **Step 1: `partials/header.html`** (메뉴 수정은 이 파일에서만)

```html
<div class="container">
  <div class="nav">
    <a class="brand" href="index.html">NEST Lab<small>나노바이오 융합 연구실</small></a>
    <button class="hamburger" aria-label="menu"><span></span><span></span><span></span></button>
    <ul class="menu">
      <li><a href="index.html" data-nav="index">Home</a></li>
      <li><a href="research.html" data-nav="research">Research</a></li>
      <li class="dropdown"><a href="people.html" data-nav="people">People <span class="caret">▾</span></a>
        <ul class="submenu">
          <li><a href="people.html#pi">Principal Investigator</a></li>
          <li><a href="people.html#members">Current Members</a></li>
          <li><a href="people.html#alumni">Alumni</a></li>
        </ul>
      </li>
      <li class="dropdown"><a href="publications.html" data-nav="outcomes">Research Outcomes <span class="caret">▾</span></a>
        <ul class="submenu">
          <li><a href="publications.html">Publication</a></li>
          <li><a href="patents.html">Patents</a></li>
          <li><a href="conferences.html">Conferences</a></li>
          <li><a href="awards.html">Awards</a></li>
        </ul>
      </li>
      <li><a href="gallery.html" data-nav="gallery">Gallery</a></li>
      <li><a class="btn-contact" href="contact.html" data-nav="contact">Contact</a></li>
    </ul>
  </div>
</div>
```

- [ ] **Step 2: `partials/footer.html`**

```html
<div class="container">
  NEST Lab · 동국대학교 의생명공학과 &nbsp;|&nbsp;
  <a href="mailto:contact@dongguk.edu">contact@dongguk.edu</a> (예시) &nbsp;|&nbsp;
  경기도 고양시 동국대학교 &nbsp;|&nbsp; © 2026 NEST Lab
</div>
```

- [ ] **Step 3: 커밋**

```bash
git add partials/header.html partials/footer.html
git commit -m "feat: shared header (nav with dropdowns) and footer partials"
```

---

### Task 1.3: `assets/js/main.js` — include 주입 + 인터랙션

**Files:**
- Create: `assets/js/main.js`

- [ ] **Step 1: JS 작성**

```js
// 공통 헤더/푸터 주입 후 인터랙션 초기화
async function inject(id, url){
  const el = document.getElementById(id);
  if(!el) return;
  const res = await fetch(url);
  el.innerHTML = await res.text();
}

function initNav(){
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu');
  const burger = document.querySelector('.hamburger');

  // 모바일 메뉴 토글
  burger && burger.addEventListener('click', ()=> menu.classList.toggle('open'));

  // 모바일 드롭다운 아코디언 (데스크톱은 CSS hover가 처리)
  document.querySelectorAll('.dropdown > a').forEach(a=>{
    a.addEventListener('click', (e)=>{
      if(window.innerWidth <= 820){
        e.preventDefault();
        a.parentElement.classList.toggle('open');
      }
    });
  });

  // 현재 페이지 메뉴 활성화
  const path = (location.pathname.split('/').pop() || 'index.html');
  const page = path.replace('.html','') || 'index';
  const map = {publications:'outcomes',patents:'outcomes',conferences:'outcomes',awards:'outcomes'};
  const key = map[page] || page;
  const active = document.querySelector(`.menu a[data-nav="${key}"]`);
  active && active.classList.add('active');

  // 스크롤 시 그림자
  const onScroll = ()=> header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll); onScroll();
}

function initReveal(){
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('visible'); io.unobserve(en.target); }});
  }, {threshold:.12});
  els.forEach(el=>io.observe(el));
}

document.addEventListener('DOMContentLoaded', async ()=>{
  await inject('site-header','partials/header.html');
  await inject('site-footer','partials/footer.html');
  initNav();
  initReveal();
});
```

- [ ] **Step 2: 커밋**

```bash
git add assets/js/main.js
git commit -m "feat: main.js — partial injection, mobile menu, dropdowns, active link, scroll reveal"
```

---

## Phase 2 — 페이지 제작

모든 페이지는 아래 **공통 뼈대**를 쓴다(각 페이지 Task는 `<main>` 안 내용만 다름):

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PAGE_TITLE · NEST Lab</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <header class="site-header" id="site-header"></header>
  <main><!-- 페이지별 내용 --></main>
  <footer class="site-footer" id="site-footer"></footer>
  <script src="assets/js/main.js"></script>
</body>
</html>
```

### Task 2.1: `index.html` (Home)

**Files:** Create: `index.html`

- [ ] **Step 1: 작성** — `<main>` 내용:

```html
<section class="hero">
  <div class="container reveal">
    <div class="eyebrow">PLASMONIC · BIOSENSING · AI</div>
    <h1>나노바이오 융합 연구실</h1>
    <p>플라즈모닉 나노입자 기반 바이오센싱과 AI를 활용한 임상 분석, 라만 크로스모달 연구를 통해
       질병을 더 빠르고 정확하게 진단하는 기술을 개발합니다.</p>
    <div class="cta">
      <a class="btn btn-primary" href="research.html">연구 살펴보기 →</a>
      <a class="btn btn-ghost" href="people.html">구성원 소개</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container reveal">
    <div class="label">RESEARCH AREAS</div>
    <div class="grid-3" style="margin-top:14px">
      <div class="card"><div class="dot"></div><h3>Plasmonic Biosensing</h3><p>나노입자 기반 초고감도 바이오센서</p></div>
      <div class="card"><div class="dot"></div><h3>AI Clinical Analysis</h3><p>AI 기반 임상 데이터 분석·진단</p></div>
      <div class="card"><div class="dot"></div><h3>Raman Cross-modal</h3><p>라만 분광 크로스모달 분석</p></div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container reveal">
    <div class="label">RECENT NEWS</div>
    <ul class="list" style="margin-top:10px">
      <li><span class="year">2026.06</span> 신규 논문이 게재되었습니다. (예시)</li>
      <li><span class="year">2026.03</span> 새로운 포닥 연구원이 합류했습니다. (예시)</li>
    </ul>
  </div>
</section>
```

- [ ] **Step 2: 미리보기 확인** — (Task 3.1의 서버가 떠 있으면) 브라우저에서 홈이 헤더/히어로/카드/뉴스/푸터까지 보이고, 스크롤 시 fade-in 되는지 확인.
- [ ] **Step 3: 커밋** `git add index.html && git commit -m "feat: home page"`

### Task 2.2: `research.html`

**Files:** Create: `research.html`

- [ ] **Step 1: 작성** — `<main>` 내용: 페이지 제목 + 3개 `.topic`(주제별 설명 + 이미지 3장 + 캡션).

```html
<section class="section">
  <div class="container">
    <h1 class="page-title reveal">Research</h1>

    <div class="topic reveal">
      <h2>Plasmonic Biosensing</h2>
      <p class="desc">플라즈모닉 나노입자를 이용해 극미량의 바이오마커를 검출하는 초고감도 센서를 개발합니다.</p>
      <div class="thumbs">
        <div class="thumb"><figure><div class="ph">이미지</div><figcaption>Nanoparticle probe</figcaption></figure></div>
        <div class="thumb"><figure><div class="ph">이미지</div><figcaption>Biosensor chip</figcaption></figure></div>
        <div class="thumb"><figure><div class="ph">이미지</div><figcaption>Signal readout</figcaption></figure></div>
      </div>
    </div>

    <div class="topic reveal">
      <h2>AI Clinical Analysis</h2>
      <p class="desc">측정 데이터를 AI로 분석해 질병을 자동으로 분류·진단하는 파이프라인을 연구합니다.</p>
      <div class="thumbs">
        <div class="thumb"><figure><div class="ph">이미지</div><figcaption>Data pipeline</figcaption></figure></div>
        <div class="thumb"><figure><div class="ph">이미지</div><figcaption>Model training</figcaption></figure></div>
        <div class="thumb"><figure><div class="ph">이미지</div><figcaption>Diagnosis</figcaption></figure></div>
      </div>
    </div>

    <div class="topic reveal">
      <h2>Raman Cross-modal</h2>
      <p class="desc">라만 분광 데이터를 다른 모달리티와 결합(cross-modal)해 분석 정확도를 높입니다.</p>
      <div class="thumbs">
        <div class="thumb"><figure><div class="ph">이미지</div><figcaption>Raman spectra</figcaption></figure></div>
        <div class="thumb"><figure><div class="ph">이미지</div><figcaption>Cross-modal fusion</figcaption></figure></div>
        <div class="thumb"><figure><div class="ph">이미지</div><figcaption>Result</figcaption></figure></div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: 커밋** `git add research.html && git commit -m "feat: research page"`

### Task 2.3: `people.html`

**Files:** Create: `people.html`

- [ ] **Step 1: 작성** — PI(#pi) / Current Members(#members) / Alumni(#alumni) 앵커 섹션.

```html
<section class="section">
  <div class="container">
    <h1 class="page-title reveal">People</h1>

    <div id="pi" class="reveal">
      <div class="label">PRINCIPAL INVESTIGATOR</div>
      <div class="pi" style="margin-top:16px">
        <div class="photo">사진</div>
        <div>
          <h3>이종욱 <span style="font-size:14px;color:var(--blue)">Jong-Wook Lee, Ph.D.</span></h3>
          <div class="role">Principal Investigator · 동국대학교 의생명공학과</div>
          <p style="margin-top:10px;max-width:560px">플라즈모닉 나노입자 기반 바이오센싱, AI 임상분석, 라만 크로스모달 연구를 이끌고 있습니다.</p>
          <div style="margin-top:10px;color:var(--blue);font-weight:600;font-size:13px">✉ jwlee@dongguk.edu (예시) · Google Scholar</div>
        </div>
      </div>
    </div>

    <div id="members" class="reveal" style="margin-top:40px">
      <div class="label">CURRENT MEMBERS</div>
      <div class="members">
        <div class="member"><div class="photo"></div><div class="name">Postdoc A (예시)</div><div class="pos">Post-doctoral Researcher</div></div>
        <div class="member"><div class="photo"></div><div class="name">Postdoc B (예시)</div><div class="pos">Post-doctoral Researcher</div></div>
        <div class="member"><div class="photo"></div><div class="name">학생 C (예시)</div><div class="pos">석·박사 통합과정</div></div>
        <div class="member"><div class="photo"></div><div class="name">학생 D (예시)</div><div class="pos">석사과정</div></div>
      </div>
    </div>

    <div id="alumni" class="reveal" style="margin-top:40px">
      <div class="label">ALUMNI</div>
      <div class="placeholder-box" style="margin-top:12px">졸업생이 생기면 여기에 추가됩니다. (README의 "구성원 추가" 참고)</div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: 커밋** `git add people.html && git commit -m "feat: people page (PI/members/alumni)"`

### Task 2.4: Research Outcomes 4페이지

**Files:** Create: `publications.html`, `patents.html`, `conferences.html`, `awards.html`

- [ ] **Step 1: `publications.html`** — `<main>` 내용:

```html
<section class="section"><div class="container">
  <h1 class="page-title reveal">Publications</h1>
  <ul class="list reveal">
    <li><span class="year">2025</span> Author A, Author B, "논문 제목 예시", <i>Journal Name</i>, 2025. (예시)</li>
    <li><span class="year">2024</span> Author A et al., "또 다른 논문 제목 예시", <i>Journal Name</i>, 2024. (예시)</li>
  </ul>
</div></section>
```

- [ ] **Step 2: `patents.html`** — 위와 동일 구조, 제목 `Patents`, 리스트 예시:

```html
<section class="section"><div class="container">
  <h1 class="page-title reveal">Patents</h1>
  <ul class="list reveal">
    <li><span class="year">2025</span> "특허 명칭 예시", 출원/등록번호 XX-XXXX. (예시)</li>
  </ul>
</div></section>
```

- [ ] **Step 3: `conferences.html`** — 제목 `Conferences`:

```html
<section class="section"><div class="container">
  <h1 class="page-title reveal">Conferences</h1>
  <ul class="list reveal">
    <li><span class="year">2025</span> "발표 제목 예시", 한국바이오칩학회 추계학술대회, 2025. (예시)</li>
  </ul>
</div></section>
```

- [ ] **Step 4: `awards.html`** — 제목 `Awards`:

```html
<section class="section"><div class="container">
  <h1 class="page-title reveal">Awards</h1>
  <ul class="list reveal">
    <li><span class="year">2025</span> 우수포스터상, ○○학회. (예시)</li>
  </ul>
</div></section>
```

- [ ] **Step 5: 커밋** `git add publications.html patents.html conferences.html awards.html && git commit -m "feat: research outcomes pages"`

### Task 2.5: `gallery.html`

**Files:** Create: `gallery.html`

- [ ] **Step 1: 작성** — 연도 블록 + 3열 사진 그리드(더미).

```html
<section class="section"><div class="container">
  <h1 class="page-title reveal">Gallery</h1>

  <div class="reveal">
    <div class="gyear">2025</div>
    <div class="gallery">
      <figure><div class="ph">사진</div><figcaption>2025 마이크로나노시스템 추계학술대회 참가 (예시)</figcaption></figure>
      <figure><div class="ph">사진</div><figcaption>2025 한국바이오칩학회 추계학술대회 참가 (예시)</figcaption></figure>
      <figure><div class="ph">사진</div><figcaption>2025 한국센서학회 추계학술대회 참가 (예시)</figcaption></figure>
      <figure><div class="ph">사진</div><figcaption>Biosensors 2025 (Lisbon) 참가 (예시)</figcaption></figure>
      <figure><div class="ph">사진</div><figcaption>2025 한국바이오칩학회 춘계학술대회 (예시)</figcaption></figure>
      <figure><div class="ph">사진</div><figcaption>랩 회식 / 워크숍 (예시)</figcaption></figure>
    </div>
  </div>

  <!-- 연도 추가 시 위 블록을 복사해 gyear와 사진만 바꾸면 됨 -->
</div></section>
```

- [ ] **Step 2: 커밋** `git add gallery.html && git commit -m "feat: gallery page"`

### Task 2.6: `contact.html`

**Files:** Create: `contact.html`

- [ ] **Step 1: 작성**

```html
<section class="section"><div class="container">
  <h1 class="page-title reveal">Contact</h1>
  <div class="contact-grid reveal">
    <div>
      <div class="row"><div class="k">LAB</div><div class="v">NEST Lab (나노바이오 융합 연구실)</div></div>
      <div class="row"><div class="k">AFFILIATION</div><div class="v">동국대학교 의생명공학과</div></div>
      <div class="row"><div class="k">PI</div><div class="v">이종욱 교수</div></div>
      <div class="row"><div class="k">EMAIL</div><div class="v">contact@dongguk.edu (예시)</div></div>
      <div class="row"><div class="k">ADDRESS</div><div class="v">경기도 고양시 동국대학교 (예시)</div></div>
    </div>
    <div class="map-ph">지도 자리 (구글맵 iframe 삽입 예정)</div>
  </div>
</div></section>
```

- [ ] **Step 2: 커밋** `git add contact.html && git commit -m "feat: contact page"`

---

## Phase 3 — 로컬 미리보기 (VS Code 포워딩)

### Task 3.1: 로컬 서버로 전체 사이트 확인

- [ ] **Step 1: 정적 서버 실행** (프로젝트 루트에서)

```bash
cd /home/aibox-dgu-a/lab-website
python3 -m http.server 8000
```

- [ ] **Step 2: VS Code 포트 포워딩** — PORTS 패널 → Forward a Port → `8000` → 표시된 `localhost:8000`(또는 배정된 번호) 열기.

- [ ] **Step 3: 점검 체크리스트** (브라우저에서 직접 확인)
  - [ ] 모든 메뉴 클릭 시 해당 페이지로 이동, 현재 메뉴에 파란 밑줄(active)
  - [ ] People▾ / Research Outcomes▾ 드롭다운 hover 시 펼쳐짐
  - [ ] 창을 좁히면(≤820px) 햄버거로 바뀌고, 탭하면 메뉴/드롭다운 아코디언 동작
  - [ ] 스크롤 시 섹션 fade-in, 갤러리 사진 hover 확대, 상단바 그림자
  - [ ] 헤더/푸터가 모든 페이지에 동일하게 주입됨

- [ ] **Step 4:** 문제 있으면 해당 Task로 돌아가 수정 후 다시 확인. 정상이면 서버 종료(Ctrl+C).

---

## Phase 4 — GitHub Pages 배포 (초보자용, 계정 이미 있음)

> GitHub 계정(랩실 공용)은 이미 있음. 여기서는 **저장소 생성 → SSH 키 등록 → push → Pages 켜기** 순으로 진행. `gh` 미설치라 SSH 키 방식 사용.

### Task 4.1: SSH 키 생성·등록 (한 번만)

- [ ] **Step 1: 키 생성** (이미 `~/.ssh/id_ed25519.pub`가 있으면 건너뜀)

```bash
ls ~/.ssh/id_ed25519.pub 2>/dev/null || ssh-keygen -t ed25519 -C "nestlab-github" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

- [ ] **Step 2:** 출력된 공개키를 복사 → GitHub 웹 → Settings → SSH and GPG keys → New SSH key → 붙여넣기 → 저장.
- [ ] **Step 3: 연결 테스트**

Run: `ssh -T git@github.com`
Expected: `Hi <계정>! You've successfully authenticated...`

### Task 4.2: 저장소 생성 & 첫 push

- [ ] **Step 1:** GitHub 웹에서 New repository → 이름 **`<계정명>.github.io`** (이렇게 하면 루트 주소 `https://<계정명>.github.io/`로 서빙되어 경로 문제 없음) → Public → (README 등 체크 없이) Create.

- [ ] **Step 2: 원격 연결 & push**

```bash
cd /home/aibox-dgu-a/lab-website
git remote add origin git@github.com:<계정명>/<계정명>.github.io.git
git push -u origin main
```

- [ ] **Step 3: Pages 활성화** — 저장소 Settings → Pages → Source: `Deploy from a branch`, Branch: `main` / `/ (root)` → Save.

- [ ] **Step 4: 확인** — 1-2분 뒤 `https://<계정명>.github.io/` 접속 → 사이트가 뜨는지 확인. (헤더/푸터 fetch가 http에서 정상 동작)

---

## Phase 5 — dongguk.edu 도메인 연결

### Task 5.1: 커스텀 도메인 설정

- [ ] **Step 1: 서브도메인 이름 확정** (예: `nestlab.dongguk.edu`) — PI/담당자와 합의.
- [ ] **Step 2:** 저장소 Settings → Pages → Custom domain 에 서브도메인 입력 → Save. (저장소에 `CNAME` 파일이 자동 생성/커밋됨)
- [ ] **Step 3: 학교(윤지윤 담당자)에 신규 신청** — 아래 정보 전달:
  - 신규 생성임(기존 사이트 연결 아님)
  - 원하는 주소: `nestlab.dongguk.edu`
  - 연결 방식(택1): **CNAME** → `<계정명>.github.io` (권장), 또는 **A레코드** → GitHub Pages IP `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - 관리자/운영자 정보(요청 시)
- [ ] **Step 4: 전파 후 확인** — DNS 반영(수십 분-수 시간) 후 `https://nestlab.dongguk.edu` 접속 + GitHub Pages의 "Enforce HTTPS" 체크.

---

## Phase 6 — 관리 매뉴얼 (README.md)

### Task 6.1: LLM이 읽고 수정 가능한 관리 매뉴얼 작성

**Files:** Create: `/home/aibox-dgu-a/lab-website/README.md`

- [ ] **Step 1: 작성** — 다음 내용을 포함:
  - **사이트 개요**: 정적 사이트, 프레임워크 없음, GitHub Pages 배포.
  - **파일 구조 표**(위 File Structure 재수록).
  - **공통 규칙**: 메뉴 수정 = `partials/header.html`만. 색상 = `assets/css/style.css`의 `:root` 변수. 각 페이지는 `<main>` 안만 편집.
  - **자주 하는 편집(레시피)**:
    - *논문 추가*: `publications.html`의 `<ul class="list">`에 `<li><span class="year">연도</span> 서지정보</li>` 추가.
    - *구성원 추가*: `people.html` `#members`의 `.members`에 `.member` 블록 복사 후 이름/직급 수정. 사진은 `assets/img/`에 넣고 `.photo`를 `<img>`로 교체.
    - *졸업생(Alumni) 추가*: `#alumni`의 placeholder를 목록으로 교체.
    - *갤러리 사진/연도 추가*: `gallery.html`의 연도 블록 복사, `.ph`를 실제 `<img src="assets/img/...">`로 교체, 캡션 수정.
    - *특허/학회/수상 추가*: 각 페이지 `.list`에 `<li>` 추가.
  - **이미지 교체 규칙**: 자리표시 `<div class="ph">…</div>`를 `<img src="assets/img/파일명" alt="설명">`로 바꾼다.
  - **로컬 미리보기**: `python3 -m http.server 8000` + VS Code 포트 포워딩.
  - **배포**: `git add -A && git commit -m "..." && git push` → 1-2분 뒤 사이트 반영.
  - **LLM 안내 블록**: "이 저장소를 수정하는 AI에게: 메뉴는 partials/header.html, 색은 style.css :root, 콘텐츠는 각 html의 <main>. 새 항목은 기존 마크업 패턴을 복사해 추가할 것. 절대 파일 구조/클래스명을 임의 변경하지 말 것."
- [ ] **Step 2: 커밋 & push**

```bash
git add README.md
git commit -m "docs: site management manual (LLM-editable)"
git push
```

---

## Self-Review (계획 점검)

- **스펙 커버리지**: 플랫폼(Phase 4) · 6개 메뉴/드롭다운(Task 1.2, 2.x) · 색상·반응형·애니메이션(Task 1.1) · People 3섹션(2.3) · Outcomes 4페이지(2.4) · Gallery 연도 그리드(2.5) · Contact(2.6) · 도메인(Phase 5) · 관리 매뉴얼(Phase 6) — 스펙 항목 모두 대응됨.
- **placeholder 스캔**: 콘텐츠의 "(예시)"는 의도된 더미(스펙에서 명시). 계획상의 미완성 지시어 없음.
- **일관성**: 클래스명(`.reveal`,`.dropdown`,`.submenu`,`.menu.open`,`.dropdown.open`)이 CSS(1.1)·헤더(1.2)·JS(1.3)에서 동일. `data-nav` 키와 main.js의 active 매핑 일치.

---

## 실행 방식 선택 (Execution Handoff)

계획 저장 위치: `docs/superpowers/plans/2026-07-02-nest-lab-website.md`
```
