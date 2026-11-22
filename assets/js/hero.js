/* FLYBOO.COM — homepage hero slideshow.
   Crossfades between the hero photographs every few seconds. Adds dots and a pause/play button.
   Pauses on hover, on keyboard focus and when the tab is hidden (WCAG 2.2.2). Visitors who prefer
   reduced motion start paused. Without JavaScript the first photograph simply stays on screen. */
(function () {
  var root = document.querySelector('.hero-carousel');
  if (!root) return;

  // Size the hero to the screen height below the (sticky) header, so the next section starts below the fold.
  var header = document.querySelector('.site-header');
  function setOffset() {
    if (header) document.documentElement.style.setProperty('--hero-offset', header.offsetHeight + 'px');
  }
  setOffset();
  window.addEventListener('resize', setOffset);
  window.addEventListener('orientationchange', setOffset);
  var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
  if (slides.length < 2) return;

  var DELAY = 5500;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var index = 0;
  var timer = null;
  var userPaused = reduce.matches;
  var hovering = false;

  var icons = { pause: 'M8 5v14M16 5v14', play: 'M8 5l11 7-11 7z' };
  function icon(d) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="' + d + '"/></svg>';
  }

  var ctl = document.createElement('div');
  ctl.className = 'hero-ctl';
  var dotsWrap = document.createElement('div');
  dotsWrap.className = 'hero-dots';
  dotsWrap.setAttribute('role', 'group');
  dotsWrap.setAttribute('aria-label', 'Choose a photograph');
  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'hero-ctl__btn';
  ctl.appendChild(dotsWrap);
  ctl.appendChild(toggle);
  root.appendChild(ctl);

  var dots = slides.map(function (s, i) {
    var d = document.createElement('button');
    d.type = 'button';
    d.className = 'hero-dots__dot';
    d.setAttribute('aria-label', 'Show photograph ' + (i + 1) + ' of ' + slides.length);
    d.addEventListener('click', function () { show(i); start(); });
    dotsWrap.appendChild(d);
    return d;
  });

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach(function (s, n) {
      var on = n === index;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    dots.forEach(function (d, n) {
      if (n === index) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
    });
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function start() {
    stop();
    if (userPaused || hovering || document.hidden) return;
    timer = setInterval(function () { show(index + 1); }, DELAY);
  }
  function sync() {
    toggle.setAttribute('aria-label', userPaused ? 'Start automatic slideshow' : 'Pause automatic slideshow');
    toggle.innerHTML = icon(userPaused ? icons.play : icons.pause);
    root.setAttribute('aria-live', userPaused ? 'polite' : 'off');
    start();
  }

  toggle.addEventListener('click', function () { userPaused = !userPaused; sync(); });
  root.addEventListener('mouseenter', function () { hovering = true; stop(); });
  root.addEventListener('mouseleave', function () { hovering = false; start(); });
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', start);
  if (reduce.addEventListener) reduce.addEventListener('change', function () { userPaused = reduce.matches; sync(); });

  show(0);
  sync();
})();
