// ==============================================================================
// WEB AUDIO API ATMOSPHERIC SYNTHESIZER
// ==============================================================================

class GothicSynth {
  private ctx: AudioContext | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isPlaying = false;
  private volume = 0.3;

  public start(volume: number) {
    this.volume = volume;
    if (this.isPlaying) return;

    try {
      const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      this.ctx = new AudioContextClass();
      this.isPlaying = true;

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // 1. Drone Oscillator (Triangle Wave at low C - 65.41 Hz)
      this.droneOsc = this.ctx.createOscillator();
      this.droneGain = this.ctx.createGain();
      this.droneOsc.type = 'triangle';
      this.droneOsc.frequency.value = 65.41;
      this.droneGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

      this.droneOsc.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);
      this.droneOsc.start();

      // 2. Arpeggiator Loop
      const notes = [130.81, 155.56, 196.00, 207.65, 246.94, 261.63, 246.94, 207.65];
      let index = 0;

      this.intervalId = setInterval(() => {
        if (!this.ctx || this.ctx.state === 'suspended') {
          return;
        }

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(notes[index], now);

        // LFO Pitch Modulation
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 3.8;
        lfoGain.gain.value = 4.0;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        // Lowpass Filter
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, now);

        // Envelope
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.12, now + 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.masterGain!);

        osc.start(now);
        osc.stop(now + 1.6);
        lfo.stop(now + 1.6);

        index = (index + 1) % notes.length;
      }, 1200);

    } catch (err) {
      console.warn("AudioContext failed to initialize:", err);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.droneOsc) {
      try {
        this.droneOsc.stop();
      } catch {
        // Ignored catch
      }
      this.droneOsc = null;
    }

    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {
        // Ignored catch
      }
      this.ctx = null;
    }
  }

  public setVolume(volume: number) {
    this.volume = volume;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public playGavelKnock() {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playBankruptcyScreech() {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(30, now + 1.2);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.3);
  }
}

export const synth = new GothicSynth();
export default synth;
