import { interpolate, useCurrentFrame } from "remotion";

interface PulseProps {
  children: React.ReactNode;
  pulseSpeed?: number;
  minOpacity?: number;
  maxOpacity?: number;
  minScale?: number;
  maxScale?: number;
  style?: React.CSSProperties;
}

export const Pulse: React.FC<PulseProps> = ({
  children,
  pulseSpeed = 0.08,
  minOpacity = 0.6,
  maxOpacity = 1,
  minScale = 0.95,
  maxScale = 1.05,
  style,
}) => {
  const frame = useCurrentFrame();

  // Smooth sine wave for pulse effect
  const pulsePhase = Math.sin(frame * pulseSpeed) * 0.5 + 0.5;

  const opacity = interpolate(pulsePhase, [0, 1], [minOpacity, maxOpacity]);
  const scale = interpolate(pulsePhase, [0, 1], [minScale, maxScale]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
