# 이미지 폴더 안내

사이트에서 쓰는 모든 이미지는 여기에 둡니다. 용도별 폴더:

- `favicon.png`      — 브라우저 탭에 뜨는 랩/학교 마크 (정사각형 권장, 32x32~512x512)
- `logo.png`         — (선택) 상단 헤더 로고로 쓸 이미지
- `people/`          — 구성원(PI·멤버) 사진.  예: `people/이종욱.png`
- `research/`        — 연구 페이지 대표 이미지. 예: `research/biosensing-1.png`
- `gallery/`         — 갤러리 사진.            예: `gallery/2025-biochip.jpg`

## 넣는 법
1. 이 폴더에 이미지 파일을 넣는다.
2. 해당 HTML의 자리표시(`<div class="ph">사진</div>` 또는 `.photo`)를
   `<img src="assets/img/gallery/파일명.jpg" alt="설명">` 으로 바꾼다.
3. 자세한 건 프로젝트 루트의 `README.md`(관리 매뉴얼) 참고.
