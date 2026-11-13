/* FLYBOO.COM — homepage testimonials carousel.
   Pagination dots, previous/next and a pause/play button. Auto-advances gently, pauses on hover, keyboard
   focus and when the tab is hidden (WCAG 2.2.2). Reduced-motion visitors start paused. Without JavaScript
   the row still scrolls by swipe or keyboard. */
(function () {
  var root = document.querySelector('.testi-carousel');
  if (!root) return;
  var track = root.querySelector('.testi-track');
  var cards = track.children;
  if (cards.length < 2) return;

  var DELAY = 6000;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var timer = null;
  var userPaused = reduce.matches;
  var hovering = false;

  var icons = { prev: 'M15 6l-6 6 6 6', next: 'M9 6l6 6-6 6', pause: 'M8 5v14M16 5v14', play: 'M8 5l11 7-11 7z' };
  function icon(d) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="' + d + '"/></svg>';
  }

  var ctl = document.createElement('div');
  ctl.className = 'testi-ctl';
  var dotsWrap = document.createElement('div');
  dotsWrap.className = 'testi-dots';
  dotsWrap.setAttribute('role', 'group');
  dotsWrap.setAttribute('aria-label', 'Choose testimonials');
  var btns = document.createElement('div');
  btns.className = 'testi-btns';
  ctl.appendChild(dotsWrap);
  ctl.appendChild(btns);
  function btn(label, d) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'testi-btns__btn';
    b.setAttribute('aria-label', label);
    b.innerHTML = icon(d);
    btns.appendChild(b);
    return b;
  }
  var prev = btn('Previous testimonials', icons.prev);
  var toggle = btn('Pause automatic scrolling', icons.pause);
  var next = btn('Next testimonials', icons.next);
  root.appendChild(ctl);

  function step() {
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return cards[0].getBoundingClientRect().width + gap;
  }
  function maxScroll() { return track.scrollWidth - track.clientWidth; }
  function smooth() { return reduce.matches ? 'auto' : 'smooth'; }
  function positions() { return Math.max(1, Math.round(maxScroll() / step()) + 1); }
  function current() { return Math.min(positions() - 1, Math.round(track.scrollLeft / step())); }

  var dots = [];
  function buildDots() {
    var n = positions();
    if (dots.length === n) return;
    dotsWrap.innerHTML = '';
    dots = [];
    for (var i = 0; i < n; i++) {
      (function (i) {
        var d = document.createElement('button');
        d.type = 'button';
        d.className = 'testi-dots__dot';
        d.setAttribute('aria-label', 'Go to position ' + (i + 1) + ' of ' + n);
        d.addEventListener('click', function () { goTo(i); start(); });
        dotsWrap.appendChild(d);
        dots.push(d);
      })(i);
    }
  }
  function markDots() {
    var c = current();
    dots.forEach(function (d, i) {
      if (i === c) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
    });
  }
  function goTo(i) { track.scrollTo({ left: Math.min(maxScroll(), i * step()), behavior: smooth() }); }

  function advance(dir) {
    var c = current(), n = positions();
    goTo(dir > 0 ? (c >= n - 1 ? 0 : c + 1) : (c <= 0 ? n - 1 : c - 1)); // loops at both ends
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function start() {
    stop();
    if (userPaused || hovering || document.hidden) return;
    timer = setInterval(function () { advance(1); }, DELAY);
  }
  function sync() {
    toggle.setAttribute('aria-label', userPaused ? 'Start automatic scrolling' : 'Pause automatic scrolling');
    toggle.innerHTML = icon(userPaused ? icons.play : icons.pause);
    track.setAttribute('aria-live', userPaused ? 'polite' : 'off');
    start();
  }

  prev.addEventListener('click', function () { advance(-1); start(); });
  next.addEventListener('click', function () { advance(1); start(); });
  toggle.addEventListener('click', function () { userPaused = !userPaused; sync(); });
  track.addEventListener('scroll', markDots, { passive: true });
  window.addEventListener('resize', function () { buildDots(); markDots(); });

  root.addEventListener('mouseenter', function () { hovering = true; stop(); });
  root.addEventListener('mouseleave', function () { hovering = false; start(); });
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); advance(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); advance(-1); }
  });
  document.addEventListener('visibilitychange', start);
  if (reduce.addEventListener) reduce.addEventListener('change', function () { userPaused = reduce.matches; sync(); });

  buildDots();
  markDots();
  sync();
})();
