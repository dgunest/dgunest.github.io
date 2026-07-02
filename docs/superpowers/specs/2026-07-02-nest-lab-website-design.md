# NEST Lab 홈페이지 — 설계 문서 (Design Spec)

- 작성일: 2026-07-02
- 프로젝트: 나노바이오 융합 연구실 (NEST Lab) 랩 홈페이지
- 소속: 동국대학교 의생명공학과
- PI: 이종욱 (Jong-Wook Lee)
- 레퍼런스: The Nam Lab (thenamlab.org) — 학술 랩 사이트 스타일

---

## 1. 목표 (Goal)

랩실 소개·연구·구성원·연구성과·활동사진·연락처를 담은 학술 연구실 홈페이지를 만든다.
비전공(워드프레스 초보) 사용자가 유지·확장할 수 있어야 하고, 비용은 0원, dongguk.edu 도메인 연결이 가능해야 한다.

### 성공 기준 (Verifiable)
- 6개 메뉴 구조가 PC(상단 가로 메뉴)와 모바일(햄버거)에서 모두 정상 동작한다.
- 모든 페이지가 하나의 공통 헤더/푸터/CSS를 공유하며, 메뉴는 한 곳에서만 고치면 전체 반영된다.
- 논문·특허·사진 등 "나중에 채울" 영역이 더미로 채워져 있고, 추가 방법이 문서화되어 있다.
- GitHub Pages에 배포되어 `https://<id>.github.io/` 로 접속된다.
- (이후 단계) dongguk.edu 서브도메인 연결.
- **최종 산출물로 "사이트 관리 매뉴얼"** 을 저장소에 포함한다. 사이트 구조·각 콘텐츠를 어디서 어떻게 고치는지 설명하며, **Claude Code 등 LLM이 읽고 바로 수정 가능한** 형태(구조/파일/규칙 명시)로 작성한다.

---

## 2. 플랫폼 결정 (Platform Decision)

**GitHub Pages 정적 사이트** (워드프레스 아님).

- 초기 요청은 워드프레스였으나, "무료 우선" 요구에 따라 정적 사이트로 전환.
- 근거: 워드프레스는 PHP+DB 유료 호스팅이 필요. "무료 + 워드프레스 + 커스텀 CSS"는 현실적으로 불가.
- GitHub Pages는 무료·안정·유지보수 최소. 커스텀 도메인(dongguk.edu) 연결 지원.
- 트레이드오프: 관리자 페이지(WYSIWYG)가 없음 → 내용 추가는 파일 수정 방식. 사용자는 Claude Code와 함께 편집하므로 감당 가능.

### 도메인 vs 호스팅 (개념 정리)
- **도메인** = 주소(예: `namlab.dongguk.edu`). 학교가 무료 발급 가능.
- **호스팅** = 사이트가 사는 서버. 여기서는 GitHub Pages.
- 학교(윤지윤 담당자)에는 "**신규 생성**"이라고 답하고, GitHub Pages 배포 후 생기는 IP/CNAME 정보를 가지고 도메인 신청.
  - GitHub Pages 커스텀 도메인: `CNAME` → `<id>.github.io`, 또는 A레코드 → GitHub IP(185.199.108.153 등).
  - "도메인 사용 **변경** 신청서"는 기존 도메인 변경용일 가능성 → 신규는 신규 신청서 확인 필요. 호스팅 확정 후 제출.

---

## 3. 사이트 구조 (Information Architecture)

상단 메뉴 (PC 가로 / 모바일 햄버거):

```
Home
Research
People ▾            → Principal Investigator / Current Members / Alumni
Research Outcomes ▾ → Publication / Patents / Conferences / Awards
Gallery
Contact
```

### 페이지 목록
| 페이지 | 파일 | 내용 |
|---|---|---|
| Home | `index.html` | 히어로(랩 소개) + 연구분야 요약 3개 + 최근 소식 + 푸터 |
| Research | `research.html` | 연구주제별 섹션(설명 + 대표이미지 3장 + 캡션). Nam Lab RESEARCH 페이지 구조 참고 |
| People | `people.html` | PI / Current Members / Alumni 3개 앵커 섹션 |
| Publication | `publications.html` | 논문 목록(연도별). 더미 |
| Patents | `patents.html` | 특허 목록. 더미 |
| Conferences | `conferences.html` | 학회 발표 목록. 더미 |
| Awards | `awards.html` | 수상 목록. 더미 |
| Gallery | `gallery.html` | 연도별(2025…) 3열 사진 그리드 + 캡션. 더미 이미지 |
| Contact | `contact.html` | 이메일·주소·지도·오시는 길 |

