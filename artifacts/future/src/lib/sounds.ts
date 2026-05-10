let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientOsc: { stop: () => void } | null = null;
let muted = false;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 1.0;
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
}

function getMaster(): GainNode {
  getCtx();
  return masterGain!;
}

function resume() {
  const ctx = getCtx();
  if (ctx.state === "suspended") ctx.resume();
}

export function setMuted(value: boolean): void {
  muted = value;
  const m = getMaster();
  m.gain.cancelScheduledValues(getCtx().currentTime);
  m.gain.setTargetAtTime(value ? 0 : 1, getCtx().currentTime, 0.05);
}

export function isMuted(): boolean {
  return muted;
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
  gainNode.connect(getMaster());
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
  const now = getCtx().currentTime;
  playTone(880, "sine", 0.18, 1.2, now);
  playTone(1320, "sine", 0.10, 0.9, now + 0.02);
  playTone(1760, "sine", 0.06, 0.7, now + 0.04);
  playTone(880, "sine", 0.06, 0.8, now + 0.18);
  playTone(1320, "sine", 0.03, 0.6, now + 0.20);
}

export function playCryptoTick() {
  resume();
  const now = getCtx().currentTime;
  playTone(1200, "sine", 0.12, 0.25, now);
  playTone(1600, "sine", 0.08, 0.18, now + 0.05);
  playTone(2000, "sine", 0.04, 0.12, now + 0.10);
}

export function playGainChime() {
  resume();
  const now = getCtx().currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => playTone(freq, "sine", 0.12 - i * 0.02, 0.35, now + i * 0.09));
}

export function playLossSound() {
  resume();
  const now = getCtx().currentTime;
  const notes = [523.25, 466.16, 415.3, 369.99];
  notes.forEach((freq, i) => playTone(freq, "sine", 0.12 - i * 0.02, 0.35, now + i * 0.09));
}

export function playTradeTick() {
  resume();
  const now = getCtx().currentTime;
  playTone(660, "sine", 0.10, 0.12, now);
  playTone(880, "sine", 0.08, 0.10, now + 0.07);
}

/** Cash register clink — played on completed trades */
export function playCashClink() {
  resume();
  const ctx = getCtx();
  const now = ctx.currentTime;
  // Two bright bell-like clinks
  playTone(1800, "triangle", 0.10, 0.15, now);
  playTone(2400, "triangle", 0.08, 0.13, now + 0.04);
  playTone(1500, "triangle", 0.05, 0.18, now + 0.10);
  // Coin shimmer noise via oscillator + filter
  const noise = ctx.createOscillator();
  const noiseGain = ctx.createGain();
  noise.type = "square";
  noise.frequency.setValueAtTime(3200, now);
  noise.frequency.exponentialRampToValueAtTime(800, now + 0.25);
  noiseGain.gain.setValueAtTime(0.05, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  noise.connect(noiseGain).connect(getMaster());
  noise.start(now);
  noise.stop(now + 0.32);
}

export function playFastForwardSound() {
  resume();
  const ctx = getCtx();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  gainNode.connect(getMaster());
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(1800, now + 0.4);
  gainNode.gain.setValueAtTime(0.12, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
  osc.start(now);
  osc.stop(now + 0.5);
}

/** Dramatic chord sting — for breaking news / market event cards */
export function playEventSting() {
  resume();
  const now = getCtx().currentTime;
  // Minor chord with low brassy fundamental and a sharp upper sting
  playTone(110, "sawtooth", 0.18, 1.2, now);
  playTone(146.83, "sawtooth", 0.14, 1.2, now);
  playTone(220, "triangle", 0.10, 1.1, now);
  // Sharp top sting
  playTone(880, "square", 0.06, 0.4, now + 0.05);
  playTone(1320, "square", 0.04, 0.35, now + 0.08);
}

/** Rising fanfare for achievement unlocks */
export function playAchievementChime() {
  resume();
  const now = getCtx().currentTime;
  // C-E-G-C major arpeggio with a sparkle on top
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
  notes.forEach((freq, i) => playTone(freq, "triangle", 0.14 - i * 0.015, 0.45, now + i * 0.07));
  // Sparkle
  playTone(2093, "sine", 0.06, 0.6, now + 0.4);
  playTone(2637, "sine", 0.04, 0.5, now + 0.5);
}

/** Soft ding for incoming chat message */
export function playChatDing() {
  resume();
  const now = getCtx().currentTime;
  playTone(1200, "sine", 0.08, 0.12, now);
  playTone(1800, "sine", 0.05, 0.10, now + 0.04);
}

/** Whoosh for emoji reaction floating up */
export function playReactionPop() {
  resume();
  const ctx = getCtx();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g).connect(getMaster());
  osc.type = "sine";
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(1500, now + 0.18);
  g.gain.setValueAtTime(0.08, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  osc.start(now);
  osc.stop(now + 0.25);
}

/** Hover/click UI tick */
export function playUiTick() {
  resume();
  const now = getCtx().currentTime;
  playTone(900, "sine", 0.04, 0.06, now);
}

/**
 * Ambient looping background pad — futuristic financial hub feel. Layers a low
 * sustained chord with a slow-evolving high pad. Volume is intentionally low.
 */
export function startAmbientLoop(intensity: "calm" | "tense" = "calm"): void {
  resume();
  if (ambientOsc) return; // already playing

  const ctx = getCtx();
  const dest = getMaster();
  const masterAmbient = ctx.createGain();
  masterAmbient.gain.value = 0;
  masterAmbient.gain.linearRampToValueAtTime(intensity === "tense" ? 0.05 : 0.025, ctx.currentTime + 2.5);
  masterAmbient.connect(dest);

  // Low pad (root + fifth)
  const root = ctx.createOscillator();
  root.type = "sine";
  root.frequency.value = 110; // A2
  const rootGain = ctx.createGain();
  rootGain.gain.value = 0.6;
  root.connect(rootGain).connect(masterAmbient);

  const fifth = ctx.createOscillator();
  fifth.type = "sine";
  fifth.frequency.value = 164.81; // E3
  const fifthGain = ctx.createGain();
  fifthGain.gain.value = 0.4;
  fifth.connect(fifthGain).connect(masterAmbient);

  // Slow evolving high pad with lfo
  const pad = ctx.createOscillator();
  pad.type = "triangle";
  pad.frequency.value = 440;
  const padGain = ctx.createGain();
  padGain.gain.value = 0.08;
  pad.connect(padGain).connect(masterAmbient);

  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.13;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 8;
  lfo.connect(lfoGain).connect(pad.frequency);

  root.start();
  fifth.start();
  pad.start();
  lfo.start();

  ambientOsc = {
    stop: () => {
      const t = ctx.currentTime;
      masterAmbient.gain.cancelScheduledValues(t);
      masterAmbient.gain.setTargetAtTime(0, t, 0.4);
      setTimeout(() => {
        try { root.stop(); fifth.stop(); pad.stop(); lfo.stop(); } catch { /* ignore */ }
        try { masterAmbient.disconnect(); } catch { /* ignore */ }
      }, 1500);
      ambientOsc = null;
    },
  };
}

export function stopAmbientLoop(): void {
  ambientOsc?.stop();
}
