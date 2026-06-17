/* ---- Header & scroll ---- */
const header = document.getElementById('header');
const btt = document.getElementById('btt');
const reserveBar = document.getElementById('reserve-bar');
let heroBottom = 0;

function updateHeroBottom() {
  const hero = document.getElementById('hero');
  heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 500;
}
updateHeroBottom();
window.addEventListener('resize', updateHeroBottom);

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 40);
  btt.classList.toggle('show', y > 500);
  reserveBar.classList.toggle('show', y > heroBottom);
}, { passive: true });

btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---- Hamburger ---- */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

document.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ---- Fade in observer ---- */
const fadeEls = document.querySelectorAll('.fade-up');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
  });
}, { threshold: 0.10 });
fadeEls.forEach(el => obs.observe(el));

/* ---- Form ---- */
const form = document.getElementById('contact-form');
const formSent = document.getElementById('form-sent');

function checkField(el) {
  const g = el.closest('.f-group');
  if (!g) return true;
  const id = el.id;
  let ok = true;
  if (id === 'cf-name') ok = el.value.trim().length > 0;
  if (id === 'cf-tel')  ok = el.value.trim().length >= 7;
  g.classList.toggle('err', !ok);
  return ok;
}

['cf-name', 'cf-tel'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('blur', () => checkField(el));
  el.addEventListener('input', () => { if (el.closest('.f-group').classList.contains('err')) checkField(el); });
});

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const n = document.getElementById('cf-name');
    const t = document.getElementById('cf-tel');
    const ok1 = checkField(n);
    const ok2 = checkField(t);
    if (!ok1 || !ok2) { (!ok1 ? n : t).focus(); return; }

    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    btn.textContent = '送信中...';

    setTimeout(() => {
      form.style.display = 'none';
      formSent.style.display = 'block';
    }, 900);
  });
}

/* ---- Hero Slideshow ---- */
(function () {
  const slides = document.querySelectorAll('#hero .slide');
  const dots   = document.querySelectorAll('.slide-dots .dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function start() {
    timer = setInterval(() => goTo(current + 1), 3000);
  }

  start();

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(i);
      start();
    });
  });
})();

/* ---- Gallery Auto Scroll ---- */
(function () {
  const wrap   = document.querySelector('.gallery-scroll-wrap');
  const scroll = document.querySelector('.gallery-scroll');
  if (!wrap || !scroll) return;

  // アイテムを複製してシームレスループを作る（スマホのグリッド表示では非表示にする）
  Array.from(scroll.children).forEach(item => {
    const clone = item.cloneNode(true);
    clone.classList.add('gallery-clone');
    scroll.appendChild(clone);
  });

  let paused = false;
  let running = false;
  const SPEED = 0.7; // px/frame

  function tick() {
    if (!running) return;
    if (!paused) {
      wrap.scrollLeft += SPEED;
      // 折り返し点に達したら先頭に戻す（継ぎ目なし）
      if (wrap.scrollLeft >= scroll.scrollWidth / 2) {
        wrap.scrollLeft -= scroll.scrollWidth / 2;
      }
    }
    requestAnimationFrame(tick);
  }

  // 幅に応じて自動スクロールの動作を切り替え（リサイズにも追従）
  function sync() {
    const isMobile = window.innerWidth <= 640;
    if (isMobile) {
      running = false;
      wrap.scrollLeft = 0;
    } else if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  }

  sync();
  window.addEventListener('resize', sync);

  // クリックで停止 / 再開（PC幅のみ）
  wrap.addEventListener('click', () => {
    if (window.innerWidth <= 640) return;
    paused = !paused;
    wrap.classList.toggle('is-paused', paused);
  });
})();

/* ---- Today's hours display ---- */
const todayHours = document.getElementById('today-hours');
if (todayHours) {
  const day = new Date().getDay(); // 0=Sun
  const schedule = ['10:00〜17:00', '9:00〜19:00', '9:00〜19:00', '休診', '9:00〜19:00', '9:00〜19:00', '9:00〜18:00'];
  todayHours.textContent = schedule[day];
}
