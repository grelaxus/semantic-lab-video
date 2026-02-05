# Copilot Chat Animation Plan

Borrow chat bubble animations from the Uber composition (`src/components/scenes/uber/ChatScene.tsx`) and adapt them for the Business Performance Copilot UI. Focus on **Vertical Stack Momentum** and **Jelly/Elastic Physics** to convey intelligence and reasoning.

---

## Source Reference

**Uber Chat Implementation:**
- **File**: `src/components/scenes/uber/ChatScene.tsx`
- **Components**: `ChatBubble`, `TypingIndicator`, `ChatScene`
- **Documentation**: `docs/common-components-and-patterns.md` (lines 19-144)
- **Scenario spec**: `docs/scenarios/uber/3.followup-2-chat-bubbles-softening.md`

---

## Animation Patterns to Borrow

### 1. Vertical Stack Momentum (Container Bounce)

**Status**: Not yet implemented in Uber sample, but documented in `docs/common-components-and-patterns.md` (lines 30-69)

**What it does**: When a new message appears, the entire message container bounces upward (overshoots, rebounds, settles) like a spring-loaded platform.

**Implementation**:
```typescript
const scrollSpring = spring({
  frame: frame - delay,
  from: 0,
  to: -messageHeight, // Negative = move UP
  config: {
    stiffness: 150, // High energy
    damping: 12,    // Low friction (allows 2-3 bounces)
    mass: 1.2       // Heavier feel, slower oscillation
  }
});

// Apply to container wrapping all messages:
// <div style={{ transform: `translateY(${scrollSpring}px)` }}>
```

**For Copilot**: Implement this in the chat scene so the conversation feed "jumps" when AI responses appear, reinforcing the sense of active processing.

---

### 2. Jelly/Elastic Physics (Individual Bubbles)

**Status**: ✅ Implemented in Uber sample

**What it does**: Each bubble deforms like a soft body (squash/stretch + rotation wobble) when it appears.

#### A. Squash and Stretch (Desynchronized Scale)

**From Uber**: `ChatBubble` component (lines 145-156)

```typescript
// Separate springs for X and Y with different stiffness/damping
const scaleX = spring({
  frame: frame - startFrame,
  fps,
  config: { stiffness: 250, damping: 10 }, // Fast and stiff (reacts instantly)
});

const scaleY = spring({
  frame: frame - startFrame,
  fps,
  config: { stiffness: 180, damping: 12 }, // Slightly lazier (reacts with delay)
});
```

**Result**: Bubble distorts as it grows because X and Y reach 1.0 at different times.

#### B. Diving Board Effect (Rotation Wobble)

**From Uber**: `ChatBubble` component (lines 158-165)

```typescript
const wobble = spring({
  frame: frame - startFrame,
  fps,
  from: isSender ? 5 : -5, // Start tilted toward anchor (tail)
  to: 0,
  config: { stiffness: 200, damping: 8 }, // Bouncy for visible wobble
});

// Combined transform:
transform: `scale(${scaleX}, ${scaleY}) rotate(${wobble}deg)`
transformOrigin: isSender ? "bottom right" : "bottom left"
```

**Result**: The free end (opposite the tail) wiggles/flaps before settling, like a diving board.

---

## Design Specifications

### Color Change: Blue → Brand Green

**Current (Uber)**: `#007AFF` (Electric Blue) for sender bubbles  
**Target (Copilot)**: Brand green (bright, saturated green from Figma/image)

**Note**: Extract exact hex value from Figma design or use placeholder `#00C853` (Material Green) as starting point. Update all instances:
- `ChatBubble` background color (line 199)
- `TypingIndicator` background color (line 101)

**Image reference**: `/Users/racoon/.cursor/projects/Users-racoon-workspace-semantic-lab-video/assets/image-3a9334c7-3aef-4695-9195-95f0737d922f.png`

### Typography & Sizing (Keep from Uber)

**Font**:
- `fontFamily: "system-ui, -apple-system, sans-serif"`
- `fontSize: 28`
- `fontWeight: 400`
- `lineHeight: 1.4`

**Bubble Padding**:
- `px-6 py-4` (24px horizontal, 16px vertical)

**Border Radius** (iOS/Messenger style):
- **Sender (right)**: `rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm`
- **Receiver (left)**: `rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm`

**Max Width**: `90%` of canvas width (line 208 in Uber)

---

## Component Structure

### New File: `src/components/scenes/copilot/CopilotChatScene.tsx`

**Base structure** (copy from `ChatScene.tsx`):

```typescript
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
  delay: number;
  typingDuration?: number; // For AI (grey) messages
  typingSpeed?: number;     // For user (green) messages
}

interface CopilotChatSceneProps {
  chatMessages: ChatMessage[];
}

// TypingIndicator component (with brand green)
// ChatBubble component (with brand green + jelly physics)
// CopilotChatScene component (with vertical stack momentum)
```

