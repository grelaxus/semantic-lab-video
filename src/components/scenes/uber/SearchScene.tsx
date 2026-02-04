import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface SearchSceneProps {
  pickupLocation: string;
  destination: string;
}

export const SearchScene: React.FC<SearchSceneProps> = ({
  pickupLocation,
  destination,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Show search input for first half, then location list
  const showSearchInput = frame < durationInFrames / 2;
  const showLocationList = frame >= durationInFrames / 2;

  const searchOpacity = interpolate(
    frame,
    [0, 5],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const listOpacity = interpolate(
    frame,
    [durationInFrames / 2, durationInFrames / 2 + 5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      className="bg-white"
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "60px 24px",
      }}
    >
      {/* Search Input */}
      {showSearchInput && (
        <div
          style={{
            opacity: searchOpacity,
          }}
        >
          <div
            className="bg-gray-100 rounded-lg px-4 py-4 flex items-center"
            style={{
              fontSize: 16,
              color: "#666",
            }}
          >
            <span>Where to?</span>
          </div>
        </div>
      )}

      {/* Location List */}
      {showLocationList && (
        <div
          style={{
            opacity: listOpacity,
          }}
        >
          <div className="space-y-2">
            <div
              className="bg-white border-b border-gray-200 py-4 px-4 flex items-center justify-between"
              style={{
                fontSize: 16,
                color: "#000",
              }}
            >
              <div>
                <div style={{ fontWeight: 500, color: "#000" }}>
                  {pickupLocation}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "#666",
                    marginTop: 4,
                  }}
                >
                  Pickup location
                </div>
              </div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
            <div
              className="bg-white border-b border-gray-200 py-4 px-4 flex items-center justify-between"
              style={{
                fontSize: 16,
                color: "#000",
              }}
            >
              <div>
                <div style={{ fontWeight: 500, color: "#000" }}>
                  {destination}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "#666",
                    marginTop: 4,
                  }}
                >
                  Destination
                </div>
              </div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
