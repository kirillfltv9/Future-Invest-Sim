let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function resume() {
  const ctx = getCtx();
  if (ctx.state === "suspended") ctx.resume();
}

function playTone(
  frequency: number,
  type: OscillatorType,
  gain: number,
  duration: number,
  startTime?: number
) {
  const ctx = getCtx();
  const t = startTime ?? ctx.currentTime;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, t);

  gainNode.gain.setValueAtTime(0, t);
  gainNode.gain.linearRampToValueAtTime(gain, t + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, t + duration);

  osc.start(t);
  osc.stop(t + duration + 0.05);
}

/** Stock market opening bell — played when advancing a day */
export function playMarketBell() {
  resume();
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Bell fundamental
  playTone(880, "sine", 0.18, 1.2, now);
  playTone(1320, "sine", 0.10, 0.9, now + 0.02);
  playTone(1760, "sine", 0.06, 0.7, now + 0.04);

  // Short echo
  playTone(880, "sine", 0.06, 0.8, now + 0.18);
  playTone(1320, "sine", 0.03, 0.6, now + 0.20);
}

/** Crypto tick — higher pitch, futuristic */
export function playCryptoTick() {
  resume();
  const ctx = getCtx();
  const now = ctx.currentTime;

  playTone(1200, "sine", 0.12, 0.25, now);
  playTone(1600, "sine", 0.08, 0.18, now + 0.05);
  playTone(2000, "sine", 0.04, 0.12, now + 0.10);
}

/** Played when portfolio ends a day with a net gain */
export function playGainChime() {
  resume();
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Upward arpeggio C-E-G-C
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    playTone(freq, "sine", 0.12 - i * 0.02, 0.35, now + i * 0.09);
  });
}

/** Played when portfolio ends a day with a net loss */
export function playLossSound() {
  resume();
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Downward minor arpeggio
  const notes = [523.25, 466.16, 415.3, 369.99];
  notes.forEach((freq, i) => {
    playTone(freq, "sine", 0.12 - i * 0.02, 0.35, now + i * 0.09);
  });
}

/** Soft confirmation tick for buy/sell trade execution */
export function playTradeTick() {
  resume();
  const ctx = getCtx();
  const now = ctx.currentTime;

  playTone(660, "sine", 0.10, 0.12, now);
  playTone(880, "sine", 0.08, 0.10, now + 0.07);
}

/** Fast-forward whoosh — played when skipping multiple days */
export function playFastForwardSound() {
  resume();
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(1800, now + 0.4);

  gainNode.gain.setValueAtTime(0.12, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

  osc.start(now);
  osc.stop(now + 0.5);
}
