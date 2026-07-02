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

  // 모바일 메뉴 토글 (햄버거 aria-expanded도 .menu.open 상태에 맞춰 동기화)
  burger && burger.addEventListener('click', ()=>{
    menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', menu.classList.contains('open'));
  });

  // 모바일 드롭다운 아코디언 (데스크톱은 CSS hover가 처리)
  // ≤820px에서는 상위 라벨 탭이 페이지 이동 대신 하위 메뉴 아코디언을 토글하는 것이 의도된 동작이다.
  // (상위 라벨은 모바일에서 내비게이션하지 않고, 펼쳐진 하위 항목이 실제 이동을 담당한다.)
  // 이 preventDefault를 "버그"로 오해해 제거하면 모바일 아코디언이 깨지므로 그대로 둘 것.
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

  // 언어 전환 토글
  const langBtn = document.querySelector('.lang-toggle');
  function syncLangBtn(){ langBtn && (langBtn.textContent = document.documentElement.lang === 'en' ? 'KOR' : 'ENG'); }
  syncLangBtn();
  langBtn && langBtn.addEventListener('click', ()=>{
    const next = document.documentElement.lang === 'en' ? 'ko' : 'en';
    document.documentElement.lang = next;
    localStorage.setItem('lang', next);
    syncLangBtn();
  });
}

function initReveal(){
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('visible'); io.unobserve(en.target); }});
  }, {threshold:.12});
  els.forEach(el=>io.observe(el));
}

document.addEventListener('DOMContentLoaded', async ()=>{
  document.documentElement.lang = localStorage.getItem('lang') || 'ko';
  try{
    await inject('site-header','partials/header.html');
    await inject('site-footer','partials/footer.html');
  }catch(err){
    console.warn('헤더/푸터 로드 실패 — 로컬에서 file://로 열지 말고 python3 -m http.server로 실행하세요', err);
  }
  // 헤더가 실제로 주입됐을 때만 내비 초기화, reveal은 항상 시도
  if(document.querySelector('.site-header')) initNav();
  initReveal();
});
