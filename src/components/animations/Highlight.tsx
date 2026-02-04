import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface HighlightProps {
  text: string;
  highlightWord: string;
  color?: string;
  delay?: number;
  durationInFrames?: number;
  style?: React.CSSProperties;
}

const HighlightSpan: React.FC<{
  word: string;
  color: string;
  delay: number;
  durationInFrames: number;
}> = ({ word, color, delay, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const highlightProgress = spring({
    fps,
    frame,
    config: { damping: 200 },
    delay,
    durationInFrames,
  });
  const scaleX = Math.max(0, Math.min(1, highlightProgress));

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: "1.05em",
          transform: `translateY(-50%) scaleX(${scaleX})`,
          transformOrigin: "left center",
          backgroundColor: color,
          borderRadius: "0.18em",
          zIndex: 0,
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{word}</span>
    </span>
  );
};

export const Highlight: React.FC<HighlightProps> = ({
  text,
  highlightWord,
  color = "rgba(34, 197, 94, 0.3)",
  delay = 0,
  durationInFrames = 18,
  style,
}) => {
  const highlightIndex = text.indexOf(highlightWord);
  const hasHighlight = highlightIndex >= 0;
  const preText = hasHighlight ? text.slice(0, highlightIndex) : text;
  const postText = hasHighlight
    ? text.slice(highlightIndex + highlightWord.length)
    : "";

  return (
    <span style={style}>
      {hasHighlight ? (
        <>
          <span>{preText}</span>
          <HighlightSpan
            word={highlightWord}
            color={color}
            delay={delay}
            durationInFrames={durationInFrames}
          />
          <span>{postText}</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </span>
  );
};
