export class VoiceEngine {
  constructor({ mode = 'silent', profile = 'joshua', hum = false, locale = 'en-US', cooldownMs = 1400 } = {}) {
    this.mode = mode;
    this.profile = profile;
    this.locale = locale;
    this.humEnabled = hum;
    this.cooldownMs = cooldownMs;
    this.audioCtx = null;
    this.humOsc = null;
    this.humGain = null;
    this.lastSpokenId = null;
    this.lastSpokenAt = 0;
    this.lastPriority = 0;
  }

  arm(mode = 'cinematic', profile = this.profile) {
    this.mode = mode;
    this.profile = profile;
    this.initAudio();
    if (this.humEnabled) this.startHum();
  }

  disarm() {
    this.mode = 'silent';
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
    this.stopHum();
  }

  setProfile(profile) {
    this.profile = profile;
  }

  setLocale(locale) {
    this.locale = locale;
  }

  initAudio() {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
  }

  priority(type) {
    return { PASS: 1, SOFT_FRICTION: 2, HARD_BLOCK: 3 }[type] || 1;
  }

  pickVoice() {
    if (typeof speechSynthesis === 'undefined') return null;
    const voices = speechSynthesis.getVoices();
    const sameLocale = voices.filter(v => v.lang?.toLowerCase().startsWith(this.locale.toLowerCase().slice(0, 2)));
    const pool = sameLocale.length ? sameLocale : voices;

    const profilePatterns = {
      joshua: /daniel|google|microsoft|male|english|david|mark/i,
      chuck: /alex|daniel|david|mark|male/i,
      corporate: /samantha|zira|google|microsoft|english/i,
      neutral: /google|microsoft|english/i
    };

    const pattern = profilePatterns[this.profile] || profilePatterns.neutral;
    return pool.find(v => pattern.test(v.name)) || pool[0] || null;
  }

  threatSummary(findings = []) {
    const top = findings[0];
    if (!top) return { threat: 'NO_ACTIVE_DRIFT', severity: 'NONE', detail: 'nominal' };
    return {
      threat: top.class || 'UNCLASSIFIED_DRIFT',
      severity: top.severity || 'UNKNOWN',
      detail: top.detail || 'classified drift'
    };
  }

  lineFor(type, findings = []) {
    const { threat, detail } = this.threatSummary(findings);

    const lines = {
      joshua: {
        PASS: 'Joshua confirms pass. Boundary coherent. Execution stable.',
        SOFT_FRICTION: `Soft friction detected. Drift class ${threat}. ${detail}. Execution allowed under observation.`,
        HARD_BLOCK: `Hard block. Threat class ${threat}. ${detail}. Execution denied.`
      },
      chuck: {
        PASS: 'Clean pass. System holds.',
        SOFT_FRICTION: `Friction detected: ${threat}. Watching the boundary.`,
        HARD_BLOCK: `Hard block. ${threat}. Request terminated.`
      },
      corporate: {
        PASS: 'Execution validated. No material control exception detected.',
        SOFT_FRICTION: `Advisory condition detected: ${threat}. Request permitted with monitoring.`,
        HARD_BLOCK: `Control event detected: ${threat}. Request denied under policy.`
      },
      neutral: {
        PASS: 'Execution validated.',
        SOFT_FRICTION: `Advisory condition detected: ${threat}.`,
        HARD_BLOCK: `Request denied. Threat class ${threat}.`
      }
    };

    const persona = this.mode === 'executive' ? 'corporate' : this.profile;
    return (lines[persona] || lines.neutral)[type] || 'Telemetry event received.';
  }

  voiceSettings() {
    const settings = {
      joshua: { rate: 0.84, pitch: 0.66, volume: 0.94 },
      chuck: { rate: 0.9, pitch: 0.58, volume: 0.96 },
      corporate: { rate: 0.96, pitch: 0.86, volume: 0.56 },
      neutral: { rate: 0.92, pitch: 0.82, volume: 0.7 }
    };
    return this.mode === 'executive' ? settings.corporate : (settings[this.profile] || settings.neutral);
  }

  shouldSpeak(event) {
    if (!event || event.id === this.lastSpokenId) return false;
    const now = Date.now();
    const p = this.priority(event.type);
    const inCooldown = now - this.lastSpokenAt < this.cooldownMs;
    if (inCooldown && p < 3) return false;
    return true;
  }

  speak(event) {
    if (this.mode === 'silent' || typeof SpeechSynthesisUtterance === 'undefined') return;
    if (!this.shouldSpeak(event)) return;

    const p = this.priority(event.type);
    if (p >= this.lastPriority || p === 3) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(this.lineFor(event.type, event.metadata || []));
    const voice = this.pickVoice();
    const settings = this.voiceSettings();
    if (voice) utterance.voice = voice;
    utterance.lang = this.locale;
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    speechSynthesis.speak(utterance);
    this.lastSpokenId = event.id;
    this.lastSpokenAt = Date.now();
    this.lastPriority = p;
  }

  tone(type) {
    if (this.mode === 'silent') return;
    this.initAudio();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const pan = this.audioCtx.createStereoPanner ? this.audioCtx.createStereoPanner() : null;

    const cinematic = {
      PASS: { freq: 480, pan: -0.35, type: 'sine', gain: 0.14, duration: 0.34 },
      SOFT_FRICTION: { freq: 260, pan: 0, type: 'triangle', gain: 0.16, duration: 0.42 },
      HARD_BLOCK: { freq: 120, pan: 0.35, type: 'sawtooth', gain: 0.2, duration: 0.55 }
    }[type] || { freq: 320, pan: 0, type: 'sine', gain: 0.12, duration: 0.35 };

    const executive = {
      PASS: { freq: 620, pan: 0, type: 'sine', gain: 0.045, duration: 0.18 },
      SOFT_FRICTION: { freq: 360, pan: 0, type: 'sine', gain: 0.055, duration: 0.22 },
      HARD_BLOCK: { freq: 190, pan: 0, type: 'triangle', gain: 0.065, duration: 0.28 }
    }[type] || { freq: 400, pan: 0, type: 'sine', gain: 0.045, duration: 0.2 };

    const cfg = this.mode === 'executive' ? executive : cinematic;
    osc.frequency.setValueAtTime(cfg.freq, this.audioCtx.currentTime);
    osc.type = cfg.type;
    gain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(cfg.gain, this.audioCtx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + cfg.duration);

    if (pan) {
      pan.pan.value = cfg.pan;
      osc.connect(gain).connect(pan).connect(this.audioCtx.destination);
    } else {
      osc.connect(gain).connect(this.audioCtx.destination);
    }

    osc.start();
    osc.stop(this.audioCtx.currentTime + cfg.duration + 0.03);
  }

  startHum() {
    if (this.mode === 'silent' || this.humOsc) return;
    this.initAudio();
    if (!this.audioCtx) return;
    this.humOsc = this.audioCtx.createOscillator();
    this.humGain = this.audioCtx.createGain();
    this.humOsc.frequency.value = this.profile === 'chuck' ? 52 : 58;
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
    if (!event) return;
    const isNew = event.id !== this.lastSpokenId;
    if (isNew) this.tone(event.type);
    this.speak(event);
    this.updateHum(event.type);
  }
}
