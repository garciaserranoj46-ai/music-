import { InstrumentType } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.generateNoiseBuffer();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private generateNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Play a note at a specified frequency
   */
  public playNote(freq: number, duration: number = 0.8, instrument: InstrumentType = 'piano', dynamics: 'piano' | 'forte' | 'normal' = 'normal') {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const now = ctx.currentTime;

    const dynamicMult = dynamics === 'piano' ? 0.4 : dynamics === 'forte' ? 1.2 : 0.8;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * dynamicMult, now);
    masterGain.connect(ctx.destination);

    switch (instrument) {
      case 'xylophone':
        this.synthXylophone(ctx, freq, duration, now, masterGain);
        break;
      case 'flute':
        this.synthFlute(ctx, freq, duration, now, masterGain);
        break;
      case 'synth':
        this.synthCosmic(ctx, freq, duration, now, masterGain);
        break;
      case 'piano':
      default:
        this.synthPiano(ctx, freq, duration, now, masterGain);
        break;
    }
  }

  private synthPiano(ctx: AudioContext, freq: number, duration: number, now: number, dest: AudioNode) {
    // Dual oscillator with rich harmonic decay
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const noteGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now); // 2nd harmonic

    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, now); // 3rd harmonic

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + duration);

    // Envelope
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.7, now + 0.015); // sharp hammer attack
    noteGain.gain.exponentialRampToValueAtTime(0.3, now + 0.15); // body decay
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration); // release

    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.3, now);
    const osc3Gain = ctx.createGain();
    osc3Gain.gain.setValueAtTime(0.12, now);

    osc1.connect(noteGain);
    osc2.connect(osc2Gain).connect(noteGain);
    osc3.connect(osc3Gain).connect(noteGain);
    noteGain.connect(filter);
    filter.connect(dest);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + duration + 0.05);
    osc2.stop(now + duration + 0.05);
    osc3.stop(now + duration + 0.05);
  }

  private synthXylophone(ctx: AudioContext, freq: number, duration: number, now: number, dest: AudioNode) {
    // Crisp wooden bar strike + metallic chime
    const fundamental = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const strikeClick = ctx.createOscillator();

    const gainNode = ctx.createGain();
    const strikeGain = ctx.createGain();

    fundamental.type = 'sine';
    fundamental.frequency.setValueAtTime(freq, now);

    // Xylophone overtone is ~3x fundamental frequency
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 3, now);

    // Strike click
    strikeClick.type = 'triangle';
    strikeClick.frequency.setValueAtTime(freq * 4.5, now);

    // Envelope: very fast decay like wood/metal bar
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.85, now + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.1, now + 0.18);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + Math.min(duration, 0.9));

    strikeGain.gain.setValueAtTime(0.4, now);
    strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.35, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    fundamental.connect(gainNode);
    overtone.connect(overtoneGain).connect(gainNode);
    strikeClick.connect(strikeGain).connect(dest);
    gainNode.connect(dest);

    fundamental.start(now);
    overtone.start(now);
    strikeClick.start(now);

    const stopTime = now + Math.min(duration, 0.9) + 0.02;
    fundamental.stop(stopTime);
    overtone.stop(stopTime);
    strikeClick.stop(now + 0.05);
  }

  private synthFlute(ctx: AudioContext, freq: number, duration: number, now: number, dest: AudioNode) {
    // Pure mellow tone with gentle vibrato
    const osc = ctx.createOscillator();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    const gainNode = ctx.createGain();

    vibrato.frequency.setValueAtTime(5.5, now); // 5.5 Hz vibrato
    vibratoGain.gain.setValueAtTime(freq * 0.012, now); // vibrato depth
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Flute breathy attack
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.65, now + 0.06);
    gainNode.gain.setValueAtTime(0.55, now + duration - 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gainNode);
    gainNode.connect(dest);

    vibrato.start(now);
    osc.start(now);

    vibrato.stop(now + duration + 0.05);
    osc.stop(now + duration + 0.05);
  }

  private synthCosmic(ctx: AudioContext, freq: number, duration: number, now: number, dest: AudioNode) {
    // Retro playful 8-bit game synth
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 6, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration);
    filter.Q.setValueAtTime(4, now);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(dest);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  /**
   * Percussion Sounds for Rhythm Games
   */
  public playDrum(type: 'kick' | 'snare' | 'hihat' | 'woodblock' | 'bell') {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(ctx.destination);

    if (type === 'kick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(36, now + 0.12);

      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.26);
    } else if (type === 'snare') {
      // Noise + tone punch
      if (this.noiseBuffer) {
        const noise = ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(1000, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.7, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);
        noise.start(now);
        noise.stop(now + 0.2);
      }
      const tone = ctx.createOscillator();
      const toneGain = ctx.createGain();
      tone.type = 'triangle';
      tone.frequency.setValueAtTime(180, now);
      toneGain.gain.setValueAtTime(0.5, now);
      toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      tone.connect(toneGain);
      toneGain.connect(masterGain);
      tone.start(now);
      tone.stop(now + 0.12);
    } else if (type === 'hihat') {
      if (this.noiseBuffer) {
        const noise = ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(7000, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        noise.start(now);
        noise.stop(now + 0.08);
      }
    } else if (type === 'woodblock') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'bell') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2093, now); // C7 bell ring
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  }

  /**
   * Sound FX for UI and Game feedback
   */
  public playSuccess() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playNote(freq, 0.4, 'xylophone');
      }, idx * 100);
    });
  }

  public playFanfare() {
    if (this.isMuted) return;
    const seq = [
      { f: 523.25, d: 0.15, t: 0 },
      { f: 659.25, d: 0.15, t: 150 },
      { f: 783.99, d: 0.2, t: 300 },
      { f: 659.25, d: 0.15, t: 450 },
      { f: 1046.5, d: 0.6, t: 600 }
    ];
    seq.forEach(s => {
      setTimeout(() => {
        this.playNote(s.f, s.d, 'piano');
      }, s.t);
    });
  }

  public playCoin() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  public playWrong() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(160, now + 0.25);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  public playClick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }
}

export const soundEngine = new SoundEngine();
