/* FLYBOO.COM — mobile navigation toggle (progressive enhancement).
   Without JavaScript the nav simply stays visible as a stacked list. */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  var desktop = window.matchMedia('(min-width: 60em)');

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.nav-toggle__label').textContent = open ? 'Close' : 'Menu';
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (toggle.getAttribute('aria-expanded') === 'true' &&
        !nav.contains(e.target) && !toggle.contains(e.target)) {
      setOpen(false);
    }
  });

  // Close the panel after choosing a link (same-page anchors keep the page loaded)
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  // Return focus to the toggle if focus leaves the open panel via Tab
  nav.addEventListener('focusout', function (e) {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    var next = e.relatedTarget;
    if (next && !nav.contains(next) && !toggle.contains(next)) setOpen(false);
  });

  // Soft shadow under the sticky header once the page has scrolled
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 4);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reset when resizing up to the desktop layout
  desktop.addEventListener('change', function (e) {
    if (e.matches) setOpen(false);
  });
  // Holidays dropdown: click/tap, Enter/Space, arrow keys and Escape (hover is handled in CSS)
  var dd = document.querySelector('.has-dropdown');
  if (dd) {
    var ddBtn = dd.querySelector('.nav-dropdown__toggle');
    var ddLinks = dd.querySelectorAll('.nav-dropdown a');
    var setDd = function (open) {
      dd.classList.toggle('is-open', open);
      ddBtn.setAttribute('aria-expanded', String(open));
    };
    ddBtn.addEventListener('click', function () { setDd(!dd.classList.contains('is-open')); });
    ddBtn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); setDd(true); ddLinks[0].focus(); }
    });
    dd.addEventListener('keydown', function (e) {
      var items = Array.prototype.slice.call(ddLinks);
      var i = items.indexOf(document.activeElement);
      if (e.key === 'Escape' && dd.classList.contains('is-open')) {
        e.stopPropagation();
        setDd(false);
        ddBtn.focus();
      } else if (i > -1 && e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (i > -1 && e.key === 'ArrowUp') { e.preventDefault(); (i === 0 ? ddBtn : items[i - 1]).focus(); }
    });
    dd.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !dd.contains(e.relatedTarget)) setDd(false);
    });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) setDd(false); });
    desktop.addEventListener('change', function () { setDd(false); });
  }
})();
