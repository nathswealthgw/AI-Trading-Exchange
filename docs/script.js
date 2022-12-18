const points = Array.from({ length: 42 }, (_, i) => 62320 + Math.sin(i / 5.8) * 95 + (Math.random() - 0.5) * 28);

const bidsEl = document.getElementById('bids');
const asksEl = document.getElementById('asks');
const tradesEl = document.getElementById('trades');
const signalCard = document.getElementById('signal-card');
const signalLog = document.getElementById('signal-log');
const lastPriceEl = document.getElementById('last-price');
const changeEl = document.getElementById('price-change');
const latencyEl = document.getElementById('latency');
const signalAction = document.getElementById('signal-action');
const signalConfidence = document.getElementById('signal-confidence');
const signalForecast = document.getElementById('signal-forecast');
const chart = document.getElementById('chart');
const themeBtn = document.getElementById('toggle-theme');
const portfolioGrid = document.getElementById('portfolio-grid');

const menuLinks = Array.from(document.querySelectorAll('.menu-link'));
const actions = ['BUY', 'SELL', 'HOLD'];
const holdings = [
  { symbol: 'BTC Wallet', amount: 0.842, price: 62380 },
  { symbol: 'ETH Wallet', amount: 11.2, price: 2867 },
  { symbol: 'SOL Wallet', amount: 78.3, price: 156 }
];

let tick = 0;
let basePrice = points[points.length - 1];

const fmt = (v) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function drawChart() {
  const min = Math.min(...points) - 40;
  const max = Math.max(...points) + 40;
  const scaleX = 600 / (points.length - 1);
  const scaleY = 180 / (max - min);

  const pathData = points
    .map((price, index) => {
      const x = index * scaleX;
      const y = 200 - (price - min) * scaleY;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');

  chart.innerHTML = `
    <defs>
      <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#facc15" />
        <stop offset="100%" stop-color="#ffd54f" />
      </linearGradient>
      <linearGradient id="fillGradient" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="rgba(250,204,21,0.35)" />
        <stop offset="100%" stop-color="rgba(250,204,21,0)" />
      </linearGradient>
    </defs>
    <path d="${pathData} L 600 220 L 0 220 Z" fill="url(#fillGradient)"></path>
    <path d="${pathData}" fill="none" stroke="url(#lineGradient)" stroke-width="3.4" stroke-linecap="round"></path>
  `;
}

function renderBook() {
  const bids = Array.from({ length: 2 }, (_, i) => {
    const price = basePrice - i * (1.2 + Math.random() * 1.1);
    const size = 3.8 + Math.random() * 2.3;
    return `<li><span class="price-up">${price.toFixed(1)}</span><span>${size.toFixed(1)}</span></li>`;
  }).join('');

  const asks = Array.from({ length: 2 }, (_, i) => {
    const price = basePrice + i * (1.2 + Math.random() * 1.1) + 0.4;
    const size = 3.8 + Math.random() * 2.3;
    return `<li><span class="price-down">${price.toFixed(1)}</span><span>${size.toFixed(1)}</span></li>`;
  }).join('');

  bidsEl.innerHTML = bids;
  asksEl.innerHTML = asks;
}

function renderPortfolio() {
  holdings.forEach((item, idx) => {
    const variance = 1 + (Math.random() - 0.5) * (idx === 0 ? 0.0035 : 0.008);
    item.price = Math.max(1, item.price * variance);
  });

  portfolioGrid.innerHTML = holdings
    .map((h) => `<div class="holding-card"><p class="holding-symbol">${h.symbol}</p><p class="holding-value">${fmt(h.amount * h.price)}</p></div>`)
    .join('');
}

function updateSignal() {
  const action = actions[Math.floor(Math.random() * actions.length)];
  const confidence = 84 + Math.random() * 14;
  const forecast = basePrice + (Math.random() - 0.5) * 120;

  signalCard.className = `signal-card ${action.toLowerCase()} pulse`;
  signalAction.textContent = action;
  signalConfidence.textContent = `Confidence ${confidence.toFixed(1)}%`;
  signalForecast.textContent = `Forecast ${fmt(forecast)}`;
  setTimeout(() => signalCard.classList.remove('pulse'), 220);

  const row = document.createElement('li');
  row.innerHTML = `<span>${new Date().toLocaleTimeString()}</span><span>${action} (${confidence.toFixed(1)}%)</span>`;
  signalLog.prepend(row);
  while (signalLog.children.length > 2) signalLog.removeChild(signalLog.lastElementChild);
}

function appendTrade() {
  const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
  const qty = (0.45 + Math.random() * 0.7).toFixed(3);
  const li = document.createElement('li');
  li.innerHTML = `<span class="${side === 'BUY' ? 'price-up' : 'price-down'}">${side}</span><span>${qty} BTC @ ${fmt(basePrice)}</span>`;
  tradesEl.prepend(li);
  while (tradesEl.children.length > 3) tradesEl.removeChild(tradesEl.lastElementChild);
}

function tickMarket() {
  tick += 1;
  const drift = (Math.random() - 0.5) * 24;
  basePrice = Math.max(62000, basePrice + drift);
  points.push(basePrice);
  if (points.length > 42) points.shift();

  drawChart();
  renderBook();
  renderPortfolio();
  appendTrade();

  const baseline = points[0];
  const changePct = ((basePrice - baseline) / baseline) * 100;
  lastPriceEl.textContent = fmt(basePrice);
  changeEl.textContent = `${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%`;
  changeEl.className = changePct >= 0 ? 'price-up' : 'price-down';
  latencyEl.textContent = `${Math.round(38 + Math.random() * 22)}ms`;

  if (tick % 2 === 0) updateSignal();
}

function setActiveLink(sectionId) {
  menuLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.target === sectionId);
  });
}

menuLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const id = link.dataset.target;
    const section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveLink(id);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      .slice(0, 1)
      .forEach((entry) => setActiveLink(entry.target.id));
  },
  { threshold: [0.35, 0.6], rootMargin: '-8% 0px -40% 0px' }
);

document.querySelectorAll('.section').forEach((section) => observer.observe(section));
themeBtn.addEventListener('click', () => document.body.classList.toggle('light'));

drawChart();
renderBook();
renderPortfolio();
updateSignal();
appendTrade();
setInterval(tickMarket, 1200);
