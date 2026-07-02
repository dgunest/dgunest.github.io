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
