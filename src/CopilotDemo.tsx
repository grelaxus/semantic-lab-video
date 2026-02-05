import { useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import {
  CopilotChatScene,
  ProcessingScene,
  TableAnswerScene,
  ChartAnswerScene,
  ChatInputScene,
} from "./components/scenes";

/**
 * CopilotDemo - Main composition showcasing the Chat-with-Data Copilot UI
 * 
 * Scene order (per plan):
 * 1. Opening: Header + subtitle + user query bubble
 * 2. Processing: Agent Status icons pulse + data-stream hint
 * 3. First answer: Table rows cascade + AI summary typewriter
 * 4. Second block: Chart with bars growing in + Executive Summary
 * 5. Chat input: Follow-up query typing
 * 
 * Uses TransitionSeries for smooth fade/slide between scenes.
 */
export const CopilotDemo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Scene durations (in seconds, converted to frames)
  // Increased duration to show full chat animation sequence
  const headerDuration = Math.round(fps * 8); // Increased from 4s to 8s to see full animation
  const processingDuration = Math.round(fps * 3);
  const tableDuration = Math.round(fps * 6);
  const chartDuration = Math.round(fps * 5);
  const chatInputDuration = Math.round(fps * 3);

  // Transition duration
  const transitionDuration = Math.round(fps * 0.5);

  return (
    <TransitionSeries>
      {/* Scene 1: Chat Conversation with Brand Green Bubbles */}
      <TransitionSeries.Sequence durationInFrames={headerDuration}>
        <CopilotChatScene
          chatMessages={[
            {
              text: "Show me total revenue by location for Q1 2024",
              isSender: true,
              delay: 0,
              typingSpeed: 2,
              clickDuration: 20, // Frames for send button bounce animation
            },
            {
              text: "Analyzing revenue data...",
              isSender: false,
              delay: 30,
              typingDuration: 40,
            },
            {
              text: "Q1 2024 revenue totaled $8.4M across 5 locations. Valley View leads at $2.01M (+12% YoY). Central underperformed by 8%—recommend reviewing operations.",
              isSender: false,
              delay: 10,
              typingDuration: 20,
            },
          ]}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionDuration })}
      />

      {/* Scene 2: Processing / Thinking */}
      <TransitionSeries.Sequence durationInFrames={processingDuration}>
        <ProcessingScene
          userQuery="Show me total revenue by location for Q1 2024"
          agents={[
            { name: "Query Parser", status: "complete", icon: "🔍" },
            { name: "Data Retrieval", status: "active", icon: "📊" },
            { name: "Analysis Engine", status: "waiting", icon: "🧠" },
          ]}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: transitionDuration })}
      />

      {/* Scene 3: First Answer - Table */}
      <TransitionSeries.Sequence durationInFrames={tableDuration}>
        <TableAnswerScene
          title="Revenue by Location"
          headers={["Location", "Revenue", "Growth", "Collection Rate"]}
          rows={[
            { cells: ["Valley View", "$2,010,000", "+12%", "92%"] },
            { cells: ["Oak Grove", "$1,800,000", "+8%", "89%"] },
            { cells: ["Westside", "$1,450,000", "+5%", "87%"] },
            { cells: ["Central", "$1,200,000", "-8%", "72%"] },
            { cells: ["Downtown", "$980,000", "+3%", "85%"] },
          ]}
          aiSummary="Q1 revenue totaled $8.4M across 5 locations. Valley View leads at $2.01M (+12% YoY). Central underperformed by 8%—recommend reviewing operations."
          highlightWord="Valley View"
          confidencePercent={99}
          rowCount={15}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionDuration })}
      />

      {/* Scene 4: Second Answer - Chart */}
      <TransitionSeries.Sequence durationInFrames={chartDuration}>
        <ChartAnswerScene
          title="Revenue Analysis Report"
          chartData={[
            { label: "Valley View", value: 2010000, color: "#22c55e" },
            { label: "Oak Grove", value: 1800000, color: "#3b82f6" },
            { label: "Westside", value: 1450000, color: "#8b5cf6" },
            { label: "Central", value: 1200000, color: "#f59e0b" },
            { label: "Downtown", value: 980000, color: "#ec4899" },
          ]}
          executiveSummary={[
            { text: "Total Q1 revenue: $8.4M across all locations" },
            { text: "Valley View outperforms by 12% year-over-year" },
            { text: "Central shows 8% decline—collection issues detected" },
            { text: "Practice-wide collection rate: 87%" },
          ]}
          aiSummary="Revenue distribution shows strong suburban performance. Central's $48K collection gap warrants immediate attention on denied claims."
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: transitionDuration })}
      />

      {/* Scene 5: Follow-up Chat Input */}
      <TransitionSeries.Sequence durationInFrames={chatInputDuration}>
        <ChatInputScene
          placeholder="Ask about your practice data..."
          typingText="Why is Central down?"
          modelName="GPT-4 Turbo"
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
