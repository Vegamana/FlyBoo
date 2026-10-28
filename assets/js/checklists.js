/* FLYBOO.COM — visa checklist dialogs (Travel Visa page).
   Each card button opens its native <dialog>. Escape closes it and focus returns to the card button. */
(function () {
  var dialogs = document.querySelectorAll('dialog.vc-dialog');
  if (!dialogs.length || typeof dialogs[0].showModal !== 'function') return;

  document.querySelectorAll('[data-checklist-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var d = document.getElementById(btn.getAttribute('data-checklist-open'));
      if (!d) return;
      d.showModal();
      var body = d.querySelector('.vc-dialog__body');
      if (body) body.scrollTop = 0;
    });
  });

  dialogs.forEach(function (d) {
    // Close buttons
    d.querySelectorAll('[data-checklist-close]').forEach(function (b) {
      b.addEventListener('click', function () { d.close(); });
    });
    // Click on the dimmed backdrop (outside the panel) closes
    d.addEventListener('click', function (e) {
      if (e.target === d) d.close();
    });
    // The enquiry link closes the dialog first, so the page can scroll to the form
    d.querySelectorAll('a[data-destination]').forEach(function (a) {
      a.addEventListener('click', function () { d.close(); }, true);
    });
  });
})();
