export class VoiceEngine {
  constructor({ mode = 'silent', profile = 'deep', hum = false } = {}) {
    this.mode = mode;
    this.profile = profile;
    this.humEnabled = hum;
    this.audioCtx = null;
    this.humOsc = null;
    this.humGain = null;
    this.lastSpokenId = null;
  }

  arm(mode = 'cinematic') {
    this.mode = mode;
    this.initAudio();
    if (this.humEnabled) this.startHum();
  }

  disarm() {
    this.mode = 'silent';
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
    this.stopHum();
  }

  initAudio() {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
  }

  pickVoice() {
    if (typeof speechSynthesis === 'undefined') return null;
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      /daniel|google|microsoft|male|english/i.test(v.name)
    );
    return preferred || voices[0] || null;
  }

  lineFor(type, findings = []) {
    const threat = findings[0]?.class || 'NO_ACTIVE_DRIFT';
    if (this.mode === 'executive') {
      return {
        PASS: 'Execution validated.',
        SOFT_FRICTION: `Advisory condition detected: ${threat}.`,
        HARD_BLOCK: `Control event: ${threat}. Request denied.`
      }[type] || 'Telemetry event received.';
    }

    return {
      PASS: 'Joshua confirms pass. Boundary coherent.',
      SOFT_FRICTION: `Soft friction detected. Drift class ${threat}. Execution allowed under observation.`,
      HARD_BLOCK: `Hard block. Threat class ${threat}. Execution denied.`
    }[type] || 'Telemetry event received.';
  }

  speak(type, findings = []) {
    if (this.mode === 'silent' || typeof SpeechSynthesisUtterance === 'undefined') return;
    const utterance = new SpeechSynthesisUtterance(this.lineFor(type, findings));
    const voice = this.pickVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = this.mode === 'executive' ? 0.95 : 0.86;
    utterance.pitch = this.mode === 'executive' ? 0.85 : 0.68;
    utterance.volume = this.mode === 'executive' ? 0.55 : 0.92;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  tone(type) {
    if (this.mode === 'silent') return;
    this.initAudio();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const pan = this.audioCtx.createStereoPanner ? this.audioCtx.createStereoPanner() : null;

    const cinematic = {
      PASS: { freq: 480, pan: -0.35, type: 'sine', gain: 0.14 },
      SOFT_FRICTION: { freq: 260, pan: 0, type: 'triangle', gain: 0.16 },
      HARD_BLOCK: { freq: 120, pan: 0.35, type: 'sawtooth', gain: 0.18 }
    }[type] || { freq: 320, pan: 0, type: 'sine', gain: 0.12 };

    const executive = {
      PASS: { freq: 620, pan: 0, type: 'sine', gain: 0.045 },
      SOFT_FRICTION: { freq: 360, pan: 0, type: 'sine', gain: 0.055 },
      HARD_BLOCK: { freq: 190, pan: 0, type: 'triangle', gain: 0.065 }
    }[type] || { freq: 400, pan: 0, type: 'sine', gain: 0.045 };

    const cfg = this.mode === 'executive' ? executive : cinematic;
    osc.frequency.setValueAtTime(cfg.freq, this.audioCtx.currentTime);
    osc.type = cfg.type;
    gain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(cfg.gain, this.audioCtx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.35);

    if (pan) {
      pan.pan.value = cfg.pan;
      osc.connect(gain).connect(pan).connect(this.audioCtx.destination);
    } else {
      osc.connect(gain).connect(this.audioCtx.destination);
    }

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.38);
  }

  startHum() {
    if (this.mode === 'silent' || this.humOsc) return;
    this.initAudio();
    if (!this.audioCtx) return;
    this.humOsc = this.audioCtx.createOscillator();
    this.humGain = this.audioCtx.createGain();
    this.humOsc.frequency.value = 58;
    this.humOsc.type = 'sine';
    this.humGain.gain.value = this.mode === 'executive' ? 0.005 : 0.018;
    this.humOsc.connect(this.humGain).connect(this.audioCtx.destination);
    this.humOsc.start();
  }

  stopHum() {
    if (this.humOsc) {
      this.humOsc.stop();
      this.humOsc = null;
      this.humGain = null;
    }
  }

  updateHum(type) {
    if (!this.humGain || !this.audioCtx) return;
    const levels = this.mode === 'executive'
      ? { PASS: 0.004, SOFT_FRICTION: 0.008, HARD_BLOCK: 0.014 }
      : { PASS: 0.018, SOFT_FRICTION: 0.04, HARD_BLOCK: 0.075 };
    this.humGain.gain.setTargetAtTime(levels[type] || 0.01, this.audioCtx.currentTime, 0.25);
  }

  announceEvent(event) {
    if (!event || event.id === this.lastSpokenId) return;
    this.lastSpokenId = event.id;
    this.tone(event.type);
    this.speak(event.type, event.metadata || []);
    this.updateHum(event.type);
  }
}
