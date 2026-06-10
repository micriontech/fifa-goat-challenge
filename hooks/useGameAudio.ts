"use client";
import { useRef, useState, useCallback } from "react";

function makeCtx(ref: React.MutableRefObject<AudioContext | null>): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ref.current) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ref.current = new AC();
  }
  const ac = ref.current;
  if (ac && ac.state === "suspended") ac.resume();
  return ref.current;
}

export function useGameAudio() {
  const acRef  = useRef<AudioContext | null>(null);
  const mutRef = useRef(false);
  const [muted, setMutedState] = useState(false);

  const toggleMute = useCallback(() => {
    setMutedState((prev) => {
      mutRef.current = !prev;
      return !prev;
    });
  }, []);

  /* ── Card flip whoosh ─────────────────────────────────────────────────── */
  const playFlip = useCallback(() => {
    if (mutRef.current) return;
    const ac = makeCtx(acRef);
    if (!ac) return;
    const now = ac.currentTime;

    // Descending sine sweep (card swoosh)
    const osc = ac.createOscillator();
    const g   = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.22);
    g.gain.setValueAtTime(0.28, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(g); g.connect(ac.destination);
    osc.start(now); osc.stop(now + 0.24);

    // High-pass noise burst (card rustle texture)
    const len  = Math.floor(ac.sampleRate * 0.14);
    const buf  = ac.createBuffer(1, len, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const ns = ac.createBufferSource();
    ns.buffer = buf;
    const hpf = ac.createBiquadFilter();
    hpf.type = "highpass"; hpf.frequency.value = 3500;
    const ng = ac.createGain();
    ng.gain.setValueAtTime(0.10, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    ns.connect(hpf); hpf.connect(ng); ng.connect(ac.destination);
    ns.start(now); ns.stop(now + 0.16);
  }, []);

  /* ── Player pick: bass thud + crowd cheer ──────────────────────────────── */
  const playPick = useCallback(() => {
    if (mutRef.current) return;
    const ac = makeCtx(acRef);
    if (!ac) return;
    const now = ac.currentTime;

    // Deep bass thud
    const thud = ac.createOscillator();
    const tg   = ac.createGain();
    thud.type = "sine";
    thud.frequency.setValueAtTime(170, now);
    thud.frequency.exponentialRampToValueAtTime(42, now + 0.28);
    tg.gain.setValueAtTime(0.75, now);
    tg.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    thud.connect(tg); tg.connect(ac.destination);
    thud.start(now); thud.stop(now + 0.32);

    // Bright ping accent
    const ping = ac.createOscillator();
    const pg   = ac.createGain();
    ping.type = "triangle";
    ping.frequency.value = 1100;
    pg.gain.setValueAtTime(0.18, now);
    pg.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    ping.connect(pg); pg.connect(ac.destination);
    ping.start(now); ping.stop(now + 0.20);

    // Rising crowd roar (filtered noise with sweeping low-pass)
    const cLen = Math.floor(ac.sampleRate * 1.0);
    const cBuf = ac.createBuffer(2, cLen, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = cBuf.getChannelData(ch);
      for (let i = 0; i < cLen; i++) d[i] = Math.random() * 2 - 1;
    }
    const crowd = ac.createBufferSource();
    crowd.buffer = cBuf;
    const lpf = ac.createBiquadFilter();
    lpf.type = "lowpass";
    lpf.frequency.setValueAtTime(350, now);
    lpf.frequency.linearRampToValueAtTime(2400, now + 0.35);
    lpf.frequency.linearRampToValueAtTime(1200, now + 1.0);
    const cg = ac.createGain();
    cg.gain.setValueAtTime(0, now);
    cg.gain.linearRampToValueAtTime(0.24, now + 0.12);
    cg.gain.setValueAtTime(0.24, now + 0.45);
    cg.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
    crowd.connect(lpf); lpf.connect(cg); cg.connect(ac.destination);
    crowd.start(now); crowd.stop(now + 1.05);
  }, []);

  /* ── Final round tension heartbeat ─────────────────────────────────────── */
  const playHeartbeat = useCallback(() => {
    if (mutRef.current) return;
    const ac = makeCtx(acRef);
    if (!ac) return;
    const now = ac.currentTime;
    // "dum-DUM" two-beat pattern
    [{ t: 0, freq: 70, vol: 0.45 }, { t: 0.18, freq: 90, vol: 0.6 }].forEach(({ t, freq, vol }) => {
      const osc = ac.createOscillator();
      const g   = ac.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, now + t);
      g.gain.linearRampToValueAtTime(vol, now + t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, now + t + 0.18);
      osc.connect(g); g.connect(ac.destination);
      osc.start(now + t); osc.stop(now + t + 0.22);
    });
  }, []);

  /* ── GOAT crowned: fanfare + stadium eruption ───────────────────────────── */
  const playGoatCrowned = useCallback(() => {
    if (mutRef.current) return;
    const ac = makeCtx(acRef);
    if (!ac) return;
    const now = ac.currentTime;

    // Ascending fanfare arpeggio (C major scale up two octaves)
    const notes = [262, 330, 392, 523, 659, 784, 1047, 1319];
    notes.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const g   = ac.createGain();
      osc.type = i < 4 ? "sine" : "triangle";
      osc.frequency.value = freq;
      const t = now + i * 0.12;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.26, t + 0.06);
      g.gain.setValueAtTime(0.26, t + 0.22);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.95);
      osc.connect(g); g.connect(ac.destination);
      osc.start(t); osc.stop(t + 1.0);
    });

    // Big bass chord underneath
    [130, 165, 196].forEach((freq, i) => {
      const osc = ac.createOscillator();
      const g   = ac.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = now + 0.4;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.18 - i * 0.04, t + 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
      osc.connect(g); g.connect(ac.destination);
      osc.start(t); osc.stop(t + 2.0);
    });

    // Stadium eruption (wide-band noise with sweeping filter)
    const sLen = Math.floor(ac.sampleRate * 3.0);
    const sBuf = ac.createBuffer(2, sLen, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = sBuf.getChannelData(ch);
      for (let i = 0; i < sLen; i++) d[i] = Math.random() * 2 - 1;
    }
    const stadium = ac.createBufferSource();
    stadium.buffer = sBuf;
    const lpf = ac.createBiquadFilter();
    lpf.type = "lowpass";
    lpf.frequency.setValueAtTime(150, now);
    lpf.frequency.linearRampToValueAtTime(3500, now + 0.6);
    lpf.frequency.setValueAtTime(3500, now + 1.8);
    lpf.frequency.linearRampToValueAtTime(1500, now + 3.0);
    const sg = ac.createGain();
    sg.gain.setValueAtTime(0, now);
    sg.gain.linearRampToValueAtTime(0.32, now + 0.5);
    sg.gain.setValueAtTime(0.32, now + 1.8);
    sg.gain.exponentialRampToValueAtTime(0.001, now + 3.0);
    stadium.connect(lpf); lpf.connect(sg); sg.connect(ac.destination);
    stadium.start(now); stadium.stop(now + 3.1);
  }, []);

  return { muted, toggleMute, playFlip, playPick, playHeartbeat, playGoatCrowned };
}
