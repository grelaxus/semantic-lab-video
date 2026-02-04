import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { FadeSlideIn, Pulse } from "../animations";

interface AgentStatus {
  name: string;
  status: "active" | "waiting" | "complete";
  icon: string;
}

interface ProcessingSceneProps {
  userQuery?: string;
  agents?: AgentStatus[];
}

const StatusIcon: React.FC<{ status: AgentStatus["status"] }> = ({ status }) => {
  const colors = {
    active: "#22c55e",
    waiting: "#f59e0b",
    complete: "#3b82f6",
  };

  return (
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: colors[status],
      }}
    />
  );
};

const AgentCard: React.FC<{ agent: AgentStatus; delay: number }> = ({
  agent,
  delay,
}) => {
  return (
    <FadeSlideIn direction="left" delay={delay}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          backgroundColor: "rgba(30, 41, 59, 0.6)",
          borderRadius: 8,
          border: "1px solid rgba(71, 85, 105, 0.5)",
        }}
      >
        {agent.status === "active" ? (
          <Pulse pulseSpeed={0.12} minOpacity={0.5} maxOpacity={1}>
            <span style={{ fontSize: 20 }}>{agent.icon}</span>
          </Pulse>
        ) : (
          <span style={{ fontSize: 20 }}>{agent.icon}</span>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 500 }}>
            {agent.name}
          </div>
          <div
            style={{
              color: "#94a3b8",
              fontSize: 12,
              textTransform: "capitalize",
            }}
          >
            {agent.status === "active" ? "Processing..." : agent.status}
          </div>
        </div>
        <StatusIcon status={agent.status} />
      </div>
    </FadeSlideIn>
  );
};

export const ProcessingScene: React.FC<ProcessingSceneProps> = ({
  userQuery = "Show me total revenue by location for Q1 2024",
  agents = [
    { name: "Query Parser", status: "complete", icon: "🔍" },
    { name: "Data Retrieval", status: "active", icon: "📊" },
    { name: "Analysis Engine", status: "waiting", icon: "🧠" },
  ],
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
      {/* User Query (context) */}
      <Sequence durationInFrames={fps * 10} layout="none">
        <FadeSlideIn direction="down" delay={0}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
                borderRadius: 12,
                padding: "12px 20px",
                maxWidth: 400,
              }}
            >
              <p style={{ margin: 0, color: "#22c55e", fontSize: 14 }}>
                {userQuery}
              </p>
            </div>
          </div>
        </FadeSlideIn>
      </Sequence>

      {/* Processing indicator */}
      <Sequence from={Math.round(fps * 0.3)} durationInFrames={fps * 10} layout="none">
        <FadeSlideIn direction="up" delay={0}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <Pulse pulseSpeed={0.15}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                }}
              />
            </Pulse>
            <span style={{ color: "#94a3b8", fontSize: 14 }}>
              Analyzing your data...
            </span>
          </div>
        </FadeSlideIn>
      </Sequence>

      {/* Agent Status Panel */}
      <Sequence from={Math.round(fps * 0.5)} durationInFrames={fps * 10} layout="none">
        <div style={{ maxWidth: 320 }}>
          <FadeSlideIn direction="up" delay={0}>
            <div
              style={{
                color: "#64748b",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 12,
              }}
            >
              Agent Status
            </div>
          </FadeSlideIn>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {agents.map((agent, i) => (
              <AgentCard
                key={agent.name}
                agent={agent}
                delay={Math.round(fps * 0.2 * i)}
              />
            ))}
          </div>
        </div>
      </Sequence>

      {/* Data stream particles (decorative) */}
      <DataStreamParticles />
    </AbsoluteFill>
  );
};

// Decorative data stream effect
const DataStreamParticles: React.FC = () => {
  const { fps, width, height } = useVideoConfig();
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    startX: width * 0.7 + (i % 3) * 40,
    startY: height * 0.3 + i * 30,
    endX: width * 0.2,
    endY: height * 0.5,
  }));

  return (
    <Sequence from={Math.round(fps * 0.8)} durationInFrames={fps * 5} layout="none">
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {particles.map((p) => (
          <StreamParticle key={p.id} {...p} index={p.id} />
        ))}
      </div>
    </Sequence>
  );
};

import { interpolate, useCurrentFrame } from "remotion";

const StreamParticle: React.FC<{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  index: number;
}> = ({ startX, startY, endX, endY, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = index * 4;
  const duration = fps * 1.5;

  const progress = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const x = interpolate(progress, [0, 1], [startX, endX]);
  const y = interpolate(progress, [0, 1], [startY, endY]);
  const opacity = interpolate(progress, [0, 0.1, 0.8, 1], [0, 0.6, 0.6, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 4,
        height: 4,
        borderRadius: "50%",
        backgroundColor: "#22c55e",
        opacity,
        boxShadow: "0 0 8px rgba(34, 197, 94, 0.5)",
      }}
    />
  );
};
