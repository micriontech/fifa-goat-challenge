export function playCelebrationSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    const play = (freq: number, start: number, duration: number, type: OscillatorType = "sine", gain = 0.3) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gainNode.gain.setValueAtTime(0, ctx.currentTime + start);
      gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // Fanfare: ascending triumphant notes
    play(523.25, 0.0,  0.15, "triangle", 0.4);
    play(659.25, 0.15, 0.15, "triangle", 0.4);
    play(783.99, 0.3,  0.15, "triangle", 0.4);
    play(1046.5, 0.45, 0.4,  "triangle", 0.5);
    // Bass hit
    play(130.81, 0.0,  0.3,  "square",   0.15);
    play(174.61, 0.45, 0.3,  "square",   0.15);
    // Sparkle high notes
    play(2093.0, 0.5,  0.1,  "sine",     0.1);
    play(2637.0, 0.6,  0.1,  "sine",     0.1);
    play(3136.0, 0.7,  0.2,  "sine",     0.12);
  } catch {
    // AudioContext not available — silent fail
  }
}
