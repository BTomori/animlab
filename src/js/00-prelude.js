const SRC = document.documentElement.outerHTML;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const store = {
  get(k) { try { return localStorage.getItem('animlab.' + k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem('animlab.' + k, v); return true; } catch (e) { return false; } },
};

