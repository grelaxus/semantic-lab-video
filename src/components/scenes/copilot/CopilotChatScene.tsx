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
  typingDuration?: number; // Frames to show "..." typing indicator (for AI/grey messages) OR typing in input box (for user/green messages)
  typingSpeed?: number; // Frames per character for typing effect (for user/green messages in input box)
  clickDuration?: number; // Frames for Send button click animation (for user/green messages, default ~12 frames)
}

interface CopilotChatSceneProps {
  chatMessages: ChatMessage[];
}

// Brand green color for user (sender) bubbles
const BRAND_GREEN = "#00C853"; // Bright, saturated green - adjust if needed

// Blinking cursor component for input box
const BlinkingCursor: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame % 30, [0, 15, 30], [1, 0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height: 28, // Match font size (was 20)
        backgroundColor: BRAND_GREEN,
        opacity,
        marginLeft: 4,
        verticalAlign: "middle",
      }}
    />
  );
};

// ChatInputBox component for typing user messages
const ChatInputBox: React.FC<{
  text: string;
  startFrame: number;
  typingSpeed: number;
  clickDuration: number;
  onComplete: () => void; // Called when send animation completes
}> = ({ text, startFrame, typingSpeed, clickDuration, onComplete }) => {
  const frame = useCurrentFrame();

  // Calculate phases
  const typingDuration = text.length * typingSpeed;
  const sendClickStartFrame = startFrame + typingDuration;
  const sendClickEndFrame = sendClickStartFrame + clickDuration;
  const clearStartFrame = sendClickEndFrame;
  const clearDuration = 3; // Frames to clear/fade input

  // Phase 1: Typing in input box
  const isTyping = frame >= startFrame && frame < sendClickStartFrame;
  const typedChars = isTyping
    ? Math.min(text.length, Math.floor((frame - startFrame) / typingSpeed))
    : text.length;
  const displayedText = text.slice(0, typedChars);
  const showCursor = isTyping && typedChars < text.length;

  // Phase 2: Send button click animation with bounce/wiggle
  const isClicking = frame >= sendClickStartFrame && frame < sendClickEndFrame;
  const { fps } = useVideoConfig();
  
  // Use spring for bounce/wiggle effect
  const sendButtonSpring = spring({
    frame: isClicking ? frame - sendClickStartFrame : 0,
    fps,
    config: { stiffness: 300, damping: 15, mass: 0.8 }, // Bouncy
  });
  
  // Scale animation: bounce down then back up with wiggle
  const sendButtonScale = isClicking
    ? interpolate(
        sendButtonSpring,
        [0, 0.5, 1],
        [1, 0.88, 1.02], // Slight overshoot for bounce
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      )
    : 1;
  
  // Rotation wiggle for extra bounce feel
  const sendButtonRotate = isClicking
    ? interpolate(
        sendButtonSpring,
        [0, 0.5, 1],
        [0, -2, 1], // Slight rotation wiggle
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      )
    : 0;

  // Phase 3: Clear input (fade out)
  const isClearing = frame >= clearStartFrame && frame < clearStartFrame + clearDuration;
  const clearOpacity = isClearing
    ? interpolate(
        frame - clearStartFrame,
        [0, clearDuration],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 1;

  // Check if we should show the input box
  const shouldShow = frame >= startFrame && frame < clearStartFrame + clearDuration;

  // Call onComplete when send animation finishes
  if (frame >= sendClickEndFrame && frame < sendClickEndFrame + 1) {
    onComplete();
  }

  if (!shouldShow) return null;

  // Configurable margin from viewport edge
  const bottomMargin = 10;
  const horizontalMargin = 0;

  return (
    <div
      style={{
        position: "absolute",
        bottom: bottomMargin,
        right: horizontalMargin,
        left: horizontalMargin,
        display: "flex",
        justifyContent: "center", // Center horizontally
        opacity: clearOpacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          backgroundColor: "rgba(30, 41, 59, 0.9)",
          borderRadius: 12,
          padding: "16px 24px", // Reduced height (slimmer) - was 28px 36px
          maxWidth: 1400, // Increased length - was 1200
          width: "95%", // Increased length - was 90%
          border: "1px solid rgba(71, 85, 105, 0.5)",
        }}
      >
        {/* Input Field */}
        <div
          style={{
            flex: 1,
            color: "#e2e8f0",
            fontSize: 28, // Match chat bubble font size (was 15)
            fontFamily: "system-ui, -apple-system, sans-serif",
            minHeight: 32,
            display: "flex",
            alignItems: "center",
            lineHeight: 1.4, // Match chat bubble line height
          }}
        >
          {displayedText}
          {showCursor && <BlinkingCursor />}
        </div>

        {/* Send Button */}
        <button
          style={{
            padding: "12px 28px", // Adjusted for slimmer box (was 16px 32px)
            backgroundColor: BRAND_GREEN,
            border: "none",
            borderRadius: 10,
            color: "#fff",
            fontSize: 28, // Match chat bubble font size (was 22)
            fontWeight: 400, // Match chat bubble weight (was 700)
            cursor: "pointer",
            transform: `scale(${sendButtonScale}) rotate(${sendButtonRotate}deg)`,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

const TypingIndicator: React.FC<{
  delay: number;
  duration: number;
  isSender: boolean;
}> = ({ delay, duration, isSender }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Jelly physics: desynchronized scaleX and scaleY springs
  const scaleX = spring({
    frame: frame - delay,
    fps,
    config: { stiffness: 250, damping: 10 }, // Fast and stiff
  });

  const scaleY = spring({
    frame: frame - delay,
    fps,
    config: { stiffness: 180, damping: 12 }, // Slightly lazier
  });

  // Rotation wobble (diving board effect)
  const wobble = spring({
    frame: frame - delay,
    fps,
    from: isSender ? 5 : -5, // Start tilted toward anchor
    to: 0,
    config: { stiffness: 200, damping: 8 }, // Bouncy
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
        transform: `scale(${scaleX}, ${scaleY}) rotate(${wobble}deg)`,
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
            ? `rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm`
            : "bg-[#262626] rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm"
        }`}
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          backgroundColor: isSender ? BRAND_GREEN : undefined,
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
  typingSpeed?: number; // Frames per character (only for green user)
  showTypingAnimation?: boolean; // Whether to show typing animation
  horizontalMargin?: number; // Horizontal margin for width calculation
}> = ({
  text,
  isSender,
  startFrame,
  showRead = false,
  typingSpeed = 2,
  showTypingAnimation = false,
  horizontalMargin = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Jelly physics: desynchronized scaleX and scaleY springs for squash-and-stretch
  const scaleX = spring({
    frame: frame - startFrame,
    fps,
    config: { stiffness: 250, damping: 10 }, // Fast and stiff (reacts instantly)
  });

  const scaleY = spring({
    frame: frame - startFrame,
    fps,
    config: { stiffness: 180, damping: 12 }, // Slightly lazier (delayed reaction)
  });

  // Rotation wobble (diving board effect) - rotates from anchor point
  const wobble = spring({
    frame: frame - startFrame,
    fps,
    from: isSender ? 5 : -5, // Start tilted toward the anchor (tail)
    to: 0,
    config: { stiffness: 200, damping: 8 }, // Bouncy for visible wobble
  });

  const opacity = frame < startFrame ? 0 : 1;

  // User messages appear instantly in feed (no typing animation in bubble)
  // Text is typed in input box, then appears here after Send is clicked
  const displayedText = text;

  if (opacity === 0) return null;

  return (
    <div
      className={`flex flex-col ${isSender ? "items-end" : "items-start"}`}
      style={{ marginBottom: 24 }} // Increased spacing between bubbles (was mb-5 = 20px)
    >
      <div
        style={{
          opacity,
          transform: `scale(${scaleX}, ${scaleY}) rotate(${wobble}deg)`,
          transformOrigin: isSender ? "bottom right" : "bottom left",
        }}
      >
        <div
          className={`px-6 py-4 ${
            isSender
              ? `rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm`
              : "bg-[#262626] rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm"
          } text-white`}
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 28,
            fontWeight: 400,
            lineHeight: 1.4,
            display: "inline-block",
            maxWidth: `${width - (horizontalMargin || 0) * 2 - 64}px`, // Full width minus margins and padding
            whiteSpace: "normal", // Allow wrapping only when text exceeds maxWidth
            wordBreak: "normal",
            backgroundColor: isSender ? BRAND_GREEN : undefined,
          }}
        >
          {displayedText}
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

export const CopilotChatScene: React.FC<CopilotChatSceneProps> = ({
  chatMessages,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Configurable horizontal margin for the entire chat area
  const horizontalMargin = 0; // User can adjust this

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
          // Green user: finishes after typing in input box + send click + delay
          const prevTypingSpeed = prevMessage.typingSpeed || 2;
          const prevTypingDuration = prevMessage.text.length * prevTypingSpeed;
          const prevClickDuration = prevMessage.clickDuration || 12;
          const clearDuration = 3; // Frames to clear input
          prevFinishFrame += prevTypingDuration + prevClickDuration + clearDuration;
        } else {
          // Grey AI: shows "..." then instant text
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

      // For grey AI: check if showing "..." indicator
      if (!message.isSender) {
        const typingDuration = message.typingDuration || 20;
        if (frame >= startFrame && frame < startFrame + typingDuration) {
          return -1; // Showing typing indicator
        }
      }

      // For green user: check if typing in input box OR clicking send
      if (message.isSender) {
        const typingSpeed = message.typingSpeed || 2;
        const typingDuration = message.text.length * typingSpeed;
        const clickDuration = message.clickDuration || 12;
        const clearDuration = 3;
        const inputEndFrame = startFrame + typingDuration + clickDuration + clearDuration;
        if (frame >= startFrame && frame < inputEndFrame) {
          return i; // Currently typing in input box or clicking send
        }
      }
    }
    return null;
  };

  const currentTypingIndex = getCurrentTypingMessageIndex();

  // Vertical Stack Momentum: Calculate container bounce for each new message
  const calculateContainerOffset = () => {
    if (chatMessages.length === 0) return 0;

    // Estimate message height (including margin-bottom: 20px from mb-5)
    const estimatedMessageHeight = 60; // Approximate height per message
    
    // Track which messages have appeared and when
    const messageAppearFrames: number[] = [];
    for (let i = 0; i < chatMessages.length; i++) {
      const message = chatMessages[i];
      const startFrame = startFrames[i];
      
      if (message.isSender) {
        // User message: appears in the middle of send button animation (~40% through click)
        const typingSpeed = message.typingSpeed || 2;
        const typingDuration = message.text.length * typingSpeed;
        const clickDuration = message.clickDuration || 12;
        const messageAppearFrame = startFrame + typingDuration + Math.floor(clickDuration * 0.4);
        messageAppearFrames.push(messageAppearFrame);
      } else {
        // AI message: appears after "..." typing indicator
        const messageAppearFrame = startFrame + (message.typingDuration || 20);
        messageAppearFrames.push(messageAppearFrame);
      }
    }

    // Sum spring bounces for all messages that have appeared
    // Each spring animates the container up by one message height
    // Springs naturally settle, creating cumulative upward movement
    let totalOffset = 0;

    for (let i = 1; i < chatMessages.length; i++) {
      // Skip first message (i=0) as it doesn't cause bounce
      const appearFrame = messageAppearFrames[i];
      
      if (frame >= appearFrame) {
        // Calculate spring bounce for this message
        // Each spring moves container up by estimatedMessageHeight
        const bounceSpring = spring({
          frame: frame - appearFrame,
          fps,
          from: 0,
          to: -estimatedMessageHeight, // Negative = move UP
          config: {
            stiffness: 150, // High energy
            damping: 12, // Low friction (allows 2-3 bounces)
            mass: 1.2, // Heavier feel, slower oscillation
          },
        });

        // Accumulate: each message contributes its bounce
        // When settled, bounceSpring = -estimatedMessageHeight
        totalOffset += bounceSpring;
      }
    }

    return totalOffset;
  };

  const containerOffset = calculateContainerOffset();

  return (
    <AbsoluteFill
      className="bg-black flex flex-col justify-end relative"
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "80px 0 120px 0", // Removed horizontal padding, let horizontalMargin control it
      }}
    >
      <div
        className="w-full relative"
        style={{
          maxWidth: "100%",
          margin: "0 auto",
          paddingLeft: horizontalMargin,
          paddingRight: horizontalMargin,
        }}
      >
        {/* Container with vertical stack momentum */}
        <div
          style={{
            transform: `translateY(${containerOffset}px)`,
          }}
        >
          {chatMessages.map((message, index) => {
            const startFrame = startFrames[index];

            // Calculate when message appears in feed
            let messageAppearFrame: number;
            if (message.isSender) {
              // User message: appears in the middle of send button animation (~40% through click)
              // IMPORTANT: Must wait until typing is complete AND send button is being clicked
              const typingSpeed = message.typingSpeed || 2;
              const typingDuration = message.text.length * typingSpeed;
              const clickDuration = message.clickDuration || 12;
              messageAppearFrame = startFrame + typingDuration + Math.floor(clickDuration * 0.4);
            } else {
              // AI message: appears after "..." typing indicator
              messageAppearFrame = startFrame + (message.typingDuration || 20);
            }

            const showMessage = frame >= messageAppearFrame;

            if (!showMessage) return null;

            return (
              <div key={index}>
                <ChatBubble
                  text={message.text}
                  isSender={message.isSender}
                  startFrame={messageAppearFrame}
                  showRead={message.isSender && index === chatMessages.length - 1}
                  typingSpeed={message.typingSpeed || 2}
                  showTypingAnimation={false} // No typing animation in bubble
                  horizontalMargin={horizontalMargin}
                />
              </div>
            );
          })}

          {/* Typing indicator - only for grey AI (received messages) */}
          {chatMessages.map((message, index) => {
            if (message.isSender) return null; // No "..." for green user

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

        {/* Chat Input Box - shown when user is typing */}
        {chatMessages.map((message, index) => {
          if (!message.isSender) return null; // Only show for user messages

          const startFrame = startFrames[index];
          const typingSpeed = message.typingSpeed || 2;
          const clickDuration = message.clickDuration || 12;
          const isCurrentlyTyping = currentTypingIndex === index;

          if (!isCurrentlyTyping) return null;

          return (
            <ChatInputBox
              key={`input-${index}`}
              text={message.text}
              startFrame={startFrame}
              typingSpeed={typingSpeed}
              clickDuration={clickDuration}
              onComplete={() => {
                // This callback is called when send animation completes
                // The message will appear in feed automatically based on timing
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
