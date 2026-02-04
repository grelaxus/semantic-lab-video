import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface MapSceneProps {
  mapDuration: number;
}

const CarIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x - 20,
        top: y - 20,
        width: 40,
        height: 40,
        transform: "rotate(90deg)",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="#000000"
        style={{ width: "100%", height: "100%" }}
      >
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
      </svg>
    </div>
  );
};

export const MapScene: React.FC<MapSceneProps> = ({ mapDuration }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // Car animation: moves from bottom to top (near center)
  const carStartY = height - 100;
  const carEndY = height / 2 - 50;
  const carY = interpolate(
    frame,
    [0, mapDuration],
    [carStartY, carEndY],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateRight: "clamp",
    }
  );
  const carX = width / 2;

  // Notification appears at frame ~70 (relative to scene start, which is frame 450)
  // So frame 70 in this scene = frame 520 total
  const notificationStartFrame = 70;
  const notificationY = interpolate(
    frame,
    [notificationStartFrame, notificationStartFrame + 15],
    [-100, 80],
    {
      easing: Easing.out(Easing.ease),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const notificationOpacity = interpolate(
    frame,
    [notificationStartFrame, notificationStartFrame + 10],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      className="relative"
      style={{
        backgroundColor: "#E0F5EB", // Mint green background
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Road (vertical grey strip) */}
      <div
        style={{
          position: "absolute",
          left: width / 2 - 30,
          top: 0,
          width: 60,
          height: height,
          backgroundColor: "#D1D1D1",
        }}
      />

      {/* User location dot (blue circle at center-top) */}
      <div
        style={{
          position: "absolute",
          left: width / 2 - 8,
          top: height / 2 - 50,
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: "#007AFF",
          border: "2px solid white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      />

      {/* Car */}
      <CarIcon x={carX} y={carY} />

      {/* Driver Message Notification */}
      {frame >= notificationStartFrame && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: notificationY,
            transform: "translateX(-50%)",
            backgroundColor: "#000000",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 400,
            opacity: notificationOpacity,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            maxWidth: width - 48,
            textAlign: "center",
          }}
        >
          Message from Driver
        </div>
      )}
    </AbsoluteFill>
  );
};
