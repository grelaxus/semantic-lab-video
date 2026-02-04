# Common Components & Patterns

Reusable animation patterns used across Remotion compositions. This doc describes the physics and implementation details so the same feel can be applied consistently or extended elsewhere.

---

## Uber sample (where to see these patterns)

| What | Where |
|------|--------|
| **Composition** | Remotion Studio → composition **`UberRideFlow`** (1080×1080, 22s) |
| **Chat scene (Scene 1)** | Frames 0–210; contains the bubble physics described below |
| **Source** | `src/components/scenes/UberRideFlow.tsx` → `<ChatScene>` |
| **Chat implementation** | `src/components/scenes/uber/ChatScene.tsx` — `ChatBubble`, `TypingIndicator`, `ChatScene` |
| **Scenario spec** | `docs/scenarios/uber/3.followup-2-chat-bubbles-softening.md` |

---

## Chat bubble physics: vertical stack momentum & jelly deformation

Two distinct physical forces create an "organic" chat feel:

1. **Vertical Stack Momentum** — the feed jumping when a new message appears (container bounce).
2. **Jelly/Elastic Physics** — individual bubbles deforming like soft bodies (squash/stretch + rotation wobble).

Bubbles are treated as **soft bodies** (like gelatin) that react to force, not solid blocks.

---

## 1. The Container Physics: "The Reverse Gravity Bounce"

### Observation

The conversation doesn’t just slide up; it behaves like a spring-loaded platform. When a new message is added at the bottom, the whole stack is "kicked" upward, overshoots, then settles.

### Mechanics

- Animate the **entire message container** with `translateY`, not the `top`/`margin` of the new message.
- **State A:** Container at Y = 0.
- **Trigger:** New message arrives (e.g. height ~60px).
- **Kick:** Container shifts to make room; we animate the *correction*.
- **Spring:**
  - **Overshoot:** Move UP by ~70px (overshoot the 60px height).
  - **Rebound:** Fall back to ~55px.
  - **Settle:** Rest at 60px.

### Remotion implementation

Use a spring with **low damping** and **higher mass** so the stack bounces 2–3 times:

```javascript
const scrollSpring = spring({
  frame: frame - delay,
  from: 0,
  to: -messageHeight, // Negative = move UP
  config: {
    stiffness: 150, // High energy
    damping: 12,    // Low friction (allows 2–3 bounces)
    mass: 1.2       // Heavier feel, slower oscillation
  }
});

// Apply to the container wrapping all messages:
// <div style={{ transform: `translateY(${scrollSpring}px)` }}>
```

### Status

**Not yet implemented** in the [Uber sample](#uber-sample-where-to-see-these-patterns) chat scene. The chat feed is static; only the individual bubbles use jelly + wobble. To add this, wrap the message list in `ChatScene` in a container and drive its `translateY` with the spring above, keyed to each new message’s `delay` (or equivalent trigger).

---

## 2. The "Diving Board" Effect (The Wiggle)

### Observation

The bubble appears to wiggle on the "free" end (e.g. right for received, left for sent) while the tail (anchor) stays in place.

### Mechanics

- **Anchor:** The speech-bubble tail is the pivot (e.g. bottom-left for received, bottom-right for sent).
- **Force:** As the bubble scales up, energy travels from anchor to the opposite side.
- **Wiggle:** The free end has rotational inertia: it "flaps" or rotates slightly before settling.

So we need **rotation** in addition to scale, with `transformOrigin` set to the tail.

### Remotion implementation (Uber sample)

**Location:** `src/components/scenes/uber/ChatScene.tsx` — used by the [Uber sample](#uber-sample-where-to-see-these-patterns) in components `ChatBubble` and `TypingIndicator`.

- **Pivot:** `transformOrigin: "bottom left"` (received) or `"bottom right"` (sent).
- **Rotation spring:** Start tilted toward the anchor, then settle at 0°.
  - Received (grey): `from: -5` (tilted down-left).
  - Sent (blue): `from: 5` (tilted down-right).
  - `to: 0`, config tuned for a visible wobble.

```javascript
const wobble = spring({
  frame: frame - startFrame,  // or frame - delay for typing indicator
  fps,
  from: isSender ? 5 : -5,   // Direction depends on which side has the tail
  to: 0,
  config: { stiffness: 200, damping: 8 }  // Bouncy
});

// Combined with scale (see below):
// transform: `scale(${scaleX}, ${scaleY}) rotate(${wobble}deg)`
// transformOrigin: isSender ? "bottom right" : "bottom left"
```

### Squash and stretch (jelly deformation)

So the bubble doesn’t scale uniformly, we use **separate springs for X and Y** with different stiffness/damping. They reach 1.0 at different times, which gives a short squash-and-stretch.

- **scaleX:** Faster, stiffer — reacts first.
- **scaleY:** Slightly slower, softer — follows with a small delay.

```javascript
const scaleX = spring({
  frame: frame - startFrame,
  fps,
  config: { stiffness: 250, damping: 10 },  // Fast and stiff
});

const scaleY = spring({
  frame: frame - startFrame,
  fps,
  config: { stiffness: 180, damping: 12 }, // Slightly lazier
});

// Single transform (order matters: scale then rotate from anchor):
transform: `scale(${scaleX}, ${scaleY}) rotate(${wobble}deg)`
```

### Summary of what’s in use (Uber sample)

| Effect              | Implemented in (Uber)       | Key parameters                                                                 |
|---------------------|-----------------------------|---------------------------------------------------------------------------------|
| Diving board wobble | `ChatBubble`, `TypingIndicator` in `ChatScene.tsx` | `from: ±5`, `to: 0`, `stiffness: 200`, `damping: 8`, `transformOrigin` at tail |
| Squash and stretch  | Same                        | `scaleX`: 250/10, `scaleY`: 180/12                                             |
| Reverse gravity     | Not yet                     | Spec above: container `translateY` spring, stiffness 150, damping 12, mass 1.2  |

**References:** Uber composition `UberRideFlow` in `src/Root.tsx`; chat scene source `src/components/scenes/uber/ChatScene.tsx`; scenario spec `docs/scenarios/uber/3.followup-2-chat-bubbles-softening.md`.
