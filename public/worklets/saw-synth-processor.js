/* global sampleRate, registerProcessor, AudioWorkletProcessor */

// Detuned sawtooth synth with a resonant low-pass filter.
// Runs entirely on the audio rendering thread. Loaded by
// src/blob/lib/blobSynth.ts via audioWorklet.addModule().

const TWO_PI = 2 * Math.PI;

// Amplitude envelope, in seconds (sustain is a level, 0..1). The release
// time comes with each "noteOff"; RELEASE is only the fallback.
const ATTACK = 0.015;
const DECAY = 0.6;
const SUSTAIN = 0.45;
const RELEASE = 1.8;
// -ln(0.01): an exponential segment reaches 1% of the way left in its time.
const TO_ONE_PERCENT = 4.6;

const IDLE = 0;
const ATTACKING = 1;
const DECAYING = 2;
const RELEASING = 3;

// Band-limited step correction so the saws don't alias when pitched up.
function polyBlep(t, dt) {
  if (t < dt) {
    t /= dt;
    return t + t - t * t - 1;
  }
  if (t > 1 - dt) {
    t = (t - 1) / dt;
    return t * t + t + t + 1;
  }
  return 0;
}

// Zero-delay-feedback state variable filter (Simper/Zavalishin).
// Stays stable while the cutoff is being swept every sample.
class SVF {
  constructor() {
    this.ic1eq = 0;
    this.ic2eq = 0;
  }

  lowpass(v0, g, k) {
    const a1 = 1 / (1 + g * (g + k));
    const a2 = g * a1;
    const a3 = g * a2;
    const v3 = v0 - this.ic2eq;
    const v1 = a1 * this.ic1eq + a2 * v3;
    const v2 = this.ic2eq + a2 * this.ic1eq + a3 * v3;
    this.ic1eq = 2 * v1 - this.ic1eq;
    this.ic2eq = 2 * v2 - this.ic2eq;
    return v2;
  }
}

class SawSynthProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: "frequency",
        defaultValue: 110,
        minValue: 20,
        maxValue: 4000,
        automationRate: "k-rate",
      },
      {
        name: "cutoff",
        defaultValue: 500,
        minValue: 30,
        maxValue: 18000,
        automationRate: "k-rate",
      },
      {
        name: "resonance",
        defaultValue: 0.3,
        minValue: 0,
        maxValue: 0.97,
        automationRate: "k-rate",
      },
      {
        name: "detune",
        defaultValue: 8,
        minValue: 0,
        maxValue: 80,
        automationRate: "k-rate",
      },
      {
        name: "gain",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
    ];
  }

  constructor() {
    super();
    // three unison saws plus a sine sub, random start phases
    this.phases = new Float64Array([
      Math.random(),
      Math.random(),
      Math.random(),
    ]);
    this.freqs = new Float64Array(3);
    this.saws = new Float64Array(3);
    this.subPhase = 0;
    this.filters = [new SVF(), new SVF(), new SVF(), new SVF()];

    // per-sample smoothed copies of the k-rate params
    this.freq = 110;
    this.cutoff = 500;
    this.res = 0.3;
    this.detune = 8;
    this.gain = 0;

    // filter envelope fired by "accent" messages
    this.env = 0;
    this.envAmount = 0;
    this.envDecay = Math.exp(-1 / (0.35 * sampleRate));
    this.smooth = 1 - Math.exp(-1 / (0.008 * sampleRate));

    // ADSR on the output level, gated by "noteOn"/"noteOff" messages.
    // The attack is linear and starts from wherever the envelope is, so
    // retriggering mid-note doesn't click; decay and release are
    // exponential, reaching ~1% of the way left after the given time.
    this.amp = 0;
    this.stage = IDLE;
    this.attackStep = 1 / (ATTACK * sampleRate);
    this.decayCoef = Math.exp(-TO_ONE_PERCENT / (DECAY * sampleRate));
    this.releaseCoef = Math.exp(-TO_ONE_PERCENT / (RELEASE * sampleRate));

    this.port.onmessage = ({ data }) => {
      if (data.type === "accent") {
        this.env = 1;
        this.envAmount = data.amount;
      } else if (data.type === "noteOn") {
        this.stage = ATTACKING;
      } else if (data.type === "noteOff") {
        if (this.stage === IDLE) return;
        this.stage = RELEASING;
        this.releaseCoef = Math.exp(
          -TO_ONE_PERCENT / ((data.release ?? RELEASE) * sampleRate),
        );
      }
    };
  }

  process(inputs, outputs, parameters) {
    const out = outputs[0];
    const left = out[0];
    const right = out[1] || out[0];
    const s = this.smooth;
    const nyquistSafe = sampleRate * 0.45;

    const targetFreq = parameters.frequency[0];
    const targetCutoff = parameters.cutoff[0];
    const targetRes = parameters.resonance[0];
    const targetDetune = parameters.detune[0];
    const targetGain = parameters.gain[0];

    for (let i = 0; i < left.length; i++) {
      if (this.stage === ATTACKING) {
        this.amp += this.attackStep;
        if (this.amp >= 1) {
          this.amp = 1;
          this.stage = DECAYING;
        }
      } else if (this.stage === DECAYING) {
        this.amp = SUSTAIN + (this.amp - SUSTAIN) * this.decayCoef;
      } else if (this.stage === RELEASING) {
        this.amp *= this.releaseCoef;
        if (this.amp < 1e-5) {
          this.amp = 0;
          this.stage = IDLE;
        }
      }

      this.freq += (targetFreq - this.freq) * s;
      this.cutoff += (targetCutoff - this.cutoff) * s;
      this.res += (targetRes - this.res) * s;
      this.detune += (targetDetune - this.detune) * s;
      this.gain += (targetGain - this.gain) * s;
      this.env *= this.envDecay;

      const spread = 2 ** (this.detune / 1200);
      const { freqs, saws } = this;
      freqs[0] = this.freq / spread;
      freqs[1] = this.freq;
      freqs[2] = this.freq * spread;
      for (let v = 0; v < 3; v++) {
        const dt = freqs[v] / sampleRate;
        let p = this.phases[v] + dt;
        if (p >= 1) p -= 1;
        this.phases[v] = p;
        saws[v] = 2 * p - 1 - polyBlep(p, dt);
      }

      this.subPhase += this.freq / (2 * sampleRate);
      if (this.subPhase >= 1) this.subPhase -= 1;
      const sub = Math.sin(TWO_PI * this.subPhase) * 0.35;

      const l = saws[0] * 0.55 + saws[1] * 0.4 + sub;
      const r = saws[2] * 0.55 + saws[1] * 0.4 + sub;

      const fc = Math.min(
        this.cutoff * 2 ** (this.env * this.envAmount),
        nyquistSafe,
      );
      const g = Math.tan((Math.PI * fc) / sampleRate);
      // resonance lives on the second stage only, so the
      // 24dB cascade sings without screaming
      const k = 2 - 2 * this.res;

      const fl = this.filters[1].lowpass(
        this.filters[0].lowpass(l, g, 1.4),
        g,
        k,
      );
      const fr = this.filters[3].lowpass(
        this.filters[2].lowpass(r, g, 1.4),
        g,
        k,
      );

      const level = this.gain * this.amp;
      left[i] = Math.tanh(fl * 1.2) * level;
      right[i] = Math.tanh(fr * 1.2) * level;
    }

    return true;
  }
}

registerProcessor("saw-synth", SawSynthProcessor);
