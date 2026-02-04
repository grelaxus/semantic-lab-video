import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { FadeSlideIn } from "../animations";

interface HeaderSceneProps {
  title?: string;
  subtitle?: string;
  userQuery?: string;
}

export const HeaderScene: React.FC<HeaderSceneProps> = ({
  title = "Business Performance Copilot",
  subtitle = "AI-powered insights for your practice",
  userQuery = "Show me total revenue by location for Q1 2024",
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        padding: 60,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header / Breadcrumb */}
      <Sequence durationInFrames={fps * 10} layout="none">
        <FadeSlideIn direction="down" delay={0}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#64748b",
              fontSize: 14,
            }}
          >
            <span>Dashboard</span>
            <span>/</span>
            <span style={{ color: "#94a3b8" }}>Copilot</span>
          </div>
        </FadeSlideIn>
      </Sequence>

      {/* Title + Subtitle */}
      <Sequence from={Math.round(fps * 0.2)} durationInFrames={fps * 10} layout="none">
        <FadeSlideIn direction="up" delay={0}>
          <div style={{ marginTop: 24 }}>
            <h1
              style={{
                fontSize: 42,
                fontWeight: 700,
                color: "#f1f5f9",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 18,
                color: "#94a3b8",
                marginTop: 8,
              }}
            >
              {subtitle}
            </p>
          </div>
        </FadeSlideIn>
      </Sequence>

      {/* User Query Bubble */}
      <Sequence from={Math.round(fps * 0.6)} durationInFrames={fps * 10} layout="none">
        <FadeSlideIn direction="right" delay={0}>
          <div
            style={{
              marginTop: 48,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.15)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: 16,
                padding: "16px 24px",
                maxWidth: 500,
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#22c55e",
                  fontSize: 16,
                  lineHeight: 1.5,
                }}
              >
                {userQuery}
              </p>
            </div>
          </div>
        </FadeSlideIn>
      </Sequence>

      {/* Timestamp */}
      <Sequence from={Math.round(fps * 0.9)} durationInFrames={fps * 10} layout="none">
        <FadeSlideIn direction="up" delay={0}>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <span style={{ color: "#64748b", fontSize: 12 }}>
              Just now
            </span>
          </div>
        </FadeSlideIn>
      </Sequence>
    </AbsoluteFill>
  );
};
