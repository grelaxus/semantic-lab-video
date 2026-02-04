import { AbsoluteFill, Sequence, useVideoConfig, interpolate, useCurrentFrame } from "remotion";
import { FadeSlideIn, Typewriter } from "../animations";

interface ChatInputSceneProps {
  placeholder?: string;
  typingText?: string;
  modelName?: string;
}

const BlinkingCursor: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame % 30, [0, 15, 30], [1, 0, 1]);

  return (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height: 20,
        backgroundColor: "#22c55e",
        opacity,
        marginLeft: 2,
      }}
    />
  );
};

export const ChatInputScene: React.FC<ChatInputSceneProps> = ({
  placeholder = "Ask about your practice data...",
  typingText = "Why is Central down?",
  modelName = "GPT-4 Turbo",
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        padding: 60,
        fontFamily: "system-ui, -apple-system, sans-serif",
        justifyContent: "flex-end",
      }}
    >
      {/* Previous context indicator */}
      <Sequence durationInFrames={fps * 10} layout="none">
        <FadeSlideIn direction="up" delay={0}>
          <div
            style={{
              color: "#64748b",
              fontSize: 13,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Viewing: Revenue Analysis Report
          </div>
        </FadeSlideIn>
      </Sequence>

      {/* Chat Input Area */}
      <Sequence from={Math.round(fps * 0.2)} durationInFrames={fps * 10} layout="none">
        <FadeSlideIn direction="up" delay={0}>
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              borderRadius: 16,
              border: "1px solid rgba(71, 85, 105, 0.5)",
              padding: 16,
            }}
          >
            {/* Input Field */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                backgroundColor: "rgba(30, 41, 59, 0.6)",
                borderRadius: 12,
                padding: "14px 18px",
                marginBottom: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <Sequence from={Math.round(fps * 0.5)} durationInFrames={fps * 5} layout="none">
                  <Typewriter
                    text={typingText}
                    charFrames={3}
                    showCursor={false}
                    style={{
                      color: "#e2e8f0",
                      fontSize: 15,
                    }}
                  />
                  <BlinkingCursor />
                </Sequence>
                <Sequence durationInFrames={Math.round(fps * 0.5)} layout="none">
                  <span style={{ color: "#64748b", fontSize: 15 }}>
                    {placeholder}
                  </span>
                </Sequence>
              </div>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#22c55e",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>

            {/* Model Selector */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Sequence from={Math.round(fps * 0.4)} durationInFrames={fps * 10} layout="none">
                <FadeSlideIn direction="up" delay={0}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#64748b", fontSize: 12 }}>Model:</span>
                    <span
                      style={{
                        color: "#94a3b8",
                        fontSize: 12,
                        fontWeight: 500,
                        padding: "4px 8px",
                        backgroundColor: "rgba(71, 85, 105, 0.3)",
                        borderRadius: 4,
                      }}
                    >
                      {modelName}
                    </span>
                  </div>
                </FadeSlideIn>
              </Sequence>

              <Sequence from={Math.round(fps * 0.5)} durationInFrames={fps * 10} layout="none">
                <FadeSlideIn direction="up" delay={0}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ color: "#64748b", fontSize: 12 }}>
                      ⌘K for commands
                    </span>
                  </div>
                </FadeSlideIn>
              </Sequence>
            </div>
          </div>
        </FadeSlideIn>
      </Sequence>
    </AbsoluteFill>
  );
};
