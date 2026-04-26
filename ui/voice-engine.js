export class VoiceEngine {
  constructor({ mode = 'silent', profile = 'joshua', hum = false, locale = 'en-US', cooldownMs = 1400, autoSwitch = true, dialogue = true } = {}) {
    this.mode = mode;
    this.profile = profile;
    this.baseProfile = profile;
    this.locale = locale;
    this.humEnabled = hum;
    this.cooldownMs = cooldownMs;
    this.autoSwitch = autoSwitch;
    this.dialogue = dialogue;
    this.audioCtx = null;
    this.humOsc = null;
    this.humGain = null;
    this.lastSpokenId = null;
    this.lastSpokenAt = 0;
    this.lastPriority = 0;
    this.dialogueQueue = [];
    this.dialogueRunning = false;
  }

  arm(mode = 'cinematic', profile = this.profile) {
    this.mode = mode;
    this.profile = profile;
    this.baseProfile = profile;
    this.initAudio();
    if (this.humEnabled) this.startHum();
  }

  disarm() {
    this.mode = 'silent';
    this.dialogueQueue = [];
    this.dialogueRunning = false;
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
    this.stopHum();
  }

  setProfile(profile) {
    this.profile = profile;
    this.baseProfile = profile;
  }

  setAutoSwitch(enabled = true) {
    this.autoSwitch = enabled;
  }

  setDialogue(enabled = true) {
    this.dialogue = enabled;
  }

  setLocale(locale) {
    this.locale = locale;
  }

  resolveProfileForEvent(type) {
    if (!this.autoSwitch) return this.profile;
    if (this.mode === 'executive') {
      return type === 'HARD_BLOCK' ? 'auditor' : 'corporate';
    }
    return {
      PASS: 'joshua',
      SOFT_FRICTION: 'oracle',
      HARD_BLOCK: 'chuck'
    }[type] || this.baseProfile || 'joshua';
  }

  initAudio() {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
  }

  priority(type) {
    return { PASS: 1, SOFT_FRICTION: 2, HARD_BLOCK: 3 }[type] || 1;
  }

  pickVoice(profile = this.profile) {
    if (typeof speechSynthesis === 'undefined') return null;
    const voices = speechSynthesis.getVoices();
    const sameLocale = voices.filter(v => v.lang?.toLowerCase().startsWith(this.locale.toLowerCase().slice(0, 2)));
    const pool = sameLocale.length ? sameLocale : voices;
    const profilePatterns = {
      joshua: /daniel|google|microsoft|male|english|david|mark/i,
      chuck: /alex|daniel|david|mark|male/i,
      oracle: /samantha|victoria|google|english|serena/i,
      auditor: /zira|microsoft|google|english|samantha/i,
      corporate: /samantha|zira|google|microsoft|english/i,
      neutral: /google|microsoft|english/i
    };
    const pattern = profilePatterns[profile] || profilePatterns.neutral;
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

  lineFor(type, findings = [], profile = this.profile) {
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
        HARD_BLOCK: `Stop. ${threat}. Request terminated. Boundary holds.`
      },
      oracle: {
        PASS: 'All signals align. The path is clear.',
        SOFT_FRICTION: `Disturbance detected. ${threat}. ${detail}. Probabilities shifting. Continue under observation.`,
        HARD_BLOCK: `The path collapses. ${threat}. Execution must not proceed.`
      },
      auditor: {
        PASS: 'Execution validated within policy bounds.',
        SOFT_FRICTION: `Advisory condition logged: ${threat}. ${detail}.`,
        HARD_BLOCK: `Policy violation confirmed: ${threat}. Request rejected and logged.`
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
    const persona = this.mode === 'executive' && !this.autoSwitch ? 'corporate' : profile;
    return (lines[persona] || lines.neutral)[type] || 'Telemetry event received.';
  }

  dialogueTurns(event) {
    const { threat, detail } = this.threatSummary(event.metadata || []);
    if (this.mode === 'executive' || !this.dialogue) {
      return [{ profile: this.resolveProfileForEvent(event.type), text: this.lineFor(event.type, event.metadata || [], this.resolveProfileForEvent(event.type)) }];
    }
    if (event.type === 'PASS') {
      return [
        { profile: 'joshua', text: 'Joshua: Pass confirmed. Boundary coherent.' },
        { profile: 'auditor', text: 'Auditor: Evidence chain updated. No exception logged.' }
      ];
    }
    if (event.type === 'SOFT_FRICTION') {
      return [
        { profile: 'oracle', text: `Oracle: Disturbance forming. ${threat}. ${detail}.` },
        { profile: 'joshua', text: 'Joshua: Maintain execution under observation.' },
        { profile: 'auditor', text: 'Auditor: Advisory condition recorded in WORM telemetry.' }
      ];
    }
    if (event.type === 'HARD_BLOCK') {
      return [
        { profile: 'oracle', text: `Oracle: Collapse vector identified. ${threat}.` },
        { profile: 'chuck', text: `Chuck: Stop. ${threat}. Boundary holds.` },
        { profile: 'auditor', text: `Auditor: Policy violation confirmed. ${detail}. Request rejected and logged.` },
        { profile: 'joshua', text: 'Joshua: System stable. Execution channel remains protected.' }
      ];
    }
    return [{ profile: 'joshua', text: 'Joshua: Telemetry event received.' }];
  }

  voiceSettings(profile = this.profile) {
    const settings = {
      joshua: { rate: 0.84, pitch: 0.66, volume: 0.94 },
      chuck: { rate: 0.9, pitch: 0.58, volume: 0.96 },
      oracle: { rate: 0.78, pitch: 0.74, volume: 0.9 },
      auditor: { rate: 0.96, pitch: 0.86, volume: 0.56 },
      corporate: { rate: 0.96, pitch: 0.86, volume: 0.56 },
      neutral: { rate: 0.92, pitch: 0.82, volume: 0.7 }
    };
    return this.mode === 'executive' && !this.autoSwitch ? settings.corporate : (settings[profile] || settings.neutral);
  }

  shouldSpeak(event) {
    if (!event || event.id === this.lastSpokenId) return false;
    const now = Date.now();
    const p = this.priority(event.type);
    const inCooldown = now - this.lastSpokenAt < this.cooldownMs;
    if (inCooldown && p < 3) return false;
    return true;
  }

  speakText(text, profile = this.profile) {
    return new Promise(resolve => {
      if (this.mode === 'silent' || typeof SpeechSynthesisUtterance === 'undefined') return resolve();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = this.pickVoice(profile);
      const settings = this.voiceSettings(profile);
      if (voice) utterance.voice = voice;
      utterance.lang = this.locale;
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;
      utterance.onend = resolve;
      utterance.onerror = resolve;
      speechSynthesis.speak(utterance);
    });
  }

  async runDialogue(event) {
    if (!this.shouldSpeak(event)) return;
    const p = this.priority(event.type);
    if (p >= this.lastPriority || p === 3) {
      this.dialogueQueue = [];
      if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
    }
    this.lastSpokenId = event.id;
    this.lastSpokenAt = Date.now();
    this.lastPriority = p;
    const turns = this.dialogueTurns(event);
    this.dialogueQueue.push(...turns);
    if (this.dialogueRunning) return;
    this.dialogueRunning = true;
    while (this.dialogueQueue.length && this.mode !== 'silent') {
      const turn = this.dialogueQueue.shift();
      this.profile = turn.profile;
      await this.speakText(turn.text, turn.profile);
      await new Promise(r => setTimeout(r, 160));
    }
    this.dialogueRunning = false;
  }

  speak(event) {
    this.runDialogue(event);
  }

  tone(type) {
    if (this.mode === 'silent') return;
    this.initAudio();
    if (!this.audioCtx) return;
    const activeProfile = this.resolveProfileForEvent(type);
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const pan = this.audioCtx.createStereoPanner ? this.audioCtx.createStereoPanner() : null;
    const cinematic = {
      PASS: { freq: 480, pan: -0.35, type: 'sine', gain: 0.14, duration: 0.34 },
      SOFT_FRICTION: { freq: 300, pan: 0, type: 'triangle', gain: 0.16, duration: 0.42 },
      HARD_BLOCK: { freq: 95, pan: 0.35, type: 'sawtooth', gain: 0.22, duration: 0.58 }
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
    if (pan) { pan.pan.value = cfg.pan; osc.connect(gain).connect(pan).connect(this.audioCtx.destination); }
    else { osc.connect(gain).connect(this.audioCtx.destination); }
    osc.start();
    osc.stop(this.audioCtx.currentTime + cfg.duration + 0.03);
    this.profile = activeProfile;
  }

  startHum() {
    if (this.mode === 'silent' || this.humOsc) return;
    this.initAudio();
    if (!this.audioCtx) return;
    this.humOsc = this.audioCtx.createOscillator();
    this.humGain = this.audioCtx.createGain();
    const activeProfile = this.profile;
    this.humOsc.frequency.value = activeProfile === 'chuck' ? 52 : activeProfile === 'oracle' ? 64 : 58;
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
    const activeProfile = this.resolveProfileForEvent(type);
    const humHz = activeProfile === 'chuck' ? 52 : activeProfile === 'oracle' ? 64 : 58;
    if (this.humOsc) this.humOsc.frequency.setTargetAtTime(humHz, this.audioCtx.currentTime, 0.25);
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
