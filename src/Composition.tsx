import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const PARTICLE_COUNT = 48;
const LOGO_FADE_START = 0;
const LOGO_FADE_DURATION_FRAMES = 25;

// Deterministic position from index (no random at render)
function particleStyle(index: number, frame: number, width: number, height: number) {
  const seed = index * 17 + 31;
  const x = ((seed * 47) % 100) * (width / 100) - 20;
  const y = ((seed * 73) % 100) * (height / 100) - 20;
  const size = 2 + (seed % 3);
  const drift = Math.sin((frame * 0.02 + index * 0.5) * 0.5) * 4;
  const opacity = 0.08 + (Math.sin(frame * 0.03 + index) * 0.5 + 0.5) * 0.12;
  return {
    position: "absolute" as const,
    left: x + drift,
    top: y + drift * 0.7,
    width: size,
    height: size,
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    opacity: Math.max(0.05, opacity),
  };
}

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const entranceSpring = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 120 },
    durationInFrames: LOGO_FADE_DURATION_FRAMES,
  });

  const opacity = interpolate(
    frame,
    [LOGO_FADE_START, LOGO_FADE_START + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const scale = interpolate(entranceSpring, [0, 1], [0.4, 1]);

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 35%, #16213e 70%, #0f0f1a 100%)",
      }}
    >
      {/* Particles */}
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
        <div
          key={i}
          style={particleStyle(i, frame, width, height)}
        />
      ))}

      {/* Logo */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "0.08em",
            color: "#fff",
            textShadow: "0 0 40px rgba(100, 150, 255, 0.3)",
            opacity,
            transform: `scale(${scale})`,
          }}
        >
          AI BUILDER SPACE !!!!!!
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
