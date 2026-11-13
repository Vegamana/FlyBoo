/* FLYBOO.COM — homepage destinations carousel.
   Auto-advances one card at a time, then loops back to the start. Pauses on hover, keyboard focus
   and when the tab is hidden, and has a visible pause/play button (WCAG 2.2.2). Visitors who prefer
   reduced motion get no auto-advance. Without JavaScript the row still scrolls by swipe or keyboard. */
(function () {
  var root = document.querySelector('.dest-carousel');
  if (!root) return;
  var track = root.querySelector('.dest-track');
  var cards = track.children;
  if (cards.length < 2) return;

  var DELAY = 4000;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var timer = null;
  var userPaused = reduce.matches; // reduced motion starts paused, the visitor can still press play
  var hovering = false;

  var icons = {
    prev: 'M15 6l-6 6 6 6',
    next: 'M9 6l6 6-6 6',
    pause: 'M8 5v14M16 5v14',
    play: 'M8 5l11 7-11 7z'
  };
  function icon(d) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="' + d + '"/></svg>';
  }

  var ctl = document.createElement('div');
  ctl.className = 'dest-ctl';
  function btn(label, d) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'dest-ctl__btn';
    b.setAttribute('aria-label', label);
    b.innerHTML = icon(d);
    ctl.appendChild(b);
    return b;
  }
  var prev = btn('Previous destinations', icons.prev);
  var toggle = btn('Pause automatic scrolling', icons.pause);
  var next = btn('Next destinations', icons.next);
  root.appendChild(ctl);

  function step() {
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return cards[0].getBoundingClientRect().width + gap;
  }
  function maxScroll() { return track.scrollWidth - track.clientWidth; }
  function smooth() { return reduce.matches ? 'auto' : 'smooth'; }

  function advance(dir) {
    var max = maxScroll();
    var x = track.scrollLeft;
    if (dir > 0) {
      if (x >= max - 4) track.scrollTo({ left: 0, behavior: smooth() }); // loop back to the start
      else track.scrollTo({ left: Math.min(max, x + step()), behavior: smooth() });
    } else {
      if (x <= 4) track.scrollTo({ left: max, behavior: smooth() });
      else track.scrollTo({ left: Math.max(0, x - step()), behavior: smooth() });
    }
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

  root.addEventListener('mouseenter', function () { hovering = true; stop(); });
  root.addEventListener('mouseleave', function () { hovering = false; start(); });
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', function () { start(); });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); advance(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); advance(-1); }
  });
  document.addEventListener('visibilitychange', start);
  if (reduce.addEventListener) reduce.addEventListener('change', function () { userPaused = reduce.matches; sync(); });

  sync();
})();
