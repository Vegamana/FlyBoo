/* FLYBOO.COM — Flights page search bar: trip type toggles the return date, and the swap button
   exchanges From and To. The bar is an enquiry form; it does not search or show fares. */
(function () {
  var form = document.getElementById('flights-form');
  if (!form) return;
  var ret = document.getElementById('fs-return');
  var hint = document.getElementById('fs-return-hint');
  var depart = document.getElementById('fs-depart');

  function sync() {
    var type = form.querySelector('input[name="tripType"]:checked').value;
    var round = type === 'Round trip';
    ret.disabled = !round;
    ret.required = round;
    ret.closest('.fs-cell').classList.toggle('is-off', !round);
    if (!round) { ret.value = ''; ret.removeAttribute('aria-invalid'); var e = document.getElementById('fs-return-error'); if (e) { e.textContent = ''; e.hidden = true; } }
    hint.textContent = round ? 'Must be after the departure date.' : (type === 'Multi city' ? 'Add your other cities in the message.' : 'Choose Round Trip to add a return date.');
    form.querySelector('label[for="fs-return"]').innerHTML = 'Return' + (round ? ' <span class="req" aria-hidden="true">*</span>' : '');
  }
  form.querySelectorAll('input[name="tripType"]').forEach(function (r) { r.addEventListener('change', sync); });

  document.getElementById('fs-swap').addEventListener('click', function () {
    var a = document.getElementById('fs-from'), b = document.getElementById('fs-to');
    var t = a.value; a.value = b.value; b.value = t;
  });

  depart.addEventListener('change', function () { if (!ret.disabled && ret.value && ret.value < depart.value) ret.value = ''; });
  sync();
})();
