/* FLYBOO.COM — Travel Visa page behaviour
   1. Country search: accessible combobox with autocomplete (WAI-ARIA 1.2 pattern)
   2. Enquiry form: destination/category menus, validation, success/error states
   Depends on assets/js/visa-data.js (loaded first). */
(function () {
  'use strict';

  /* ---- Configuration ---------------------------------------------------
     ENQUIRY_ENDPOINT: URL that accepts a JSON POST of the enquiry (a form
     service, serverless function or API). While it is empty the form only
     validates and tells the visitor that nothing has been sent — it never
     claims delivery. */
  var ENQUIRY_ENDPOINT = '';

  var DEST = window.FLYBOO_VISA_DESTINATIONS || [];
  var POPULAR = window.FLYBOO_VISA_POPULAR || [];
  var CATS = window.FLYBOO_VISA_CATEGORIES || [];
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function byId(id) { return document.getElementById(id); }
  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function bySlug(slug) {
    for (var i = 0; i < DEST.length; i++) if (DEST[i].slug === slug) return DEST[i];
    return null;
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var live = byId('visa-live');
  function announce(msg) {
    if (!live) return;
    live.textContent = '';
    window.setTimeout(function () { live.textContent = msg; }, 30);
  }

  /* ======================================================================
     Enquiry form — shared helpers (also used by the search and cards)
     ====================================================================== */
  var form = byId('visa-enquiry-form');
  var fDest = byId('enq-destination');
  var fOther = byId('enq-other');
  var fOtherWrap = byId('enq-other-wrap');
  var fCategory = byId('enq-category');

  function fillSelect(select, placeholder, items) {
    select.textContent = '';
    var ph = el('option', null, placeholder);
    ph.value = '';
    select.appendChild(ph);
    items.forEach(function (it) {
      var o = el('option', null, it.label);
      o.value = it.value;
      select.appendChild(o);
    });
  }

  function toggleOther() {
    if (!fDest || !fOtherWrap) return;
    var show = fDest.value === 'other';
    fOtherWrap.hidden = !show;
    fOther.required = show;
    if (!show) { fOther.value = ''; clearError(fOther); }
  }

  function setDestination(slug, otherText) {
    if (!fDest) return false;
    fDest.value = slug;
    if (fDest.value !== slug) return false;
    toggleOther();
    if (slug === 'other' && otherText) fOther.value = otherText;
    clearError(fDest);
    return true;
  }

  function goToEnquiry(message) {
    var section = byId('enquiry');
    if (!section) return;
    section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    var next = fDest && !fDest.value ? fDest : (fOtherWrap && !fOtherWrap.hidden && !fOther.value ? fOther : fCategory);
    if (next) next.focus({ preventScroll: true });
    if (message) announce(message);
  }

  /* ======================================================================
     1. Country search combobox
     ====================================================================== */
  var searchForm = byId('country-search');
  var input = byId('country-input');
  var list = byId('country-listbox');

  if (searchForm && input && list) {
    var items = [];     // currently rendered options: {type:'dest'|'other', dest?, text?}
    var active = -1;

    function isOpen() { return !list.hidden; }

    function setActive(i) {
      var opts = list.children;
      if (active >= 0 && opts[active]) opts[active].setAttribute('aria-selected', 'false');
      active = i;
      if (i >= 0 && opts[i]) {
        opts[i].setAttribute('aria-selected', 'true');
        input.setAttribute('aria-activedescendant', opts[i].id);
        opts[i].scrollIntoView({ block: 'nearest' });
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }

    function close() {
      list.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      setActive(-1);
    }

    function search(query) {
      var q = norm(query);
      if (!q) return [];
      var out = [];
      DEST.forEach(function (d, order) {
        var name = norm(d.name), score = -1, via = '';
        if (name.indexOf(q) === 0) score = 0;
        else if (name.split(' ').some(function (w) { return w.indexOf(q) === 0; })) score = 1;
        else {
          for (var i = 0; i < d.aliases.length; i++) {
            var a = norm(d.aliases[i]);
            if (a.indexOf(q) === 0) { score = 2; via = d.aliases[i]; break; }
          }
        }
        if (score >= 0) out.push({ type: 'dest', dest: d, via: via, score: score, order: order });
      });
      out.sort(function (a, b) { return a.score - b.score || a.order - b.order; });
      return out.slice(0, 8);
    }

    function render(query) {
      var trimmed = query.trim();
      var results;
      if (!trimmed) {
        results = POPULAR.map(function (s) { return bySlug(s); }).filter(Boolean)
          .map(function (d) { return { type: 'dest', dest: d, via: '' }; });
      } else {
        results = search(trimmed);
        // Offer the "not listed" route only when nothing in the list matches
        if (!results.length) results.push({ type: 'other', text: trimmed });
      }
      items = results;
      list.textContent = '';
      items.forEach(function (it, i) {
        var li = el('li', 'country-search__option' + (it.type === 'other' ? ' country-search__option--other' : ''));
        li.id = 'country-opt-' + i;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        if (it.type === 'other') {
          li.appendChild(el('span', 'country-search__option-name', 'Enquire about “' + it.text + '”'));
          li.appendChild(el('span', 'country-search__option-hint', 'Not listed'));
        } else {
          li.appendChild(el('span', 'country-search__option-name', it.dest.name));
          if (it.via) li.appendChild(el('span', 'country-search__option-hint', 'includes ' + it.via));
        }
        li.addEventListener('mousedown', function (e) { e.preventDefault(); }); // keep focus in the input
        li.addEventListener('click', function () { choose(it); });
        li.addEventListener('mousemove', function () { if (active !== i) setActive(i); });
        list.appendChild(li);
      });
      active = -1;
      input.removeAttribute('aria-activedescendant');
      list.hidden = items.length === 0;
      input.setAttribute('aria-expanded', String(items.length > 0));
      if (items.length) {
        var n = items.length;
        announce(n + (n === 1 ? ' suggestion' : ' suggestions') + ' available. Use the up and down arrow keys to review and Enter to select.');
      }
    }

    function choose(it) {
      close();
      if (it.type === 'other') {
        input.value = it.text;
        setDestination('other', it.text);
        goToEnquiry('Your destination is not on our list. The enquiry form is open so you can tell us where you want to travel.');
        return;
      }
      input.value = it.dest.name;
      if (it.dest.page) { window.location.href = it.dest.page; return; }
      setDestination(it.dest.slug);
      goToEnquiry('Destination set to ' + it.dest.name + '. Moved to the visa enquiry form.');
    }

    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('focus', function () { if (!isOpen() && !input.value.trim()) render(''); });
    input.addEventListener('click', function () { if (!isOpen()) render(input.value); });

    input.addEventListener('keydown', function (e) {
      var n = list.children.length;
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen()) { render(input.value); if (list.children.length) setActive(0); break; }
          setActive(active + 1 >= n ? 0 : active + 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!isOpen()) { render(input.value); if (list.children.length) setActive(list.children.length - 1); break; }
          setActive(active <= 0 ? n - 1 : active - 1);
          break;
        case 'Enter':
          if (isOpen() && active >= 0) { e.preventDefault(); choose(items[active]); }
          break;                      // otherwise the form's submit handler decides
        case 'Escape':
          if (isOpen()) { e.preventDefault(); close(); }
          else if (input.value) { input.value = ''; }
          break;
        case 'Tab':
          close();
          break;
      }
    });

    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (!q) {
        render('');
        announce('Type a country name, or pick one of the suggestions.');
        input.focus();
        return;
      }
      var results = search(q);
      var first = results.filter(function (r) { return norm(r.dest.name) === norm(q); })[0] || results[0];
      choose(first || { type: 'other', text: q });
    });

    document.addEventListener('click', function (e) {
      if (isOpen() && !searchForm.contains(e.target)) close();
    });
    searchForm.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !searchForm.contains(e.relatedTarget)) close();
    });
  }

  /* ======================================================================
     2. Enquiry form
     ====================================================================== */
  function errEl(field) { return byId(field.id + '-error'); }
  function clearError(field) {
    if (!field) return;
    field.removeAttribute('aria-invalid');
    var e = errEl(field);
    if (e) { e.textContent = ''; e.hidden = true; }
  }
  function showError(field, msg) {
    field.setAttribute('aria-invalid', 'true');
    var e = errEl(field);
    if (e) { e.textContent = msg; e.hidden = false; }
  }

  if (form) {
    var alertBox = byId('enq-alert');
    var fDate = byId('enq-date');
    var fTrav = byId('enq-travellers');
    var fName = byId('enq-name');
    var fEmail = byId('enq-email');
    var fPhone = byId('enq-phone');
    var fMsg = byId('enq-message');

    fillSelect(fDest, 'Select a destination', DEST.map(function (d) { return { value: d.slug, label: d.name }; })
      .concat([{ value: 'other', label: 'Other / not listed' }]));
    fillSelect(fCategory, 'Select a visa category', CATS);

    // Earliest selectable travel date = today (local time)
    var now = new Date();
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    var todayStr = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
    fDate.min = todayStr;

    fDest.addEventListener('change', function () { toggleOther(); });

    // Pre-select from ?destination=<slug> (e.g. a shared link)
    var qs = new URLSearchParams(window.location.search).get('destination');
    if (qs) setDestination(qs);

    // Destination card CTAs: set the destination and jump to the form
    document.querySelectorAll('a[data-destination]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var d = bySlug(a.getAttribute('data-destination'));
        if (!d) return;
        if (d.page) { a.href = d.page; return; }   // a verified detail page exists: follow it
        e.preventDefault();
        setDestination(d.slug);
        goToEnquiry('Destination set to ' + d.name + '. Moved to the visa enquiry form.');
      });
    });

    // Clear a field's error as soon as the visitor edits it
    [fDest, fOther, fCategory, fDate, fTrav, fName, fEmail, fPhone, fMsg].forEach(function (f) {
      f.addEventListener('input', function () { clearError(f); });
      f.addEventListener('change', function () { clearError(f); });
    });

    function validate() {
      var problems = [];
      function bad(field, msg) { problems.push({ field: field, msg: msg }); }

      if (!fDest.value) bad(fDest, 'Choose a destination.');
      if (fDest.value === 'other' && !fOther.value.trim()) bad(fOther, 'Tell us which country you are travelling to.');
      if (!fCategory.value) bad(fCategory, 'Choose a visa category.');

      if (fDate.value) {
        var d = new Date(fDate.value + 'T00:00:00');
        var today = new Date(todayStr + 'T00:00:00');
        if (isNaN(d.getTime())) bad(fDate, 'Enter a valid date.');
        else if (d < today) bad(fDate, 'Travel date cannot be in the past.');
      }

      var t = fTrav.value.trim();
      if (!t) bad(fTrav, 'Enter the number of travellers.');
      else if (!/^\d+$/.test(t) || +t < 1 || +t > 20) bad(fTrav, 'Enter a whole number from 1 to 20.');

      if (fName.value.trim().length < 2) bad(fName, 'Enter your full name.');

      var email = fEmail.value.trim();
      if (!email) bad(fEmail, 'Enter your email address.');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) bad(fEmail, 'Enter a valid email address, like name@example.com.');

      var phone = fPhone.value.trim();
      var digits = phone.replace(/\D/g, '');
      if (!phone) bad(fPhone, 'Enter a phone number.');
      else if (!/^[+\d][\d\s().-]*$/.test(phone) || digits.length < 7 || digits.length > 15) bad(fPhone, 'Enter a valid phone number (7 to 15 digits).');

      return problems;
    }

    function labelFor(field) {
      var l = form.querySelector('label[for="' + field.id + '"]');
      return l ? l.firstChild.textContent.trim() : field.name;
    }

    function showMessage(kind, title, bodyNode) {
      alertBox.className = 'form-message form-message--' + kind;
      alertBox.textContent = '';
      alertBox.appendChild(el('p', 'form-message__title', title));
      if (bodyNode) alertBox.appendChild(bodyNode);
      alertBox.setAttribute('role', kind === 'error' ? 'alert' : 'status');
      alertBox.hidden = false;
      alertBox.focus();
      alertBox.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    }

    var submit = byId('enq-submit');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      [fDest, fOther, fCategory, fDate, fTrav, fName, fEmail, fPhone].forEach(clearError);
      alertBox.hidden = true;

      var problems = validate();
      if (problems.length) {
        problems.forEach(function (p) { showError(p.field, p.msg); });
        var ul = el('ul');
        problems.forEach(function (p) {
          var li = el('li'), a = el('a', null, labelFor(p.field) + ': ' + p.msg);
          a.href = '#' + p.field.id;
          a.addEventListener('click', function (ev) { ev.preventDefault(); p.field.focus(); });
          li.appendChild(a);
          ul.appendChild(li);
        });
        showMessage('error', problems.length === 1 ? 'Please fix 1 problem' : 'Please fix ' + problems.length + ' problems', ul);
        return;
      }

      var payload = {
        destination: fDest.value === 'other' ? fOther.value.trim() : fDest.options[fDest.selectedIndex].text,
        visaCategory: fCategory.options[fCategory.selectedIndex].text,
        travelDate: fDate.value || null,
        travellers: parseInt(fTrav.value, 10),
        name: fName.value.trim(),
        email: fEmail.value.trim(),
        phone: fPhone.value.trim(),
        message: fMsg.value.trim()
      };

      if (!ENQUIRY_ENDPOINT) {
        // No backend connected: be honest — nothing has been sent.
        showMessage('notice', 'Your details look complete, but nothing has been sent',
          el('p', null, 'Online enquiries are not switched on yet, so this form has not delivered your request. Your entries are still on the page.'));
        return;
      }

      submit.disabled = true;
      submit.setAttribute('aria-disabled', 'true');
      var oldLabel = submit.textContent;
      submit.textContent = 'Sending…';

      fetch(ENQUIRY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        toggleOther();
        showMessage('success', 'Your enquiry has been submitted',
          el('p', null, 'Thank you. A visa specialist will review your enquiry.'));
      }).catch(function () {
        showMessage('error', 'We could not send your enquiry',
          el('p', null, 'Something went wrong on our side. Your entries are still in the form, so please try again in a moment.'));
      }).then(function () {
        submit.disabled = false;
        submit.removeAttribute('aria-disabled');
        submit.textContent = oldLabel;
      });
    });
  }
})();
