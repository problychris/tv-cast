/* TV-Cast Bookmarklet (lesbare Quelle)
 * Sucht auf der aktuellen Seite nach Video-Links (mp4/m3u8/mpd/webm) und öffnet die Cast-Seite damit.
 * __CAST__ wird von der Cast-Seite automatisch durch ihre eigene Adresse ersetzt
 * (Abschnitt "Bookmarklet einrichten" auf der Cast-Seite). Nicht von Hand bearbeiten.
 */
(function () {
  var CAST = '__CAST__';
  var ID = '__tvcast_box';
  var old = document.getElementById(ID);
  if (old) old.remove();

  var found = [];
  var seen = {};
  var frames = [];
  var VID = /\.(m3u8|mpd|mp4|m4v|webm|mov|mkv)(\?|#|$)/i;
  var SEG = /\.(ts|m4s|aac|vtt|jpg|png|js|css)(\?|#|$)/i;

  function clean(s) {
    return String(s).replace(/\\\//g, '/').replace(/\\u0026/gi, '&').replace(/&amp;/g, '&');
  }
  function add(u, quelle, prio) {
    if (!u) return;
    try { u = new URL(clean(u), location.href).href; } catch (e) { return; }
    if (!/^https?:/i.test(u) || seen[u]) return;
    seen[u] = 1;
    found.push({ u: u, q: quelle, p: prio });
  }

  /* 1) <video>/<audio>/<source> inkl. gleich-originiger iframes */
  function scan(doc, tiefe) {
    if (!doc || tiefe > 3) return;
    try {
      doc.querySelectorAll('video,audio,source').forEach(function (v) {
        [v.currentSrc, v.src, v.getAttribute('src'), v.getAttribute('data-src')].forEach(function (s) {
          if (s && !/^(blob|data|mediastream):/i.test(s)) add(s, 'Video-Element', 1);
        });
      });
      doc.querySelectorAll('iframe').forEach(function (f) {
        var d = null;
        try { d = f.contentDocument; } catch (e) {}
        if (d) scan(d, tiefe + 1);
        else if (f.src && /^https?:/i.test(f.src)) frames.push(f.src);
      });
    } catch (e) {}
  }
  scan(document, 0);

  /* 2) Netzwerk-Anfragen der Seite (findet Streams hinter blob:-Playern) */
  try {
    performance.getEntriesByType('resource').forEach(function (r) {
      var n = r.name;
      if (SEG.test(n)) return;
      if (/\.m3u8|\.mpd|\/manifest|master\.json/i.test(n)) add(n, 'Netzwerk (Stream)', 2);
      else if (VID.test(n)) add(n, 'Netzwerk (Datei)', 3);
    });
  } catch (e) {}

  /* 3) Links im Seitenquelltext */
  try {
    var h = document.documentElement.innerHTML;
    var m = h.match(/https?:(?:\\?\/){2}[^"'\s<>()]+?\.(?:m3u8|mpd|mp4|m4v|webm)(?:[?#][^"'\s<>()]*)?/gi) || [];
    m.forEach(function (s) { add(s, 'Quelltext', 4); });
  } catch (e) {}

  found.sort(function (a, b) { return a.p - b.p; });

  function ziel(u) {
    return CAST + '?url=' + encodeURIComponent(u) + '&title=' + encodeURIComponent(document.title || location.hostname);
  }
  function oeffne(u) {
    var w = null;
    try { w = window.open(ziel(u), '_blank'); } catch (e) {}
    if (!w) location.href = ziel(u);
  }

  if (found.length === 1 && !frames.length) { oeffne(found[0].u); return; }

  /* Auswahl-Fenster */
  var box = document.createElement('div');
  box.id = ID;
  box.setAttribute('style', 'position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.75);display:flex;align-items:flex-end;justify-content:center;font:16px/1.35 system-ui,sans-serif');
  var p = document.createElement('div');
  p.setAttribute('style', 'background:#14161c;color:#eef0f4;width:100%;max-width:640px;max-height:80vh;overflow:auto;border-radius:16px 16px 0 0;padding:16px 16px 24px;box-sizing:border-box');
  box.appendChild(p);

  function zeile(text, klein, farbe, fn) {
    var b = document.createElement('button');
    b.setAttribute('style', 'display:block;width:100%;text-align:left;margin:8px 0 0;padding:12px 14px;border:0;border-radius:10px;background:' + farbe + ';color:#fff;font:inherit;cursor:pointer;word-break:break-all');
    b.innerHTML = '<b style="display:block;margin-bottom:2px"></b><small style="opacity:.75"></small>';
    b.firstChild.textContent = text;
    b.lastChild.textContent = klein;
    b.onclick = function (e) { e.stopPropagation(); box.remove(); fn(); };
    p.appendChild(b);
  }

  var t = document.createElement('div');
  t.setAttribute('style', 'font-weight:700;font-size:18px');
  t.textContent = found.length ? 'TV-Cast: Video wählen' : 'TV-Cast: kein Video-Link gefunden';
  p.appendChild(t);
  var hint = document.createElement('div');
  hint.setAttribute('style', 'opacity:.75;font-size:14px;margin-top:4px');
  hint.textContent = found.length
    ? 'Meist ist der oberste Eintrag richtig. .m3u8 = Stream, .mp4 = Datei.'
    : 'Video kurz abspielen und Bookmarklet nochmal starten. Liegt der Player in einem fremden Rahmen, unten die Player-Seite öffnen und dort erneut starten.';
  p.appendChild(hint);

  found.slice(0, 10).forEach(function (f) {
    var name = f.u.split(/[?#]/)[0].split('/').pop() || f.u;
    zeile(name, f.q + ' · ' + f.u.slice(0, 140), '#2b6cff', function () { oeffne(f.u); });
  });
  frames.slice(0, 5).forEach(function (s) {
    zeile('Player-Seite öffnen', s.slice(0, 140), '#3a3f4b', function () { location.href = s; });
  });
  zeile('Schliessen', '', '#5a2a2a', function () {});
  box.onclick = function () { box.remove(); };
  p.onclick = function (e) { e.stopPropagation(); };
  document.body.appendChild(box);
})();
