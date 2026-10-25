/* FLYBOO.COM — adds previous/next buttons and a count to scrollable photo galleries.
   Without JavaScript the gallery still scrolls by swipe, trackpad or keyboard. */
(function () {
  var arrow = function (d) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="' + d + '"/></svg>';
  };
  document.querySelectorAll('.gallery').forEach(function (g) {
    var track = g.querySelector('.gallery__track');
    var slides = track.children;
    if (!track || slides.length < 2) return;

    function btn(dir, label, path) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'gallery__btn gallery__btn--' + dir;
      b.setAttribute('aria-label', label);
      b.innerHTML = arrow(path);
      g.appendChild(b);
      return b;
    }
    var prev = btn('prev', 'Previous photo', 'M15 6l-6 6 6 6');
    var next = btn('next', 'Next photo', 'M9 6l6 6-6 6');
    var count = document.createElement('span');
    count.className = 'gallery__count';
    count.setAttribute('aria-hidden', 'true');
    g.appendChild(count);

    function index() { return Math.round(track.scrollLeft / track.clientWidth); }
    function update(forced) {
      var i = typeof forced === 'number' ? forced : index();
      count.textContent = (i + 1) + ' / ' + slides.length;
      prev.disabled = i <= 0;
      next.disabled = i >= slides.length - 1;
    }
    function go(step) {
      var i = Math.max(0, Math.min(slides.length - 1, index() + step));
      track.scrollTo({ left: i * track.clientWidth });
      update(i); // reflect the target right away; the scroll listener keeps it correct for swipes
    }
    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    track.addEventListener('scroll', function () { update(); }, { passive: true });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    window.addEventListener('resize', function () { update(); });
    update();
  });
})();
