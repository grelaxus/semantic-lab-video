import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { FadeSlideIn, BarChart, Typewriter, BadgePop } from "../animations";

interface BulletPoint {
  text: string;
}

interface ChartAnswerSceneProps {
  title?: string;
  chartData?: { label: string; value: number; color?: string }[];
  executiveSummary?: BulletPoint[];
  aiSummary?: string;
}

const ExecutiveBullet: React.FC<{ text: string; delay: number }> = ({
  text,
  delay,
}) => {
  return (
    <FadeSlideIn direction="up" delay={delay}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <span style={{ color: "#22c55e", fontSize: 14 }}>•</span>
        <span style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.5 }}>
          {text}
        </span>
      </div>
    </FadeSlideIn>
  );
};

export const ChartAnswerScene: React.FC<ChartAnswerSceneProps> = ({
  title = "Revenue Analysis Report",
  chartData = [
    { label: "Valley View", value: 2010000, color: "#22c55e" },
    { label: "Oak Grove", value: 1800000, color: "#3b82f6" },
    { label: "Central", value: 1200000, color: "#f59e0b" },
    { label: "Westside", value: 1450000, color: "#8b5cf6" },
    { label: "Downtown", value: 980000, color: "#ec4899" },
  ],
  executiveSummary = [
    { text: "Total Q1 revenue: $8.4M across all locations" },
    { text: "Valley View outperforms by 12% year-over-year" },
    { text: "Central shows 8% decline - recommend review" },
    { text: "Collection rate: 87% practice-wide" },
  ],
  aiSummary = "Revenue distribution shows strong performance in suburban locations. Consider reallocating resources from underperforming Central location.",
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
      {/* Title */}
      <Sequence durationInFrames={fps * 10} layout="none">
        <FadeSlideIn direction="up" delay={0}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 600,
                color: "#f1f5f9",
              }}
            >
              {title}
            </h2>
            <BadgePop delay={Math.round(fps * 0.5)}>
              <span style={{ marginRight: 4 }}>📊</span>
              Q1 2024
            </BadgePop>
          </div>
        </FadeSlideIn>
      </Sequence>

      {/* Main Content Grid */}
      <div style={{ display: "flex", gap: 40, flex: 1 }}>
        {/* Chart Section */}
        <Sequence from={Math.round(fps * 0.3)} durationInFrames={fps * 10} layout="none">
          <div style={{ flex: 1.5 }}>
            <FadeSlideIn direction="up" delay={0}>
              <div
                style={{
                  backgroundColor: "rgba(15, 23, 42, 0.6)",
                  borderRadius: 12,
                  border: "1px solid rgba(71, 85, 105, 0.5)",
                  padding: 24,
                }}
              >
                <BarChart
                  data={chartData}
                  title="Revenue by Location"
                  showValues={true}
                  staggerDelay={6}
                />
              </div>
            </FadeSlideIn>
          </div>
        </Sequence>

        {/* Executive Summary Section */}
        <Sequence from={Math.round(fps * 1)} durationInFrames={fps * 10} layout="none">
          <div style={{ flex: 1 }}>
            <FadeSlideIn direction="up" delay={0}>
              <div
                style={{
                  backgroundColor: "rgba(15, 23, 42, 0.6)",
                  borderRadius: 12,
                  border: "1px solid rgba(71, 85, 105, 0.5)",
                  padding: 24,
                }}
              >
                <h3
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Executive Summary
                </h3>
                <div>
                  {executiveSummary.map((bullet, i) => (
                    <ExecutiveBullet
                      key={i}
                      text={bullet.text}
                      delay={Math.round(fps * 0.3 * i)}
                    />
                  ))}
                </div>
              </div>
            </FadeSlideIn>
          </div>
        </Sequence>
      </div>

      {/* AI Summary */}
      <Sequence from={Math.round(fps * 2.5)} durationInFrames={fps * 10} layout="none">
        <FadeSlideIn direction="up" delay={0}>
          <div
            style={{
              marginTop: 24,
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              borderRadius: 12,
              padding: "16px 20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 18 }}>💡</span>
              <Typewriter
                text={aiSummary}
                charFrames={1}
                showCursor={true}
                style={{ color: "#22c55e", fontSize: 15, lineHeight: 1.6 }}
              />
            </div>
          </div>
        </FadeSlideIn>
      </Sequence>
    </AbsoluteFill>
  );
};
