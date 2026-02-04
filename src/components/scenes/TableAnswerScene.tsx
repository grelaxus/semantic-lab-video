import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { FadeSlideIn, TableCascade, Typewriter, BadgePop, Highlight } from "../animations";

interface TableAnswerSceneProps {
  title?: string;
  headers?: string[];
  rows?: { cells: (string | number)[] }[];
  aiSummary?: string;
  highlightWord?: string;
  confidencePercent?: number;
  rowCount?: number;
}

export const TableAnswerScene: React.FC<TableAnswerSceneProps> = ({
  title = "Dynamic Table",
  headers = ["Location", "Revenue", "Growth"],
  rows = [
    { cells: ["Valley View", "$2,010,000", "+12%"] },
    { cells: ["Oak Grove", "$1,800,000", "+8%"] },
    { cells: ["Central", "$1,200,000", "-8%"] },
    { cells: ["Westside", "$1,450,000", "+5%"] },
    { cells: ["Downtown", "$980,000", "+3%"] },
  ],
  aiSummary = "Q1 revenue totaled $8.4M across 5 locations. Valley View leads at $2.01M (+12% YoY).",
  highlightWord = "Valley View",
  confidencePercent = 99,
  rowCount = 15,
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
      {/* Card Header */}
      <Sequence durationInFrames={fps * 10} layout="none">
        <FadeSlideIn direction="up" delay={0}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 600,
                color: "#f1f5f9",
              }}
            >
              {title}
            </h2>
            <div style={{ display: "flex", gap: 12 }}>
              <BadgePop delay={Math.round(fps * 0.8)}>
                <span style={{ marginRight: 4 }}>✓</span>
                {confidencePercent}% confidence
              </BadgePop>
              <BadgePop
                delay={Math.round(fps * 1)}
                backgroundColor="rgba(59, 130, 246, 0.2)"
                textColor="#3b82f6"
              >
                {rowCount} rows
              </BadgePop>
            </div>
          </div>
        </FadeSlideIn>
      </Sequence>

      {/* Table */}
      <Sequence from={Math.round(fps * 0.3)} durationInFrames={fps * 10} layout="none">
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            borderRadius: 12,
            border: "1px solid rgba(71, 85, 105, 0.5)",
            overflow: "hidden",
          }}
        >
          <TableCascade headers={headers} rows={rows} staggerFrames={4} />
        </div>
      </Sequence>

      {/* Pagination */}
      <Sequence from={Math.round(fps * 1.5)} durationInFrames={fps * 10} layout="none">
        <FadeSlideIn direction="up" delay={0}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 12,
              color: "#64748b",
              fontSize: 13,
            }}
          >
            Page 1 of 38
          </div>
        </FadeSlideIn>
      </Sequence>

      {/* AI Summary */}
      <Sequence from={Math.round(fps * 2)} durationInFrames={fps * 10} layout="none">
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
              <span style={{ fontSize: 18 }}>🤖</span>
              <div style={{ flex: 1 }}>
                <Sequence durationInFrames={fps * 3} layout="none">
                  <Typewriter
                    text={aiSummary}
                    charFrames={1}
                    showCursor={true}
                    style={{ color: "#22c55e", fontSize: 15, lineHeight: 1.6 }}
                  />
                </Sequence>
                <Sequence from={Math.round(fps * 3)} durationInFrames={fps * 5} layout="none">
                  <Highlight
                    text={aiSummary}
                    highlightWord={highlightWord}
                    delay={0}
                    style={{ color: "#22c55e", fontSize: 15, lineHeight: 1.6 }}
                  />
                </Sequence>
              </div>
            </div>
          </div>
        </FadeSlideIn>
      </Sequence>

      {/* Action Buttons */}
      <Sequence from={Math.round(fps * 3.5)} durationInFrames={fps * 10} layout="none">
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <FadeSlideIn direction="up" delay={0}>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "rgba(34, 197, 94, 0.2)",
                border: "1px solid rgba(34, 197, 94, 0.4)",
                borderRadius: 8,
                color: "#22c55e",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Show Summary
            </button>
          </FadeSlideIn>
          <FadeSlideIn direction="up" delay={5}>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                border: "1px solid rgba(59, 130, 246, 0.4)",
                borderRadius: 8,
                color: "#3b82f6",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Deep Analysis
            </button>
          </FadeSlideIn>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
