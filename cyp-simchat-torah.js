/* CYP Simchat Torah - Chabadone article 6284529
   Companion to cyp-simchat-torah.css. Does nothing on any other page.

   1. switches the theme on (html.cyp-st) for this article only
   2. wraps the input rows in one card (#cyp-form-card)
   3. turns "PREGAME:" / "POSTGAME:" openers into small tags
   4. fades each block of copy in as it scrolls into view
   5. locks the field colours (off-white box, dark text) inline, because the
      site's own form theme can otherwise repaint them

   Content is still edited in Chabadone as usual - nothing here hard-codes
   any wording. */
(function () {
  var AID = '6284529';
  var html = document.documentElement;

  function onThisArticle() {
    return new RegExp('aid[/=]' + AID + '(?!\\d)', 'i').test(location.href) ||
           !!document.getElementById(AID);            /* the form's own id */
  }

  /* The site ships without a usable viewport tag on some pages; without one
     phones lay the page out at ~980px and zoom out. Must run while the
     document is still parsing to take effect. */
  function ensureViewport() {
    if (document.querySelector('meta[name="viewport"][content]')) return;
    if (document.readyState === 'loading') {
      document.write('<meta name="viewport" content="width=device-width, initial-scale=1">');
    } else {
      var m = document.createElement('meta');
      m.name = 'viewport';
      m.content = 'width=device-width, initial-scale=1';
      document.head.insertBefore(m, document.head.firstChild);
    }
  }

  /* All input rows (first row that holds a control, through the end of the
     list) go into one card. Intro image + copy stay outside it. Found by
     content, not by field id, because ids shift as the form is edited. */
  function wrapFormCard() {
    if (document.getElementById('cyp-form-card')) return;
    var section = document.querySelector('#formContainer ul.form-section');
    if (!section) return;

    var first = null;
    var rows = section.children;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].querySelector('input:not([type="hidden"]), select, textarea, button')) {
        first = rows[i];
        break;
      }
    }
    if (!first) return;

    var card = document.createElement('div');
    card.id = 'cyp-form-card';
    section.insertBefore(card, first);
    var node = first;
    while (node) {
      var next = node.nextElementSibling;
      card.appendChild(node);
      node = next;
    }
  }

  /* The site's form theme / scripts can repaint input backgrounds and text
     with rules a stylesheet cannot out-rank. Inline !important always wins,
     so the two colours that decide legibility are set here as well. Borders
     stay in the stylesheet so focus rings keep working. */
  function lockFieldColors() {
    var card = document.getElementById('cyp-form-card');
    if (!card) return;
    var fields = card.querySelectorAll(
      'input:not([type="radio"]):not([type="checkbox"]):not([type="hidden"]):not([type="submit"]), select, textarea'
    );
    for (var i = 0; i < fields.length; i++) {
      var s = fields[i].style;
      s.setProperty('background-color', '#f6f0e2', 'important');
      s.setProperty('color', '#1b1610', 'important');
      s.setProperty('-webkit-text-fill-color', '#1b1610', 'important');
    }
  }

  /* "PREGAME: First Friday..." -> <span class="cyp-tag">PREGAME</span>First Friday...
     Only fires on ALL-CAPS words followed by a colon at the very start of a
     paragraph, so ordinary copy is left alone. */
  function tagNotes() {
    var paras = document.querySelectorAll('#formContainer .form-html > p');
    for (var i = 0; i < paras.length; i++) {
      var p = paras[i];
      if (p.querySelector('.cyp-tag')) continue;
      var t = p.firstChild;
      while (t && !(t.nodeType === 3 && t.nodeValue.trim())) {
        if (t.nodeType === 1) { t = null; break; }   /* starts with markup - skip */
        t = t.nextSibling;
      }
      if (!t) continue;
      var m = /^\s*([A-Z][A-Z' ]{2,}?)\s*:\s*/.exec(t.nodeValue);
      if (!m) continue;

      var tag = document.createElement('span');
      tag.className = 'cyp-tag';
      tag.textContent = m[1];
      t.nodeValue = t.nodeValue.slice(m[0].length);
      p.insertBefore(tag, t);
      p.classList.add('cyp-note');
    }
  }

  /* each block fades and rises in as it scrolls into view; blocks that
     arrive together are staggered */
  function initReveal() {
    if (!('IntersectionObserver' in window)) return;
    var targets = [].slice.call(
      document.querySelectorAll('#formContainer .form-html > p, #cyp-form-card')
    );
    if (!targets.length) return;

    var io = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (e) { return e.isIntersecting; });
      batch.sort(function (a, b) {
        return a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top;
      });
      batch.forEach(function (entry, i) {
        entry.target.style.transitionDelay = (Math.min(i, 6) * 110) + 'ms';
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) {
      el.classList.add('cyp-reveal');
      io.observe(el);
    });
  }

  function init() {
    if (!html.classList.contains('cyp-st')) {
      if (!onThisArticle()) return;
      html.classList.add('cyp-st');
    }
    wrapFormCard();
    tagNotes();
    initReveal();
    lockFieldColors();
    window.addEventListener('load', lockFieldColors);

    /* payment / "Other" fields appear later - re-apply when the card changes */
    var card = document.getElementById('cyp-form-card');
    if (card && 'MutationObserver' in window) {
      var mo = new MutationObserver(function () {
        mo.disconnect();
        lockFieldColors();
        mo.observe(card, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
      });
      mo.observe(card, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    }
  }

  /* URL match lets the theme switch on before first paint */
  if (new RegExp('aid[/=]' + AID + '(?!\\d)', 'i').test(location.href)) {
    ensureViewport();
    html.classList.add('cyp-st');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
