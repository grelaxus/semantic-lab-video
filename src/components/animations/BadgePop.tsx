import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface BadgePopProps {
  children: React.ReactNode;
  delay?: number;
  backgroundColor?: string;
  textColor?: string;
  style?: React.CSSProperties;
}

export const BadgePop: React.FC<BadgePopProps> = ({
  children,
  delay = 0,
  backgroundColor = "rgba(34, 197, 94, 0.2)",
  textColor = "#22c55e",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const scale = interpolate(scaleProgress, [0, 1], [0.5, 1]);
  const opacity = interpolate(frame - delay, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < delay) return null;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 10px",
        borderRadius: 12,
        backgroundColor,
        color: textColor,
        fontSize: 12,
        fontWeight: 600,
        transform: `scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      {children}
    </span>
  );
};