- **People 드롭다운**: 같은 `people.html`의 세 섹션으로 이동(앵커). Alumni는 자리표시(placeholder)만, 졸업생 생기면 항목 추가.
- **Research Outcomes 드롭다운**: 4개 별도 페이지. 각 페이지는 단순 목록 형태로 항목 추가가 쉬움.

---

## 4. 비주얼 디자인 (Visual Design)

### 레이아웃
- **PC**: 상단 고정 가로 메뉴 (로고 왼쪽 + 메뉴 오른쪽, Contact는 채운 버튼). 드롭다운은 hover/tap.
- **모바일**: 로고 + 햄버거 ☰ → 탭하면 메뉴 펼침. 드롭다운은 아코디언 형태.
- 콘텐츠 최대폭 약 1100px, 넉넉한 여백. 깔끔한 학술 톤.

### 색상 팔레트
| 역할 | HEX |
|---|---|
| Primary (메뉴/제목/푸터) | `#293681` 딥네이비 |
| Accent (버튼/링크/포인트) | `#4274D9` 밝은 파랑 |
| Soft accent | `#95CCDD` 연하늘 |
| Section background | `#D0E7E6` 페일틴트 |
| 본문 텍스트 | 짙은 회청색 (약 `#4a5570`) / 배경 흰색 |

### 타이포그래피
- 한글: 시스템 산세리프(예: Pretendard 또는 Noto Sans KR, 웹폰트). 영문 제목은 약간 굵고 넓은 산세리프.
- 제목은 딥네이비, 강조 단어/라벨은 accent 블루.

### 애니메이션 (은은한 수준)
- 스크롤 시 섹션 fade/slide-in
- 갤러리 썸네일 hover 확대
- 드롭다운 부드럽게 펼침, 스크롤 시 상단 메뉴바 그림자
- 히어로 은은한 그라데이션
- 과한 모션 배제

---

## 5. 기술 구성 (Technical Approach)

- **순수 HTML + CSS + Vanilla JS.** 프레임워크/빌드도구 없음.
- **공통 레이아웃**: `header`/`footer`를 한 파일로 두고 각 페이지에 작은 JS include로 주입 → 메뉴 수정은 한 곳에서만. (GitHub Pages는 http로 서빙되므로 fetch include 정상 동작)
- **파일 구조(안)**:
  ```
  /index.html, research.html, people.html, publications.html,
   patents.html, conferences.html, awards.html, gallery.html, contact.html
  /partials/header.html, footer.html
  /assets/css/style.css
  /assets/js/main.js
  /assets/img/...           (로고, 연구 이미지, 갤러리 사진 — 지금은 더미)
  /CNAME                    (도메인 연결 단계에서 추가)
  ```
- **더미 콘텐츠 규칙**: 실제 정보가 없는 곳(논문/특허/사진/일부 이름)은 "(예시)" 표시가 있는 자리표시로 채우고, 각 페이지 상단 주석에 "여기를 이렇게 바꾸세요" 가이드를 남긴다.

---

## 6. 배포 & 도메인 (Deploy)

1. GitHub 계정은 **이미 생성됨(랩실 공용 계정)** → 저장소 생성부터 시작. `<id>.github.io` 또는 `<repo>` 저장소.
2. 파일 push → Settings → Pages 에서 배포 → `https://<id>.github.io/` 확인.
3. 미리보기: 로컬에서 간단 서버 실행 + VS Code 포트 포워딩 (원격 SSH 환경).
4. dongguk.edu 도메인: 배포 후 CNAME/IP 정보로 학교에 신규 신청. 저장소에 `CNAME` 파일 추가.

---

## 7. 범위 밖 (Out of Scope, 지금은 안 함)
- 워드프레스/관리자 페이지, 로그인·회원, 검색, 다국어 토글, 방문자 통계.
- 실제 논문/사진 콘텐츠 채우기(더미로 두고 이후 별도 작업).
- 로고 그래픽 제작(당분간 텍스트 로고 "NEST Lab").

---

## 8. 열린 항목 (나중에)
- 실제 서브도메인 이름 확정(예: `namlab.dongguk.edu` vs `nestlab.dongguk.edu`).
- PI 영문 성함/직함 정확한 표기, 이메일, 구성원 실제 명단·사진.
- Alumni 항목.
