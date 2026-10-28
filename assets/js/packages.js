/* FLYBOO.COM — International Tours package list: destination filter, and closing the
   itinerary dialog before the enquiry form is filled in. Dialog opening/closing itself
   is handled by checklists.js. */
(function () {
  var select = document.getElementById('pkg-filter');
  var grid = document.getElementById('pkg-grid');
  var count = document.getElementById('pkg-count');
  if (select && grid) {
    var items = grid.querySelectorAll('li[data-group]');
    select.addEventListener('change', function () {
      var g = select.value, shown = 0;
      items.forEach(function (li) {
        var show = !g || li.getAttribute('data-group') === g;
        li.hidden = !show;
        if (show) shown++;
      });
      if (count) count.textContent = 'Showing ' + shown + (shown === 1 ? ' package' : ' packages') + (g ? ' for ' + g : '');
    });
  }

  // "Enquire about this package": close the modal first so the form can take focus
  document.querySelectorAll('dialog.vc-dialog [data-prefill]').forEach(function (b) {
    b.addEventListener('click', function () {
      var d = b.closest('dialog');
      if (d && d.open) d.close();
    }, true);
  });
})();
