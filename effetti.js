// Animazioni delle carte. In suoni.js ogni carta sceglie il suo "effetto".
// Effetti disponibili: spara, schiva, bolle, panico, gira, mitraglia, corsa,
// duello, monete, frecce, sbarre, manette, schizzo, esplosione, rotola
(function () {
  const rnd = (a, b) => a + Math.random() * (b - a);
  let K = 1;   // scala: gli effetti crescono con la carta

  // livello trasparente sopra la carta, dove disegnare gli effetti
  function strato(t, durata, fuori) {
    const r = t.getBoundingClientRect();
    const d = document.createElement("div");
    d.className = "fx" + (fuori ? "" : " fx-dentro");
    Object.assign(d.style, {
      left: r.left + scrollX + "px", top: r.top + scrollY + "px",
      width: r.width + "px", height: r.height + "px",
    });
    document.body.appendChild(d);
    setTimeout(() => d.remove(), durata);
    return { el: d, w: r.width, h: r.height };
  }
  function pezzo(s, html, css) {
    const e = document.createElement("div");
    e.className = "fx-pezzo";
    if (html) e.innerHTML = html;
    Object.assign(e.style, css);
    s.el.appendChild(e);
    return e;
  }
  const muovi = (t, frames, ms, easing = "ease-out") => t.animate(frames, { duration: ms, easing });
  function trema(t, forza, volte, ms) {
    const f = [];
    for (let i = 0; i < volte; i++) f.push({ transform: `translate(${rnd(-forza, forza) * K}px,${rnd(-forza, forza) * K}px) rotate(${rnd(-forza / 3, forza / 3)}deg)` });
    f.push({ transform: "none" });
    muovi(t, f, ms, "linear");
  }
  function lampo(t, colore, ms = 300) {
    const s = strato(t, ms + 50);
    pezzo(s, "", { inset: 0, background: `radial-gradient(circle, ${colore}, transparent 70%)` })
      .animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, easing: "ease-out" });
  }
  function fumo(t, n, da = "alto") {
    const s = strato(t, 1400, true);
    for (let i = 0; i < n; i++) {
      const size = rnd(24, 48) * K;
      const x = da === "basso" ? rnd(0, s.w) : rnd(s.w * .2, s.w * .8);
      const y = da === "basso" ? s.h - 10 : s.h * .3;
      pezzo(s, "", { left: x - size / 2 + "px", top: y - size / 2 + "px", width: size + "px", height: size + "px",
        borderRadius: "50%", background: "radial-gradient(circle, rgba(235,230,220,.9), rgba(200,195,185,0) 70%)" })
        .animate([{ transform: "scale(.4)", opacity: .95 },
                  { transform: `translate(${rnd(-40, 40) * K}px,${rnd(-70, -30) * K}px) scale(${rnd(1.6, 2.4)})`, opacity: 0 }],
                 { duration: rnd(900, 1300), easing: "ease-out", delay: i * 40 });
    }
  }
  function scoppio(t, n, contenuto, dist, ms, gravita = 0) {
    const s = strato(t, ms + 300, true);
    for (let i = 0; i < n; i++) {
      const a = rnd(0, Math.PI * 2), d = rnd(dist * .5, dist) * K;
      const c = typeof contenuto === "function" ? contenuto(i) : contenuto;
      pezzo(s, c.html, Object.assign({ left: s.w / 2 + "px", top: s.h / 2 + "px" }, c.css))
        .animate([{ transform: "translate(-50%,-50%) scale(.3)", opacity: 1 },
                  { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d + gravita}px)) scale(${Math.max(1, K * .75)}) rotate(${rnd(-180, 180)}deg)`, opacity: 0 }],
                 { duration: rnd(ms * .7, ms), easing: "cubic-bezier(.15,.7,.3,1)" });
    }
  }
  const scintilla = () => ({ css: { width: "7px", height: "7px", borderRadius: "50%",
    background: ["#ffe08a", "#ff9d2e", "#ff5a1f"][Math.floor(rnd(0, 3))], boxShadow: "0 0 8px #ffb347" } });

  const EFFETTI = {
    spara(t) {
      lampo(t, "rgba(255,220,130,.85)");
      trema(t, 7, 6, 350);
      fumo(t, 6);
    },
    schiva(t) {
      muovi(t, [{ transform: "none" }, { transform: "translateX(-28%) rotate(-14deg)", offset: .35 },
                { transform: "translateX(8%) rotate(4deg)", offset: .75 }, { transform: "none" }], 650);
      const s = strato(t, 600, true);   // il proiettile che passa
      pezzo(s, "", { top: "30%", left: "-20%", width: "40%", height: "3px", borderRadius: "3px",
        background: "linear-gradient(90deg, transparent, #fff3c4, #ffb347)", boxShadow: "0 0 6px #ffb347" })
        .animate([{ transform: "translateX(0)" }, { transform: `translateX(${s.w * 1.6}px)` }], { duration: 300, delay: 60 });
    },
    bolle(t) {
      const s = strato(t, 1800);
      for (let i = 0; i < 16; i++) {
        const size = rnd(6, 16) * K;
        pezzo(s, "", { left: rnd(10, 90) + "%", bottom: "-10px", width: size + "px", height: size + "px", borderRadius: "50%",
          border: "2px solid rgba(255,255,255,.9)", background: "rgba(255,225,140,.45)" })
          .animate([{ transform: "translateY(0)", opacity: 0 }, { opacity: 1, offset: .15 },
                    { transform: `translate(${rnd(-15, 15)}px, -${s.h * rnd(.6, 1)}px)`, opacity: 0 }],
                   { duration: rnd(900, 1500), delay: rnd(0, 400), easing: "ease-in" });
      }
      muovi(t, [{ transform: "none" }, { transform: "rotate(-4deg) scale(1.05)" }, { transform: "rotate(3deg) scale(1.05)" }, { transform: "none" }], 700, "ease-in-out");
    },
    panico(t) {
      trema(t, 4, 18, 800);
      lampo(t, "rgba(220,40,30,.45)", 800);
      scoppio(t, 5, { html: "!", css: { font: "bold 26px Rye, Georgia, serif", color: "#b3261e", textShadow: "0 0 3px #fff" } }, 70, 800);
    },
    gira(t) {
      muovi(t, [{ transform: "perspective(600px) rotateY(0)" }, { transform: "perspective(600px) rotateY(360deg) scale(1.08)", offset: .8 },
                { transform: "perspective(600px) rotateY(360deg)" }], 800, "ease-in-out");
      scoppio(t, 10, { html: "✦", css: { color: "#fff3c4", fontSize: "16px", textShadow: "0 0 6px #e0a93b" } }, 80, 900);
    },
    mitraglia(t) {
      trema(t, 6, 16, 700);
      const s = strato(t, 1400);
      for (let i = 0; i < 6; i++) {
        pezzo(s, "", { left: rnd(15, 75) + "%", top: rnd(15, 75) + "%", width: 16 * K + "px", height: 16 * K + "px", borderRadius: "50%",
          background: "radial-gradient(circle, #111 30%, #4a3a2a 45%, rgba(255,255,255,.7) 55%, transparent 70%)" })
          .animate([{ opacity: 0, transform: "scale(2)" }, { opacity: 1, transform: "scale(1)", offset: .08 }, { opacity: 1, offset: .75 }, { opacity: 0 }],
                   { duration: 1300, delay: i * 100 });
      }
      for (let i = 0; i < 6; i++) setTimeout(() => lampo(t, "rgba(255,210,120,.6)", 120), i * 100);
    },
    corsa(t) {
      muovi(t, [{ transform: "none" }, { transform: "translateX(130%) rotate(6deg)", opacity: 0, offset: .4 },
                { transform: "translateX(-130%) rotate(-6deg)", opacity: 0, offset: .41 }, { transform: "none", opacity: 1 }], 1100, "ease-in-out");
      fumo(t, 8, "basso");
    },
    duello(t) {
      muovi(t, [{ transform: "none" }, { transform: "scale(1.1)", offset: .6 }, { transform: "none" }], 1100, "ease-in-out");
      const s = strato(t, 1200);
      pezzo(s, `<svg viewBox="0 0 100 100" width="100%" height="100%"><g fill="none" stroke="#b3261e" stroke-width="3">
        <circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="4" fill="#b3261e"/>
        <line x1="50" y1="5" x2="50" y2="35"/><line x1="50" y1="65" x2="50" y2="95"/>
        <line x1="5" y1="50" x2="35" y2="50"/><line x1="65" y1="50" x2="95" y2="50"/></g></svg>`,
        { left: "10%", top: "25%", width: "80%", aspectRatio: "1" })
        .animate([{ transform: "scale(2.5) rotate(90deg)", opacity: 0 }, { transform: "scale(1) rotate(0)", opacity: 1, offset: .45 },
                  { opacity: 1, offset: .8 }, { opacity: 0 }], { duration: 1100, easing: "ease-out" });
    },
    monete(t) {
      muovi(t, [{ transform: "none" }, { transform: "translateY(-8px) scale(1.06)" }, { transform: "none" }], 400);
      scoppio(t, 12, i => i % 3 ? { html: "", css: { width: "16px", height: "16px", borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%, #fff3c4, #e0a93b 55%, #8a5a12)", border: "1px solid #5c3a08" } }
        : { html: "$", css: { font: "bold 22px Rye, Georgia, serif", color: "#3f8f3a", textShadow: "0 0 3px #fff" } }, 110, 1000, 40);
    },
    frecce(t) {
      trema(t, 3, 8, 600);
      const s = strato(t, 1200, true);
      for (let i = 0; i < 4; i++) {
        pezzo(s, `<svg viewBox="0 0 60 12" width="${60 * K}" height="${12 * K}"><line x1="6" y1="6" x2="50" y2="6" stroke="#6b4423" stroke-width="2.5"/>
          <polygon points="60,6 48,1 48,11" fill="#555"/><polygon points="0,1 10,6 0,11 5,6" fill="#b3261e"/></svg>`,
          { left: "0", top: rnd(15, 80) + "%" })
          .animate([{ transform: "translateX(-${80 * K}px)", opacity: 0 }, { opacity: 1, offset: .2 },
                    { transform: `translateX(${s.w + 20}px)`, opacity: 0 }], { duration: 500, delay: i * 140, easing: "ease-in" });
      }
    },
    sbarre(t) {
      const s = strato(t, 1500);
      const g = pezzo(s, "", { inset: 0, background:
        "repeating-linear-gradient(90deg, transparent 0 14%, #3a3a3a 14% 18%, #8a8a8a 18% 19%, transparent 19% 25%)" });
      g.animate([{ transform: "translateY(-100%)" }, { transform: "translateY(0)", offset: .25 }, { transform: "translateY(-2%)", offset: .3 },
                 { transform: "translateY(0)", offset: .35 }, { transform: "translateY(0)", opacity: 1, offset: .8 }, { opacity: 0 }],
                { duration: 1400, easing: "ease-in" });
      setTimeout(() => trema(t, 4, 4, 200), 330);
    },
    manette(t) {
      const s = strato(t, 1700, true);
      const m = pezzo(s, `<svg viewBox="0 0 120 60" width="100%" height="100%">
        <defs><linearGradient id="acciaio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f2f2"/><stop offset=".5" stop-color="#9a9a9a"/><stop offset="1" stop-color="#5a5a5a"/></linearGradient></defs>
        <g fill="none" stroke="url(#acciaio)" stroke-width="7"><circle cx="28" cy="32" r="18"/><circle cx="92" cy="32" r="18"/></g>
        <g fill="none" stroke="#3a3a3a" stroke-width="1.5"><circle cx="28" cy="32" r="22"/><circle cx="92" cy="32" r="22"/></g>
        <g fill="url(#acciaio)" stroke="#3a3a3a" stroke-width="1"><rect x="44" y="27" width="9" height="7" rx="3"/><rect x="55.5" y="27" width="9" height="7" rx="3"/><rect x="67" y="27" width="9" height="7" rx="3"/></g></svg>`,
        { left: "8%", top: "35%", width: "84%", aspectRatio: "2", filter: "drop-shadow(0 4px 4px rgba(0,0,0,.6))" });
      m.animate([{ transform: "translateY(-160%) rotate(-25deg)", opacity: 0 }, { transform: "translateY(0) rotate(4deg)", opacity: 1, offset: .25 },
                 { transform: "translateY(-6%) rotate(-2deg)", offset: .32 }, { transform: "translateY(0) rotate(0)", offset: .4 },
                 { transform: "scale(1)", opacity: 1, offset: .85 }, { opacity: 0 }], { duration: 1600, easing: "ease-in" });
      setTimeout(() => { trema(t, 5, 4, 220); lampo(t, "rgba(255,255,255,.5)", 200); }, 400);
    },
    schizzo(t) {
      muovi(t, [{ transform: "none" }, { transform: "scale(.94) rotate(-2deg)", offset: .15 }, { transform: "none" }], 400);
      const s = strato(t, 2600);
      const x = rnd(35, 65), y = rnd(30, 50);
      const goccia = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
      let gocce = "";
      for (let i = 0; i < 9; i++) { const a = rnd(0, 6.28), d = rnd(34, 46); gocce += goccia(50 + Math.cos(a) * d, 50 + Math.sin(a) * d, rnd(2, 5)); }
      const macchia = pezzo(s, `<svg viewBox="0 0 100 100" width="100%" height="100%" style="overflow:visible">
        <g fill="#fbfaf2" stroke="rgba(180,175,150,.6)" stroke-width=".8">
          <path d="M50 22 C60 18 66 30 74 28 C84 26 82 40 78 46 C86 52 80 62 72 62 C70 72 60 76 54 70 C46 78 36 72 36 64 C26 66 20 56 28 50 C20 42 28 32 36 34 C38 24 44 22 50 22Z"/>
          ${gocce}
        </g>
        <ellipse cx="44" cy="40" rx="8" ry="4" fill="#fff" opacity=".9" transform="rotate(-25 44 40)"/></svg>`,
        { left: x - 35 + "%", top: y - 25 + "%", width: "70%", aspectRatio: "1", filter: "drop-shadow(0 2px 2px rgba(0,0,0,.35))" });
      macchia.animate([{ transform: "scale(.1)", opacity: 1 }, { transform: "scale(1.1)", offset: .08 }, { transform: "scale(1)", offset: .14 },
                       { opacity: 1, offset: .8 }, { opacity: 0 }], { duration: 2500, easing: "ease-out" });
      for (let i = 0; i < 3; i++) {       // colature
        const c = pezzo(s, "", { left: x + rnd(-14, 14) + "%", top: y + 8 + "%", width: rnd(5, 8) + "px", height: "0",
          background: "#fbfaf2", borderRadius: "0 0 6px 6px", boxShadow: "0 1px 2px rgba(0,0,0,.3)" });
        c.animate([{ height: "0px", opacity: 1 }, { height: "0px", offset: .15 }, { height: rnd(30, 70) + "px", opacity: 1, offset: .8 }, { opacity: 0 }],
                  { duration: 2500, easing: "ease-in" });
      }
    },
    esplosione(t) {
      lampo(t, "rgba(255,240,200,1)", 450);
      trema(t, 12, 12, 600);
      scoppio(t, 22, scintilla, 130, 800);
      fumo(t, 10);
    },
    rotola(t) {
      muovi(t, [{ transform: "none" }, { transform: "rotate(-20deg) translateX(-10%)", offset: .3 },
                { transform: "rotate(10deg) translateX(5%)", offset: .65 }, { transform: "none" }], 700, "ease-in-out");
      setTimeout(() => scoppio(t, 8, scintilla, 60, 450), 150);
    },
  };

  // quanto dura ogni animazione (ms)
  const DURATA = { spara: 1300, schiva: 700, bolle: 1800, panico: 900, gira: 900, mitraglia: 1400, corsa: 1400,
    duello: 1200, monete: 1100, frecce: 1100, sbarre: 1500, manette: 1700, schizzo: 2600, esplosione: 1400, rotola: 750 };

  // avvia l'animazione e restituisce quanto dura
  window.animaCarta = function (tasto, nome) {
    if (!EFFETTI[nome]) nome = "spara";
    K = Math.max(1, tasto.getBoundingClientRect().width / 130);
    try { EFFETTI[nome](tasto); } catch (err) { console.warn(err); }
    return DURATA[nome];
  };
})();

// ================================================================
//  SPARA ALLO SCERIFFO: animazione folle a tutto schermo
// ================================================================
(function () {
  const rnd = (a, b) => a + Math.random() * (b - a);
  const stella = `<svg viewBox="0 0 100 100" width="100%" height="100%">
    <defs><radialGradient id="oroS" cx="35%" cy="30%"><stop offset="0" stop-color="#fff3c4"/><stop offset=".5" stop-color="#e0a93b"/><stop offset="1" stop-color="#8a5a12"/></radialGradient></defs>
    <polygon fill="url(#oroS)" stroke="#5c3a08" stroke-width="2" points="50,4 61,30 90,27 70,49 84,76 56,70 50,97 44,70 16,76 30,49 10,27 39,30"/>
    <g fill="url(#oroS)" stroke="#5c3a08" stroke-width="1.5"><circle cx="50" cy="5" r="4"/><circle cx="90" cy="27" r="4"/><circle cx="84" cy="76" r="4"/><circle cx="50" cy="96" r="4"/><circle cx="16" cy="76" r="4"/><circle cx="10" cy="27" r="4"/></g>
    <circle cx="50" cy="50" r="19" fill="none" stroke="#5c3a08" stroke-width="2" opacity=".6"/>
    <text x="50" y="54" text-anchor="middle" font-family="Rye, Georgia, serif" font-size="9" fill="#5c3a08">SHERIFF</text></svg>`;
  const crepa = () => {
    let l = "";
    for (let i = 0; i < 9; i++) { const a = rnd(0, 6.28), r = rnd(25, 48); l += `<line x1="50" y1="50" x2="${50 + Math.cos(a) * r}" y2="${50 + Math.sin(a) * r}"/>`; }
    return `<svg viewBox="0 0 100 100" width="100%" height="100%"><g stroke="rgba(255,255,255,.75)" stroke-width="1">${l}</g>
      <circle cx="50" cy="50" r="9" fill="rgba(255,255,255,.25)"/><circle cx="50" cy="50" r="5" fill="#0b0503"/></svg>`;
  };
  const el = (cls, html, css, padre) => {
    const e = document.createElement("div"); e.className = cls; if (html) e.innerHTML = html;
    Object.assign(e.style, css || {}); padre.appendChild(e); return e;
  };
  const trema = (e, f, n, ms) => {
    const k = []; for (let i = 0; i < n; i++) k.push({ transform: `translate(${rnd(-f, f)}px,${rnd(-f, f)}px) rotate(${rnd(-f / 4, f / 4)}deg)` });
    k.push({ transform: "none" }); e.animate(k, { duration: ms });
  };
  const vibra = p => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };

  window.sparaSceriffo = function () {
    const ov = el("sparatoria", "", {}, document.body);
    const scena = el("scena", "", {}, ov);
    const timers = [];
    const dopo = (ms, f) => timers.push(setTimeout(f, ms));

    ov.animate([{ background: "#fff" }, { background: "#ffd27a", offset: .2 }, { background: "rgba(40,6,2,.92)" }], { duration: 450, fill: "forwards" });
    trema(scena, 30, 10, 450);
    vibra([60, 40, 60]);

    // 1. la stella arriva girando
    const s = el("stella-sceriffo", stella, {}, scena);
    s.animate([{ transform: "scale(.05) rotate(-900deg)", opacity: 0 }, { transform: "scale(1.2) rotate(15deg)", opacity: 1, offset: .75 }, { transform: "scale(1) rotate(0)" }],
      { duration: 600, easing: "cubic-bezier(.2,.8,.3,1)", fill: "forwards" });

    // 2. raffica di colpi sulla stella
    for (let i = 0; i < 7; i++) dopo(650 + i * 140, () => {
      el("buco", crepa(), { left: rnd(22, 68) + "%", top: rnd(22, 68) + "%" }, s)
        .animate([{ transform: "scale(2.5)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 90, fill: "forwards" });
      s.animate([{ transform: "none" }, { transform: `translate(${rnd(-25, 25)}px,${rnd(-25, 25)}px) rotate(${rnd(-25, 25)}deg) scale(.93)` }, { transform: "none" }], { duration: 130 });
      ov.animate([{ background: "#ffe9b0" }, { background: "rgba(40,6,2,.92)" }], { duration: 120, fill: "forwards" });
      trema(scena, 14, 4, 130);
      vibra(35);
    });

    // 3. la stella vola via impazzita, scritta enorme, schermo crepato
    dopo(1700, () => {
      s.animate([{ transform: "none" }, { transform: "translate(-10vw,-8vh) rotate(-200deg) scale(1.1)", offset: .2 },
                 { transform: "translate(30vw,120vh) rotate(1440deg) scale(.4)" }], { duration: 1300, easing: "ease-in", fill: "forwards" });
      for (let i = 0; i < 46; i++) {
        const a = rnd(0, 6.28), d = rnd(25, 60);
        el("scintilla-s", "", { background: ["#ffe08a", "#ff9d2e", "#ff4b1f", "#fff"][i % 4] }, scena)
          .animate([{ transform: "translate(-50%,-50%) scale(1.5)", opacity: 1 },
                    { transform: `translate(calc(-50% + ${Math.cos(a) * d}vmin), calc(-50% + ${Math.sin(a) * d + 15}vmin)) scale(.3)`, opacity: 0 }],
                   { duration: rnd(700, 1300), easing: "cubic-bezier(.1,.8,.3,1)", fill: "forwards" });
      }
      for (let i = 0; i < 3; i++) dopo(i * 160, () => {
        el("crepa-schermo", crepa(), { left: rnd(5, 70) + "%", top: rnd(8, 70) + "%" }, ov)
          .animate([{ transform: "scale(3)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 100, fill: "forwards" });
        trema(scena, 22, 5, 200); vibra(80);
      });
      const t = el("testo-sceriffo", "SCERIFFO<br>COLPITO!", {}, scena);
      t.animate([{ transform: "scale(5) rotate(-25deg)", opacity: 0 }, { transform: "scale(.9) rotate(-4deg)", opacity: 1, offset: .55 },
                 { transform: "scale(1.08) rotate(-8deg)", offset: .8 }, { transform: "scale(1) rotate(-6deg)" }], { duration: 500, easing: "ease-out", fill: "forwards" });
      dopo(520, () => t.animate([{ transform: "scale(1) rotate(-6deg)" }, { transform: "scale(1.1) rotate(-3deg)" }, { transform: "scale(1) rotate(-6deg)" }],
        { duration: 380, iterations: 6, easing: "ease-in-out" }));
    });

    // 4. strobo finale
    for (let i = 0; i < 6; i++) dopo(2300 + i * 160, () =>
      ov.animate([{ background: i % 2 ? "rgba(140,10,5,.95)" : "rgba(10,2,1,.95)" }], { duration: 80, fill: "forwards" }));

    let chiuso = false;
    function chiudi() {
      if (chiuso) return; chiuso = true;
      timers.forEach(clearTimeout);
      ov.style.pointerEvents = "none";
      ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" });
      setTimeout(() => ov.remove(), 420);
    }
    // un'altra raffica: nuova stella crivellata di colpi, crepe e strobo (circa 2 s)
    function ripeti() {
      const s2 = el("stella-sceriffo", stella, {}, scena);
      const testo = scena.querySelector(".testo-sceriffo");
      if (testo) scena.appendChild(testo);          // la scritta resta davanti
      s2.animate([{ transform: "translateY(-120vh) rotate(-720deg) scale(.6)" }, { transform: "rotate(10deg) scale(1.1)", offset: .8 }, { transform: "none" }],
        { duration: 450, easing: "cubic-bezier(.2,.8,.3,1)", fill: "forwards" });
      for (let i = 0; i < 6; i++) dopo(480 + i * 120, () => {
        el("buco", crepa(), { left: rnd(22, 68) + "%", top: rnd(22, 68) + "%" }, s2);
        s2.animate([{ transform: "none" }, { transform: `translate(${rnd(-30, 30)}px,${rnd(-30, 30)}px) rotate(${rnd(-30, 30)}deg) scale(.92)` }, { transform: "none" }], { duration: 110 });
        ov.animate([{ background: i % 2 ? "#ffe9b0" : "rgba(140,10,5,.95)" }, { background: "rgba(40,6,2,.92)" }], { duration: 110, fill: "forwards" });
        trema(scena, 16, 4, 110); vibra(30);
      });
      dopo(1250, () => {
        const dir = Math.random() < .5 ? -1 : 1;
        s2.animate([{ transform: "none" }, { transform: `translate(${dir * 120}vw, ${rnd(-40, 40)}vh) rotate(${dir * 1080}deg) scale(.5)` }], { duration: 650, easing: "ease-in", fill: "forwards" });
        el("crepa-schermo", crepa(), { left: rnd(5, 70) + "%", top: rnd(8, 70) + "%" }, ov);
        trema(scena, 24, 6, 250); vibra(70);
        for (let i = 0; i < 24; i++) {
          const a = rnd(0, 6.28), d = rnd(20, 50);
          el("scintilla-s", "", { background: ["#ffe08a", "#ff9d2e", "#ff4b1f", "#fff"][i % 4] }, scena)
            .animate([{ transform: "translate(-50%,-50%) scale(1.5)", opacity: 1 },
                      { transform: `translate(calc(-50% + ${Math.cos(a) * d}vmin), calc(-50% + ${Math.sin(a) * d}vmin)) scale(.3)`, opacity: 0 }],
                     { duration: rnd(600, 1000), easing: "cubic-bezier(.1,.8,.3,1)", fill: "forwards" });
        }
      });
      dopo(1950, () => { s2.remove(); scena.querySelectorAll(".scintilla-s").forEach(x => x.getAnimations().length || x.remove()); });
      return 2000;
    }
    return { durata: 3800, chiudi, ripeti, chiuso: () => chiuso, overlay: ov };
  };
})();

// ================================================================
//  PEPPE BRESCIA: delirio a tutto schermo
// ================================================================
(function () {
  const rnd = (a, b) => a + Math.random() * (b - a);
  const scegli = a => a[Math.floor(Math.random() * a.length)];
  const el = (cls, html, css, padre) => {
    const e = document.createElement("div"); e.className = cls; if (html) e.innerHTML = html;
    Object.assign(e.style, css || {}); padre.appendChild(e); return e;
  };
  const vibra = p => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
  const SCRITTE = ["CIAO!", "CIAOOO", "PEPPE!", "BRESCIA!", "👋", "OH!", "EHI!", "🍈🍈"];
  const COLORI = ["#ff3d00", "#ffd600", "#00e5ff", "#ff00c8", "#76ff03", "#ffffff"];

  window.peppeBrescia = function (immagine) {
    const ov = el("peppe-show", "", {}, document.body);
    const timers = [];
    const dopo = (ms, f) => timers.push(setTimeout(f, ms));
    const W = innerWidth, H = innerHeight;

    ov.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
    vibra([40, 30, 40, 30, 40]);

    const faccia = s => `<img src="${immagine}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:22%;display:block">`;

    // Peppe gigante al centro
    const big = el("peppe-grande", faccia(), {}, ov);
    const lato = Math.min(W * .7, H * .45);
    Object.assign(big.style, { width: lato + "px", height: lato + "px", left: (W - lato) / 2 + "px", top: (H - lato) / 2 + "px" });

    function pioggia(n) {
      for (let i = 0; i < n; i++) dopo(i * 70, () => {
        const sz = rnd(50, 110);
        el("peppe-mini", faccia(), { width: sz + "px", height: sz + "px", left: rnd(-20, W - 40) + "px", top: -sz + "px" }, ov)
          .animate([{ transform: `translateY(0) rotate(0)` }, { transform: `translateY(${H + sz * 2}px) rotate(${rnd(-900, 900)}deg)` }],
                   { duration: rnd(1100, 1900), easing: "cubic-bezier(.4,0,.8,.6)", fill: "forwards" });
      });
    }
    function scritte(n) {
      for (let i = 0; i < n; i++) dopo(i * 180, () => {
        const t = el("peppe-scritta", scegli(SCRITTE), { left: rnd(5, 70) + "%", top: rnd(8, 85) + "%", color: scegli(COLORI),
          fontSize: rnd(34, 70) + "px" }, ov);
        t.animate([{ transform: `scale(0) rotate(${rnd(-60, 60)}deg)`, opacity: 1 }, { transform: `scale(1.3) rotate(${rnd(-20, 20)}deg)`, offset: .3 },
                   { transform: `scale(1) rotate(${rnd(-15, 15)}deg)`, opacity: 1, offset: .8 }, { transform: "scale(2.5)", opacity: 0 }],
                  { duration: 900, fill: "forwards" });
      });
    }
    function flash() {
      ov.animate([{ filter: "invert(0)" }, { filter: "invert(1) hue-rotate(90deg)" }, { filter: "invert(0)" }], { duration: 160 });
    }
    // mosse di Peppe gigante, una diversa a ogni giro
    const MOSSE = [
      () => big.animate([{ transform: "scale(0) rotate(-1080deg)" }, { transform: "scale(1.3) rotate(20deg)", offset: .7 }, { transform: "scale(1) rotate(0)" }], { duration: 700, easing: "cubic-bezier(.2,.8,.3,1)" }),
      () => big.animate([{ transform: "none" }, { transform: "scale(1.4,.6)" }, { transform: "scale(.7,1.4)" }, { transform: "scale(1.25,.8)" }, { transform: "scale(.9,1.1)" }, { transform: "none" }], { duration: 900, easing: "ease-in-out" }),
      () => big.animate([{ transform: "none" }, { transform: `translate(${-W * .3}px, ${-H * .3}px) rotate(-30deg)` }, { transform: `translate(${W * .3}px, ${-H * .25}px) rotate(30deg)` },
                         { transform: `translate(${W * .28}px, ${H * .3}px) rotate(200deg)` }, { transform: `translate(${-W * .28}px, ${H * .28}px) rotate(330deg)` }, { transform: "rotate(360deg)" }], { duration: 1600, easing: "ease-in-out" }),
      () => big.animate([{ transform: "none" }, { transform: "perspective(500px) rotateY(720deg) scale(1.3)" }, { transform: "perspective(500px) rotateY(1080deg)" }], { duration: 1200, easing: "ease-in-out" }),
      () => big.animate([{ transform: "scale(1)" }, { transform: "scale(2.2)", offset: .2 }, { transform: "scale(.4)", offset: .45 }, { transform: "scale(1.8)", offset: .7 }, { transform: "scale(1)" }], { duration: 1100 }),
      () => { const k = []; for (let i = 0; i < 14; i++) k.push({ transform: `translate(${rnd(-30, 30)}px,${rnd(-30, 30)}px) rotate(${rnd(-25, 25)}deg) scale(${rnd(.85, 1.2)})` }); k.push({ transform: "none" }); big.animate(k, { duration: 900 }); },
    ];
    let mossa = 0;

    function giro(primo) {
      (primo ? MOSSE[0] : MOSSE[1 + (mossa++ % (MOSSE.length - 1))])();
      pioggia(primo ? 14 : 9);
      scritte(primo ? 6 : 5);
      for (let i = 0; i < 4; i++) dopo(250 + i * rnd(250, 450), flash);
      vibra(40);
      return 2000;
    }
    giro(true);

    let chiuso = false;
    function chiudi() {
      if (chiuso) return; chiuso = true;
      timers.forEach(clearTimeout);
      ov.style.pointerEvents = "none";
      ov.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(1.3) rotate(8deg)" }], { duration: 450, fill: "forwards" });
      setTimeout(() => ov.remove(), 470);
    }
    return { durata: 2400, chiudi, ripeti: () => giro(false), chiuso: () => chiuso, overlay: ov };
  };
})();
