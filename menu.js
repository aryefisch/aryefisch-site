/* Grouped header menu (desktop dropdowns). Hover-intent open with a close delay so the pointer can
   travel from trigger into the panel; click pins open; outside-click / Escape close. Mobile ☰ panel
   is handled by each page's existing inline script and is unaffected. */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    var groups = Array.prototype.slice.call(document.querySelectorAll('.menu-group'));
    if (!groups.length) return;
    var hoverCapable = !!(window.matchMedia && window.matchMedia('(hover: hover)').matches);
    var closeTimer = null;
    var pinned = null;

    function trig(g) { return g.querySelector('.menu-trigger'); }
    function close(g) {
      if (!g) return;
      g.classList.remove('open');
      var t = trig(g); if (t) t.setAttribute('aria-expanded', 'false');
      if (pinned === g) pinned = null;
    }
    function closeAll() { groups.forEach(close); pinned = null; }
    function open(g) {
      groups.forEach(function (o) { if (o !== g) close(o); });
      g.classList.add('open');
      var t = trig(g); if (t) t.setAttribute('aria-expanded', 'true');
    }
    function cancelClose() { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; } }

    groups.forEach(function (g) {
      var t = trig(g);
      if (!t) return;

      // Click / tap / Enter / Space: pin open, or close if already pinned.
      t.addEventListener('click', function (e) {
        e.stopPropagation();
        if (g.classList.contains('open') && pinned === g) { close(g); }
        else { cancelClose(); open(g); pinned = g; }
      });

      // Hover intent (mouse only): open on enter, close after a delay on leave (cancelled on re-enter).
      g.addEventListener('mouseenter', function () {
        if (!hoverCapable) return;
        cancelClose();
        open(g);
      });
      g.addEventListener('mouseleave', function () {
        if (!hoverCapable) return;
        if (pinned === g) return;
        cancelClose();
        closeTimer = setTimeout(function () { close(g); closeTimer = null; }, 300);
      });

      // Keyboard: focus into the group opens it; focus leaving the group closes it (unless pinned).
      g.addEventListener('focusin', function () { cancelClose(); open(g); });
      g.addEventListener('focusout', function (e) {
        if (g.contains(e.relatedTarget)) return;
        if (pinned === g) return;
        close(g);
      });
    });

    document.addEventListener('click', function () { closeAll(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        var openG = groups.filter(function (g) { return g.classList.contains('open'); })[0];
        closeAll();
        if (openG) { var t = trig(openG); if (t) t.focus(); }
      }
    });
  });
})();
