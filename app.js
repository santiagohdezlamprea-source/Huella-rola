// Factores de emision aproximados (kg CO2e). Fuentes y supuestos en el README.
const F = {
  kwh: 0.13,          // red electrica de Colombia (mucha hidro, por eso es bajo)
  gasM3: 1.98,        // gas natural
  km: { tm: 0.04, car: 0.19, moto: 0.07, app: 0.19, bike: 0 },
  diet: { lots: 2500, normal: 1900, little: 1500, veg: 1200 }, // kg al año
  natFlight: 110,     // ida y vuelta nacional, por persona
  intFlight: 750,     // ida y vuelta internacional (aprox. Bogota-Miami)
};

const CATS = [
  { key: "home",   name: "Casa",        color: "#2a78d6" },
  { key: "move",   name: "Transporte",  color: "#eb6834" },
  { key: "food",   name: "Comida",      color: "#1baf7a" },
  { key: "travel", name: "Vuelos",      color: "#eda100" },
];

const TIPS = {
  home: "Lo que más te pesa es la casa. Desconectar el calentador o la ducha eléctrica cuando no se usan y cambiar a bombillos LED baja harto el recibo y la huella.",
  move: "Lo que más te pesa es el transporte. Si puedes hacer aunque sea 2 días en bici o en TM en vez de carro, se nota mucho. Bogotá tiene más de 600 km de ciclorrutas.",
  food: "Lo que más te pesa es la comida. No hay que volverse vegetariano: con cambiar la carne de res por pollo, huevo o frijoles unos días a la semana ya baja bastante.",
  travel: "Lo que más te pesa son los vuelos. Un solo viaje internacional puede pesar más que un año entero de TransMilenio. Para trayectos cortos, el bus también es opción.",
};

const form = document.getElementById("quiz");
const steps = [...document.querySelectorAll(".step")];
const progressItems = [...document.querySelectorAll("#progress li")];
const backBtn = document.getElementById("back");
const nextBtn = document.getElementById("next");
let current = 0;

function showStep(i) {
  steps.forEach((s, idx) => (s.hidden = idx !== i));
  progressItems.forEach((li, idx) => {
    li.classList.toggle("current", idx === i);
    li.classList.toggle("done", idx < i);
  });
  backBtn.hidden = i === 0;
  nextBtn.textContent = i === steps.length - 1 ? "Ver mi huella" : "Siguiente →";
}

// numero seguro: si el campo esta vacio o negativo devuelve 0
function num(name, min = 0) {
  const v = parseFloat(form.elements[name].value);
  return isNaN(v) ? min : Math.max(v, min);
}

function calculate() {
  const people = num("people", 1);
  const mode = form.elements.mode.value;
  const diet = form.elements.diet.value;
  const kmYear = num("km") * num("days") * 48; // ~48 semanas, quitando vacaciones

  return {
    home: (num("kwh") * F.kwh + num("gas") * F.gasM3) * 12 / people,
    move: kmYear * F.km[mode],
    food: F.diet[diet],
    travel: num("natFlights") * F.natFlight + num("intFlights") * F.intFlight,
  };
}

const fmt = (kg) => (kg / 1000).toLocaleString("es-CO", { maximumFractionDigits: 1, minimumFractionDigits: 1 });

function showResult() {
  const r = calculate();
  const total = Object.values(r).reduce((a, b) => a + b, 0);

  document.getElementById("total").textContent = fmt(total);

  let verdict;
  if (total < 2000) verdict = "Estás por debajo de las 2 t, la meta por persona para 2050. Muy bien.";
  else if (total < 4000) verdict = "Estás en un punto medio. Hay un par de cosas fáciles de mejorar.";
  else verdict = "Estás alto. Mira abajo qué es lo que más te pesa.";
  document.getElementById("verdict").textContent = verdict;

  // barra apilada: cada segmento es una categoria
  const stack = document.getElementById("stack");
  stack.innerHTML = CATS
    .filter((c) => r[c.key] > 0)
    .map((c) => `<div class="seg" style="flex:${r[c.key]};background:${c.color}" title="${c.name}: ${fmt(r[c.key])} t"></div>`)
    .join("");
  stack.setAttribute("aria-label", CATS.map((c) => `${c.name} ${fmt(r[c.key])} toneladas`).join(", "));

  document.getElementById("legend").innerHTML = CATS.map((c) => `
    <li>
      <span class="sw" style="background:${c.color}"></span>
      <span>${c.name}</span>
      <b>${fmt(r[c.key])} t</b>
      <span class="pct">${total ? Math.round((r[c.key] / total) * 100) : 0}%</span>
    </li>`).join("");

  // comparacion con referencias (todas aproximadas)
  const refs = [
    { label: "Tú", t: total / 1000, me: true },
    { label: "Meta 2050 por persona", t: 2 },
    { label: "Promedio mundial", t: 4.7 },
  ];
  const max = Math.max(...refs.map((x) => x.t));
  document.getElementById("compare").innerHTML = refs.map((x) => `
    <div class="cmp ${x.me ? "cmp--me" : ""}">
      <span class="cmp-label">${x.label}</span>
      <div class="cmp-track"><div class="cmp-bar" style="width:${(x.t / max) * 100}%"></div></div>
      <span class="cmp-val">${x.t.toLocaleString("es-CO", { maximumFractionDigits: 1 })} t</span>
    </div>`).join("");

  const biggest = CATS.reduce((a, b) => (r[a.key] >= r[b.key] ? a : b));
  document.getElementById("tip").innerHTML = `<b>💡 Tip para ti:</b> ${TIPS[biggest.key]}`;

  form.hidden = true;
  document.getElementById("progress").hidden = true;
  document.getElementById("result").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });

  // lo guardo para el boton de copiar
  window.lastResult = { total, biggest: biggest.name };
}

nextBtn.addEventListener("click", () => {
  if (current < steps.length - 1) {
    current++;
    showStep(current);
  } else {
    showResult();
  }
});

backBtn.addEventListener("click", () => {
  current--;
  showStep(current);
});

// enter en un input no debe mandar el form, sino pasar al siguiente paso
form.addEventListener("submit", (e) => {
  e.preventDefault();
  nextBtn.click();
});

const daysRange = document.getElementById("daysRange");
daysRange.addEventListener("input", () => {
  const d = daysRange.value;
  document.getElementById("daysOut").textContent = d === "1" ? "1 día" : `${d} días`;
});

document.getElementById("restart").addEventListener("click", () => {
  current = 0;
  showStep(0);
  form.hidden = false;
  document.getElementById("progress").hidden = false;
  document.getElementById("result").hidden = true;
  document.getElementById("copied").hidden = true;
});

document.getElementById("share").addEventListener("click", async () => {
  const { total, biggest } = window.lastResult;
  const text = `Mi huella de carbono es de ${fmt(total)} t de CO₂ al año. Lo que más me pesa: ${biggest}. Calcula la tuya: ${location.href}`;
  try {
    await navigator.clipboard.writeText(text);
    document.getElementById("copied").hidden = false;
  } catch (e) {
    prompt("Copia este texto:", text); // por si el navegador no deja usar el portapapeles
  }
});

showStep(0);
