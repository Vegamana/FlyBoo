/* FLYBOO.COM — Flights page search bar: trip type toggles the return date, and the swap button
   exchanges From and To. The bar is an enquiry form; it does not search or show fares. */
(function () {
  var form = document.getElementById('flights-form');
  if (!form) return;
  var ret = document.getElementById('fs-return');
  var hint = document.getElementById('fs-return-hint');
  var depart = document.getElementById('fs-depart');

  var leg2 = document.getElementById('fs-leg2');
  var leg1 = document.getElementById('fs-leg1');
  var leg2Fields = leg2.querySelectorAll('input');

  function sync() {
    var type = form.querySelector('input[name="tripType"]:checked').value;
    var round = type === 'Round trip';
    var multi = type === 'Multi city';
    leg2.hidden = !multi;
    leg1.hidden = !multi;
    leg2Fields.forEach(function (f) {
      f.disabled = !multi;
      f.required = multi;
      if (!multi) {
        f.value = '';
        f.removeAttribute('aria-invalid');
        var er = document.getElementById(f.id + '-error');
        if (er) { er.textContent = ''; er.hidden = true; }
      }
    });
    ret.disabled = !round;
    ret.required = round;
    ret.closest('.fs-cell').classList.toggle('is-off', !round);
    if (!round) { ret.value = ''; ret.removeAttribute('aria-invalid'); var e = document.getElementById('fs-return-error'); if (e) { e.textContent = ''; e.hidden = true; } }
    hint.textContent = round ? 'Must be after the departure date.' : (multi ? 'Not used for multi city. Flight 2 is below.' : 'Choose Round Trip to add a return date.');
    form.querySelector('label[for="fs-return"]').innerHTML = 'Return' + (round ? ' <span class="req" aria-hidden="true">*</span>' : '');
  }
  form.querySelectorAll('input[name="tripType"]').forEach(function (r) { r.addEventListener('change', sync); });

  function swapper(btnId, fromId, toId) {
    document.getElementById(btnId).addEventListener('click', function () {
      var a = document.getElementById(fromId), b = document.getElementById(toId);
      var t = a.value; a.value = b.value; b.value = t;
    });
  }
  swapper('fs-swap', 'fs-from', 'fs-to');
  swapper('fs-swap2', 'fs-from2', 'fs-to2');

  depart.addEventListener('change', function () { if (!ret.disabled && ret.value && ret.value < depart.value) ret.value = ''; });
  form.addEventListener('reset', function () { setTimeout(sync, 0); }); // after a successful send the form resets to One Way
  sync();
})();
