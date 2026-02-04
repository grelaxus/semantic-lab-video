import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface RequestingSceneProps {
  driverName: string;
  ridePrice: string;
}

export const RequestingScene: React.FC<RequestingSceneProps> = ({
  driverName,
  ridePrice,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Progress bar: 0% to 100% over first 60 frames
  const progress = interpolate(
    frame,
    [0, 60],
    [0, 100],
    { extrapolateRight: "clamp" }
  );

  // Text change: "Finding drivers..." -> "Driver Found!" at frame 60
  const showFound = frame >= 60;
  const foundOpacity = interpolate(
    frame,
    [60, 65],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const findingOpacity = interpolate(
    frame,
    [55, 60],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      className="bg-white flex flex-col items-center justify-center px-8"
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div className="w-full max-w-md">
        {/* Ride Selection Card */}
        <div
          className="bg-white border border-gray-200 rounded-lg p-6 mb-8"
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#000",
              marginBottom: 8,
            }}
          >
            Choose {driverName}
          </div>
          <div
            style={{
              fontSize: 16,
              color: "#666",
              marginBottom: 16,
            }}
          >
            {ridePrice}
          </div>

          {/* Progress Bar */}
          <div
            className="bg-gray-200 rounded-full h-2 overflow-hidden"
            style={{ width: "100%" }}
          >
            <div
              className="bg-[#007AFF] h-full rounded-full"
              style={{
                width: `${progress}%`,
                transition: "width 0.1s linear",
              }}
            />
          </div>

          {/* Status Text */}
          <div className="mt-4" style={{ minHeight: 24 }}>
            {!showFound && (
              <div
                style={{
                  fontSize: 16,
                  color: "#666",
                  opacity: findingOpacity,
                }}
              >
                Finding drivers...
              </div>
            )}
            {showFound && (
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#27C96E",
                  opacity: foundOpacity,
                }}
              >
                Driver Found!
              </div>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
