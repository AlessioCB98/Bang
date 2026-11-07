import { cards } from './cards.js';

const grid = document.querySelector('#pads');
const status = document.querySelector('#status');
const playing = new Map();
let stopSequence = 0;
const AudioEngine = window.AudioContext || window.webkitAudioContext;
const context = AudioEngine ? new AudioEngine() : null;
const mix = context?.createDynamicsCompressor();
if (mix) {
  mix.threshold.value = -12;
  mix.connect(context.destination);
}

function makePad(card, index) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'pad';
  button.disabled = true;
  if (card) {
    const icon = new Image();
    icon.src = card.icon;
    icon.alt = '';
    button.append(icon, card.name);
  } else {
    const mark = document.createElement('span');
    mark.className = 'empty-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = '+';
    button.classList.add('empty');
    button.setAttribute('aria-label', `Posto libero ${index + 1}`);
    button.append(mark, 'Libero');
  }
  grid.append(button);
  return button;
}

function stopAll() {
  stopSequence += 1;
  for (const [source, button] of playing) {
    source.stop();
    delete button.dataset.playing;
  }
  playing.clear();
}

document.querySelector('#stop').addEventListener('click', stopAll);

async function play(buffer, button) {
  const sequence = stopSequence;
  try {
    if (context.state !== 'running') await context.resume();
    if (sequence !== stopSequence) return;
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(mix);
    playing.set(source, button);
    source.addEventListener('ended', () => {
      source.disconnect();
      playing.delete(source);
      if (![...playing.values()].includes(button)) delete button.dataset.playing;
    }, { once: true });
    source.start();
    button.dataset.playing = '';
  } catch {
    status.textContent = 'Audio non disponibile. Riprova.';
  }
}

const pads = cards.map(makePad);
if (context) {
  const loaded = await Promise.all(cards.map(async (card, index) => {
    if (!card) return null;
    try {
      const response = await fetch(card.audio);
      if (!response.ok) throw new Error(card.audio);
      const buffer = await context.decodeAudioData(await response.arrayBuffer());
      pads[index].addEventListener('click', () => play(buffer, pads[index]));
      pads[index].disabled = false;
      return true;
    } catch {
      pads[index].append(' · audio assente');
      return false;
    }
  }));
  status.textContent = loaded.includes(false) ? 'Alcuni suoni non disponibili' : 'Pronto · tocca una carta';
} else {
  status.textContent = 'Audio non supportato';
}

const offline = document.querySelector('#offline');
if ('serviceWorker' in navigator && window.isSecureContext) {
  try {
    const registration = await navigator.serviceWorker.register('./sw.js');
    const worker = registration.installing || registration.waiting || registration.active;
    function updateOffline() {
      if (worker.state === 'activated') offline.textContent = 'Disponibile offline';
      if (worker.state === 'redundant') offline.textContent = 'Offline non disponibile';
    }
    worker.addEventListener('statechange', updateOffline);
    updateOffline();
  } catch {
    offline.textContent = 'Offline non disponibile';
  }
} else {
  offline.textContent = 'Offline non disponibile in questa anteprima';
}
