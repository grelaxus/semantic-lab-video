import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delay?: number;
  durationFrames?: number;
  style?: React.CSSProperties;
}

export const CountUp: React.FC<CountUpProps> = ({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  delay = 0,
  durationFrames = 30,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 80 },
    durationInFrames: durationFrames,
  });

  const currentValue = interpolate(progress, [0, 1], [0, value]);
  const displayValue = currentValue.toFixed(decimals);

  const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span style={{ opacity, ...style }}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};
