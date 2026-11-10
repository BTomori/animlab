/* ───────────── complex numbers (phasors) ───────────── */
class Cx {
  constructor(re, im) { this.re = +re || 0; this.im = +im || 0; }
  static of(b) { return b instanceof Cx ? b : new Cx(+b, 0); }
  add(b) { b = Cx.of(b); return new Cx(this.re + b.re, this.im + b.im); }
  sub(b) { b = Cx.of(b); return new Cx(this.re - b.re, this.im - b.im); }
  mul(b) { b = Cx.of(b); return new Cx(this.re * b.re - this.im * b.im, this.re * b.im + this.im * b.re); }
  div(b) {
    b = Cx.of(b); const d = b.re * b.re + b.im * b.im || 1e-300;
    return new Cx((this.re * b.re + this.im * b.im) / d, (this.im * b.re - this.re * b.im) / d);
  }
  scale(k) { return new Cx(this.re * k, this.im * k); }
  conj() { return new Cx(this.re, -this.im); }
  abs() { return Math.hypot(this.re, this.im); }
  arg() { return Math.atan2(this.im, this.re); }
  rot(a) { return this.mul(new Cx(Math.cos(a), Math.sin(a))); }
  toString() { return `${fmt(this.re)} ${this.im < 0 ? '−' : '+'} j${fmt(Math.abs(this.im))}`; }
}

