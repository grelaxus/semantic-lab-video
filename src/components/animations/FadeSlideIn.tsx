import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface FadeSlideInProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  distance?: number;
  style?: React.CSSProperties;
}

export const FadeSlideIn: React.FC<FadeSlideInProps> = ({
  children,
  direction = "up",
  delay = 0,
  distance = 20,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const getTransform = () => {
    const offset = interpolate(progress, [0, 1], [distance, 0]);
    switch (direction) {
      case "up":
        return `translateY(${offset}px)`;
      case "down":
        return `translateY(${-offset}px)`;
      case "left":
        return `translateX(${offset}px)`;
      case "right":
        return `translateX(${-offset}px)`;
    }
  };

  if (frame < delay) return null;

  return (
    <div
      style={{
        opacity,
        transform: getTransform(),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
