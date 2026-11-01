/* Beverly Index encrypted gate.
   Each protected app is published only as an encrypted payload (<name>.enc.json).
   An access code derives a key (PBKDF2, SHA-256) that unwraps the app's content key;
   the content key decrypts the app (AES-256-GCM). Without a valid code nothing is readable. */
(function () {
  var te = new TextEncoder(), td = new TextDecoder();
  function b64(s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  function norm(code) { return String(code || '').trim().toUpperCase(); }
  var cache = {};
  function payload(url) {
    if (!cache[url]) cache[url] = fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('payload'); return r.json();
    });
    return cache[url];
  }
  async function unwrap(p, code) {
    var pass = await crypto.subtle.importKey('raw', te.encode(norm(code)), 'PBKDF2', false, ['deriveKey']);
    for (var i = 0; i < p.entries.length; i++) {
      var e = p.entries[i];
      var kek = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(e.salt), iterations: p.iter, hash: 'SHA-256' },
        pass, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
      try {
        var raw = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(e.iv) }, kek, b64(e.wk));
        return { who: e.who, key: new Uint8Array(raw) };
      } catch (x) { /* not this entry */ }
    }
    return null;
  }
  async function decrypt(p, keyBytes) {
    var key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['decrypt']);
    var buf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(p.iv) }, key, b64(p.ct));
    var stream = new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'));
    return td.decode(await new Response(stream).arrayBuffer());
  }
  function render(html) { document.open(); document.write(html); document.close(); }

  window.BIGate = {
    /* Check a code. Resolves { who } on success, null on failure. */
    check: async function (url, code) {
      if (!(window.crypto && crypto.subtle)) throw new Error('secure');
      var r = await unwrap(await payload(url), code);
      return r ? { who: r.who } : null;
    },
    /* Decrypt with a code and replace the current page with the app. Resolves false on a bad code. */
    open: async function (url, code) {
      var p = await payload(url);
      var r = await unwrap(p, code);
      if (!r) return false;
      render(await decrypt(p, r.key));
      return true;
    }
  };
})();
