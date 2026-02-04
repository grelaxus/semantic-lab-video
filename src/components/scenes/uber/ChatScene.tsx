import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface ChatMessage {
  text: string;
  isSender: boolean;
  delay: number; // Delay in frames after previous message finishes typing
  typingDuration?: number; // Frames to show "..." typing indicator (for grey user only)
  typingSpeed?: number; // Frames per character for typing effect (for blue user only)
}

interface ChatSceneProps {
  chatMessages: ChatMessage[];
}

const TypingIndicator: React.FC<{
  delay: number;
  duration: number;
  isSender: boolean;
}> = ({ delay, duration, isSender }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for bubble appearance
  const scale = spring({
    frame: frame - delay,
    fps,
    config: { stiffness: 300, damping: 15, mass: 0.8 },
  });

  // Scale with overshoot (1.05) then settle to 1.0
  const finalScale = interpolate(scale, [0, 0.95, 1], [0, 1.05, 1], {
    extrapolateRight: "clamp",
  });

  // Pulsing dots animation
  const dot1Opacity = interpolate(
    frame - delay,
    [0, 10, 20, 30],
    [0.3, 1, 0.3, 0.3],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const dot2Opacity = interpolate(
    frame - delay,
    [0, 10, 20, 30],
    [0.3, 0.3, 1, 0.3],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const dot3Opacity = interpolate(
    frame - delay,
    [0, 10, 20, 30],
    [0.3, 0.3, 0.3, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const opacity = frame < delay ? 0 : frame >= delay + duration ? 0 : 1;

  if (opacity === 0) return null;

  // Position absolutely at bottom of chat area, aligned with message side
  return (
    <div
      className={`absolute bottom-0 ${isSender ? "right-0" : "left-0"} flex ${isSender ? "justify-end" : "justify-start"} w-full`}
      style={{
        opacity,
        transform: `scale(${finalScale})`,
        transformOrigin: isSender ? "bottom right" : "bottom left",
        pointerEvents: "none",
        paddingLeft: isSender ? 0 : "32px",
        paddingRight: isSender ? "32px" : 0,
        maxWidth: "100%",
      }}
    >
      <div
        className={`px-5 py-3 ${
          isSender
            ? "bg-[#007AFF] rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm"
            : "bg-[#262626] rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm"
        }`}
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div className="flex gap-1.5">
          <div
            className="w-2 h-2 rounded-full bg-white"
            style={{ opacity: dot1Opacity }}
          />
          <div
            className="w-2 h-2 rounded-full bg-white"
            style={{ opacity: dot2Opacity }}
          />
          <div
            className="w-2 h-2 rounded-full bg-white"
            style={{ opacity: dot3Opacity }}
          />
        </div>
      </div>
    </div>
  );
};

const ChatBubble: React.FC<{
  text: string;
  isSender: boolean;
  startFrame: number;
  showRead?: boolean;
  typingSpeed?: number; // Frames per character (only for blue user)
  showTypingAnimation?: boolean; // Whether to show typing animation
}> = ({
  text,
  isSender,
  startFrame,
  showRead = false,
  typingSpeed = 2,
  showTypingAnimation = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Spring animation with overshoot
  const springValue = spring({
    frame: frame - startFrame,
    fps,
    config: { stiffness: 300, damping: 15, mass: 0.8 },
  });

  // Scale with overshoot (1.05) then settle to 1.0
  const scale = interpolate(springValue, [0, 0.95, 1], [0, 1.05, 1], {
    extrapolateRight: "clamp",
  });

  const opacity = frame < startFrame ? 0 : 1;

  // Typing effect: only for blue user (isSender), and only when actively typing
  let displayedText = text;
  let showCursor = false;

  if (isSender && showTypingAnimation && frame >= startFrame) {
    const framesSinceStart = frame - startFrame;
    const charactersToShow = Math.min(
      text.length,
      Math.floor(framesSinceStart / typingSpeed)
    );
    displayedText = text.slice(0, charactersToShow);
    showCursor = charactersToShow < text.length;
  }

  if (opacity === 0) return null;

  return (
    <div
      className={`flex flex-col ${isSender ? "items-end" : "items-start"} mb-5`}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          transformOrigin: isSender ? "bottom right" : "bottom left",
        }}
      >
        <div
          className={`px-6 py-4 ${
            isSender
              ? "bg-[#007AFF] rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm"
              : "bg-[#262626] rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm"
          } text-white`}
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 28,
            fontWeight: 400,
            lineHeight: 1.4,
            display: "inline-block",
            maxWidth: `${width * 0.9}px`, // 90% of canvas width - wraps only when absolutely necessary
            whiteSpace: "normal", // Allow wrapping only when text exceeds maxWidth
            wordBreak: "normal",
          }}
        >
          {displayedText}
          {showCursor && <span style={{ opacity: 0.5 }}>|</span>}
        </div>
      </div>
      {isSender &&
        showRead &&
        frame >=
          startFrame +
            (showTypingAnimation ? text.length * typingSpeed : 0) +
            5 && (
          <div
            style={{
              fontSize: 14,
              color: "#999",
              marginTop: 4,
              marginRight: 8,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            Read
          </div>
        )}
    </div>
  );
};

export const ChatScene: React.FC<ChatSceneProps> = ({ chatMessages }) => {
  const frame = useCurrentFrame();

  // Calculate actual start frames based on previous message completion + delay
  const calculateStartFrames = () => {
    const startFrames: number[] = [];
    let currentFrame = 0;

    for (let i = 0; i < chatMessages.length; i++) {
      const message = chatMessages[i];
      const prevMessage = i > 0 ? chatMessages[i - 1] : null;

      if (prevMessage) {
        // Calculate when previous message finished typing
        let prevFinishFrame = startFrames[i - 1];

        if (prevMessage.isSender) {
          // Blue user: finishes after typing animation
          const prevTypingSpeed = prevMessage.typingSpeed || 2;
          prevFinishFrame += prevMessage.text.length * prevTypingSpeed;
        } else {
          // Grey user: shows "..." then instant text
          const prevTypingDuration = prevMessage.typingDuration || 20;
          prevFinishFrame += prevTypingDuration; // "..." duration
        }

        // Add delay after previous message finishes
        currentFrame = prevFinishFrame + message.delay;
      } else {
        // First message starts at its delay
        currentFrame = message.delay;
      }

      startFrames.push(currentFrame);
    }

    return startFrames;
  };

  const startFrames = calculateStartFrames();

  // Find which message is currently being typed
  const getCurrentTypingMessageIndex = () => {
    for (let i = 0; i < chatMessages.length; i++) {
      const message = chatMessages[i];
      const startFrame = startFrames[i];

      // For grey user: check if showing "..." indicator
      if (!message.isSender) {
        const typingDuration = message.typingDuration || 20;
        if (frame >= startFrame && frame < startFrame + typingDuration) {
          return -1; // Showing typing indicator
        }
      }

      // For blue user: check if actively typing
      if (message.isSender) {
        const typingSpeed = message.typingSpeed || 2;
        const typingEndFrame = startFrame + message.text.length * typingSpeed;
        if (frame >= startFrame && frame < typingEndFrame) {
          return i;
        }
      }
    }
    return null;
  };

  const currentTypingIndex = getCurrentTypingMessageIndex();

  return (
    <AbsoluteFill
      className="bg-black flex flex-col justify-end relative"
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "80px 32px 120px 32px",
      }}
    >
      <div className="w-full max-w-2xl mx-auto relative">
        {chatMessages.map((message, index) => {
          const startFrame = startFrames[index];
          const isCurrentlyTyping = currentTypingIndex === index;
          const typingSpeed = message.typingSpeed || 2;

          // Grey user: show "..." then instant text
          // Blue user: show typing animation, no "..."
          const showTypingAnimation =
            message.isSender && isCurrentlyTyping;
          const showMessage =
            !message.isSender
              ? frame >= startFrame + (message.typingDuration || 20)
              : frame >= startFrame;

          if (!showMessage) return null;

          return (
            <div key={index}>
              <ChatBubble
                text={message.text}
                isSender={message.isSender}
                startFrame={
                  message.isSender
                    ? startFrame
                    : startFrame + (message.typingDuration || 20)
                }
                showRead={message.isSender && index === chatMessages.length - 1}
                typingSpeed={typingSpeed}
                showTypingAnimation={showTypingAnimation}
              />
            </div>
          );
        })}

        {/* Typing indicator - only for grey user (received messages) */}
        {chatMessages.map((message, index) => {
          if (message.isSender) return null; // No "..." for blue user

          const startFrame = startFrames[index];
          const typingDuration = message.typingDuration || 20;
          const isTypingActive =
            frame >= startFrame && frame < startFrame + typingDuration;

          if (!isTypingActive) return null;

          return (
            <TypingIndicator
              key={`typing-${index}`}
              delay={startFrame}
              duration={typingDuration}
              isSender={false}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