---

## Implementation Checklist

### Phase 1: Core Components (Copy & Adapt)

- [ ] Copy `ChatBubble` from Uber → `CopilotChatScene.tsx`
  - [ ] Change `bg-[#007AFF]` → brand green (extract from Figma/image)
  - [ ] Keep all jelly physics (scaleX, scaleY, wobble)
  - [ ] Keep transformOrigin logic (bottom-right for sender, bottom-left for receiver)
  - [ ] Keep typography (fontSize: 28, fontWeight: 400, lineHeight: 1.4)

- [ ] Copy `TypingIndicator` from Uber → `CopilotChatScene.tsx`
  - [ ] Change `bg-[#007AFF]` → brand green
  - [ ] Keep jelly physics (scaleX, scaleY, wobble)
  - [ ] Keep pulsing dots animation (dot1Opacity, dot2Opacity, dot3Opacity)

- [ ] Copy `ChatScene` structure → `CopilotChatScene.tsx`
  - [ ] Keep `calculateStartFrames()` logic
  - [ ] Keep `getCurrentTypingMessageIndex()` logic
  - [ ] Keep message rendering loop

### Phase 2: Vertical Stack Momentum (New)

- [ ] Add container wrapper around message list
- [ ] Calculate message heights (or use fixed estimate ~60px per message)
- [ ] Implement `scrollSpring` for container `translateY`
- [ ] Trigger spring on each new message's `startFrame`
- [ ] Test bounce feels organic (2-3 oscillations, then settle)

### Phase 3: Integration

- [ ] Export `CopilotChatScene` from `src/components/scenes/copilot/index.ts` (or create)
- [ ] Add to composition (e.g., `CopilotDemo.tsx` or new composition)
- [ ] Test with sample messages:
  ```typescript
  chatMessages: [
    { text: "What was our total revenue for Q1 2023, broken down by location?", isSender: true, delay: 0, typingSpeed: 2 },
    { text: "Analyzing revenue data...", isSender: false, delay: 30, typingDuration: 40 },
    { text: "Q1 2023 revenue totaled $2.01 million, with Valley View leading at $0.63 million.", isSender: false, delay: 10, typingDuration: 20 },
  ]
  ```

---

## Physics Parameters Reference

| Effect | Parameter | Value | Notes |
|--------|-----------|-------|-------|
| **Squash/Stretch** | scaleX stiffness | 250 | Fast, reacts instantly |
| | scaleX damping | 10 | Low friction |
| | scaleY stiffness | 180 | Slightly lazier |
| | scaleY damping | 12 | Slightly more friction |
| **Wobble** | rotation stiffness | 200 | Bouncy |
| | rotation damping | 8 | Low damping = visible wobble |
| | rotation from | ±5° | Tilted toward anchor |
| **Stack Bounce** | container stiffness | 150 | High energy |
| | container damping | 12 | Low friction (2-3 bounces) |
| | container mass | 1.2 | Heavier feel |

---

## Testing Scenarios

### Scenario 1: Single User Message
- User types: "What was our total revenue for Q1 2023?"
- Expected: Green bubble appears with jelly physics (squash/stretch + wobble)
- No container bounce (first message)

### Scenario 2: AI Response (Typing Indicator → Message)
- AI shows "..." typing indicator (brand green, jelly physics)
- After delay, typing indicator disappears
- AI message appears instantly (grey bubble, jelly physics)
- Expected: Container bounces upward (vertical stack momentum)

### Scenario 3: Multi-Turn Conversation
- User message 1 → AI response 1 → User message 2 → AI response 2
- Expected: Each new message triggers container bounce
- Each bubble uses jelly physics independently
- Timing feels natural (no overlap, smooth transitions)

---

## Notes

- **Frame-based only**: All animations use `useCurrentFrame()` + `spring()` / `interpolate()`. No CSS transitions or Tailwind animation classes.
- **Transform order matters**: `scale()` then `rotate()` (scale first, rotate from anchor).
- **Transform origin**: Must match bubble tail position (bottom-right for sender, bottom-left for receiver).
- **Color extraction**: Use Figma MCP `get_variable_defs` or inspect the provided image to get exact brand green hex value.

---

## Related Files

- **Source**: `src/components/scenes/uber/ChatScene.tsx`
- **Documentation**: `docs/common-components-and-patterns.md`
- **Uber scenario**: `docs/scenarios/uber/3.followup-2-chat-bubbles-softening.md`
- **Remotion rules**: `.agents/skills/remotion-best-practices/rules/animations.md`
- **Brand green image**: `/Users/racoon/.cursor/projects/Users-racoon-workspace-semantic-lab-video/assets/image-3a9334c7-3aef-4695-9195-95f0737d922f.png`
