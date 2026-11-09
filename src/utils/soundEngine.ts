class ParkSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private waterGain: GainNode | null = null;
  private musicTimer: number | null = null;
  private muted = false;
  private musicEnabled = true;
  private volume = 0.45;
  private initialized = false;
  private lastStepTime = 0;

  private ensureContext(): boolean {
    if (typeof window === 'undefined') return false;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;
      try {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.muted ? 0 : this.volume;
        this.masterGain.connect(this.ctx.destination);
      } catch {
        return false;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return true;
  }

  public startAmbience() {
    if (this.initialized || !this.ensureContext() || !this.ctx || !this.masterGain) return;
    this.initialized = true;

    // Gentle breeze + flowing fountain/waterfall water pink-noise generator
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.95 * b2 + white * 0.048;
      data[i] = (b0 + b1 + b2) * 0.14;
    }

    const windSrc = this.ctx.createBufferSource();
    windSrc.buffer = noiseBuffer;
    windSrc.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.value = 340;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = 0.16;

    windSrc.connect(windFilter);
    windFilter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);
    windSrc.start();

    // Water murmur layer modulated dynamically by distance to fountains/waterfalls
    const waterSrc = this.ctx.createBufferSource();
    waterSrc.buffer = noiseBuffer;
    waterSrc.loop = true;

    const waterFilter = this.ctx.createBiquadFilter();
    waterFilter.type = 'bandpass';
    waterFilter.frequency.value = 950;
    waterFilter.Q.value = 0.7;

    this.waterGain = this.ctx.createGain();
    this.waterGain.gain.value = 0.02;

    waterSrc.connect(waterFilter);
    waterFilter.connect(this.waterGain);
    this.waterGain.connect(this.masterGain);
    waterSrc.start();

    // Soft pastel celesta music box loop (every ~1.25s)
    const notes = [523.25, 659.25, 783.99, 987.77, 783.99, 659.25, 587.33, 698.46, 880.0, 659.25];
    let idx = 0;
    this.musicTimer = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || this.muted || !this.musicEnabled || this.ctx.state !== 'running') {
        return;
      }
      const freq = notes[idx % notes.length];
      idx += 1;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.032, now + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 1.15);

      // Occasional distant bird chirp
      if (Math.random() < 0.22) {
        this.playBirdChirp();
      }
    }, 1150);
  }

  private playBirdChirp() {
    if (!this.ctx || !this.masterGain || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const base = 1700 + Math.random() * 650;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * 1.28, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(base * 0.92, now + 0.16);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.025, now + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.21);
  }

  public setWaterProximity(distance: number) {
    if (!this.waterGain || !this.ctx) return;
    const proximity = Math.max(0, 1 - distance / 16);
    this.waterGain.gain.setTargetAtTime(0.01 + proximity * 0.22, this.ctx.currentTime, 0.2);
  }

  public playFootstep(surface: 'wood' | 'stone' | 'cobble' | 'snow' | 'grass', sprinting: boolean) {
    const nowMs = performance.now();
    const interval = sprinting ? 310 : 450;
    if (nowMs - this.lastStepTime < interval) return;
    this.lastStepTime = nowMs;

    if (!this.ensureContext() || !this.ctx || !this.masterGain || this.muted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    if (surface === 'cobble' || surface === 'stone') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(210 + Math.random() * 35, now);
      osc.frequency.exponentialRampToValueAtTime(95, now + 0.065);
    } else if (surface === 'wood') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(165 + Math.random() * 25, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.085);
    } else if (surface === 'snow') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(340 + Math.random() * 60, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.09);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(125 + Math.random() * 20, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.075);
    }

    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.065, now + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  public playMagicChime() {
    if (!this.ensureContext() || !this.ctx || !this.masterGain || this.muted) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      g.gain.setValueAtTime(0.0001, now + i * 0.06);
      g.gain.exponentialRampToValueAtTime(0.08, now + i * 0.06 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.45);
      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.48);
    });
  }

  public setMuted(m: boolean) {
    this.muted = m;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(m ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public isMuted() {
    return this.muted;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
  }

  public isMusicEnabled() {
    return this.musicEnabled;
  }

  public setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.masterGain && this.ctx && !this.muted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume() {
    return this.volume;
  }

  public dispose() {
    if (this.musicTimer !== null) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const soundEngine = new ParkSoundEngine();
