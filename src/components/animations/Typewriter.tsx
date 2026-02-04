import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface TypewriterProps {
  text: string;
  charFrames?: number;
  pauseAfter?: string;
  pauseSeconds?: number;
  cursorBlinkFrames?: number;
  showCursor?: boolean;
  style?: React.CSSProperties;
}

const getTypedText = ({
  frame,
  fullText,
  pauseAfter,
  charFrames,
  pauseFrames,
}: {
  frame: number;
  fullText: string;
  pauseAfter: string | undefined;
  charFrames: number;
  pauseFrames: number;
}): string => {
  if (!pauseAfter) {
    const typedChars = Math.min(fullText.length, Math.floor(frame / charFrames));
    return fullText.slice(0, typedChars);
  }

  const pauseIndex = fullText.indexOf(pauseAfter);
  const preLen =
    pauseIndex >= 0 ? pauseIndex + pauseAfter.length : fullText.length;

  let typedChars = 0;
  if (frame < preLen * charFrames) {
    typedChars = Math.floor(frame / charFrames);
  } else if (frame < preLen * charFrames + pauseFrames) {
    typedChars = preLen;
  } else {
    const postPhase = frame - preLen * charFrames - pauseFrames;
    typedChars = Math.min(
      fullText.length,
      preLen + Math.floor(postPhase / charFrames)
    );
  }
  return fullText.slice(0, typedChars);
};

const Cursor: React.FC<{
  frame: number;
  blinkFrames: number;
  symbol?: string;
}> = ({ frame, blinkFrames, symbol = "\u258C" }) => {
  const opacity = interpolate(
    frame % blinkFrames,
    [0, blinkFrames / 2, blinkFrames],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return <span style={{ opacity }}>{symbol}</span>;
};

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  charFrames = 2,
  pauseAfter,
  pauseSeconds = 0,
  cursorBlinkFrames = 16,
  showCursor = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pauseFrames = Math.round(fps * pauseSeconds);

  const typedText = getTypedText({
    frame,
    fullText: text,
    pauseAfter,
    charFrames,
    pauseFrames,
  });

  return (
    <span style={style}>
      <span>{typedText}</span>
      {showCursor && <Cursor frame={frame} blinkFrames={cursorBlinkFrames} />}
    </span>
  );
};
