/* FLYBOO.COM — shared enquiry form behaviour (service pages).
   Any <form data-enquiry> gets validation and an honest submit state.
   ENQUIRY_ENDPOINT: URL that accepts a JSON POST of the enquiry. While it is empty,
   the form validates but says plainly that nothing has been sent. */
(function () {
  var ENQUIRY_ENDPOINT = '';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  function errEl(f) { return document.getElementById(f.id + '-error'); }
  function clearError(f) {
    f.removeAttribute('aria-invalid');
    var e = errEl(f);
    if (e) { e.textContent = ''; e.hidden = true; }
  }
  function showError(f, msg) {
    f.setAttribute('aria-invalid', 'true');
    var e = errEl(f);
    if (e) { e.textContent = msg; e.hidden = false; }
  }
  function labelFor(form, f) {
    var l = form.querySelector('label[for="' + f.id + '"]');
    return l ? l.firstChild.textContent.trim() : f.name;
  }

  document.querySelectorAll('form[data-enquiry]').forEach(function (form) {
    var fields = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));
    var alertBox = form.querySelector('.form-message');
    var submit = form.querySelector('button[type="submit"]');
    var kind = form.getAttribute('data-enquiry');

    fields.forEach(function (f) {
      f.addEventListener('input', function () { clearError(f); });
      f.addEventListener('change', function () { clearError(f); });
    });

    function validate() {
      var problems = [];
      fields.forEach(function (f) {
        var v = f.value.trim();
        var msg = '';
        if (f.required && !v) msg = f.tagName === 'SELECT' ? 'Please choose an option.' : 'This field is required.';
        else if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Enter a valid email address, like name@example.com.';
        else if (f.type === 'tel' && v && v.replace(/\D/g, '').length < 7) msg = 'Enter a phone number with at least 7 digits.';
        else if (f.type === 'number' && v) {
          var n = parseInt(v, 10);
          if (isNaN(n) || n < +f.min || n > +f.max) msg = 'Enter a number from ' + f.min + ' to ' + f.max + '.';
        } else if (f.type === 'date' && v && f.min && v < f.min) msg = 'Choose today or a later date.';
        if (msg) problems.push({ field: f, msg: msg });
      });
      var dep = form.querySelector('[name="departDate"]'), ret = form.querySelector('[name="returnDate"]');
      if (dep && ret && dep.value && ret.value && ret.value < dep.value && !problems.some(function (p) { return p.field === ret; })) {
        problems.push({ field: ret, msg: 'Return date must be after the departure date.' });
      }
      return problems;
    }

    function showMessage(type, title, body) {
      alertBox.className = 'form-message form-message--' + type;
      alertBox.textContent = '';
      alertBox.appendChild(el('p', 'form-message__title', title));
      if (body) alertBox.appendChild(body);
      alertBox.setAttribute('role', type === 'error' ? 'alert' : 'status');
      alertBox.hidden = false;
      alertBox.focus();
      alertBox.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    }

    // Today as the earliest selectable date
    var t = new Date(), pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var today = t.getFullYear() + '-' + pad(t.getMonth() + 1) + '-' + pad(t.getDate());
    form.querySelectorAll('input[type="date"]').forEach(function (d) { d.min = today; });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      fields.forEach(clearError);
      alertBox.hidden = true;
      var problems = validate();
      if (problems.length) {
        problems.forEach(function (p) { showError(p.field, p.msg); });
        var ul = el('ul');
        problems.forEach(function (p) {
          var li = el('li'), a = el('a', null, labelFor(form, p.field) + ': ' + p.msg);
          a.href = '#' + p.field.id;
          a.addEventListener('click', function (ev) { ev.preventDefault(); p.field.focus(); });
          li.appendChild(a);
          ul.appendChild(li);
        });
        showMessage('error', problems.length === 1 ? 'Please fix 1 problem' : 'Please fix ' + problems.length + ' problems', ul);
        return;
      }

      var payload = { enquiryType: kind };
      fields.forEach(function (f) { if (f.name) payload[f.name] = f.value.trim(); });

      if (!ENQUIRY_ENDPOINT) {
        showMessage('notice', 'Your details look complete, but nothing has been sent',
          el('p', null, 'Online enquiries are not switched on yet, so this form has not delivered your request. Your entries are still on the page.'));
        return;
      }

      submit.disabled = true;
      submit.setAttribute('aria-disabled', 'true');
      var old = submit.textContent;
      submit.textContent = 'Sending…';
      fetch(ENQUIRY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        showMessage('success', 'Your enquiry has been submitted', el('p', null, 'Thank you. Our team will review your enquiry.'));
      }).catch(function () {
        showMessage('error', 'We could not send your enquiry',
          el('p', null, 'Something went wrong on our side. Your entries are still in the form, so please try again in a moment.'));
      }).then(function () {
        submit.disabled = false;
        submit.removeAttribute('aria-disabled');
        submit.textContent = old;
      });
    });
  });

  // Destination buttons pre-fill the enquiry's destination field
  document.querySelectorAll('[data-prefill]').forEach(function (b) {
    b.addEventListener('click', function () {
      var target = document.getElementById(b.getAttribute('data-prefill-target'));
      if (target) { target.value = b.getAttribute('data-prefill'); clearError(target); }
      var sec = document.getElementById('enquiry');
      if (sec) sec.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      if (target) target.focus({ preventScroll: true });
    });
  });
})();
