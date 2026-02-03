# Step 1: Install Remotion
1) Create a Project Folder
2) Open the Folder in Cursor 
3) `npx create-video@latest .`
4) Install Dependencies: `npm i`
5) Start remotion server: `npm run dev`


# Step 2: Create Your First Animation
## Prompt 1: YouTube Intro
Create a 3 second intro video for a Youtube channel
  called "AI BUILDER SPACE".
  Requirements:
  - Resolution: 1920x1080
  - Frame rate: 30fps
  - Dark gradient background
  - Logo text "AI BUILDER SPACE" that fades in and
    scales up with a bounce
  - Subtle particle effects in the background



## Prompt 2: Notification Badge
Create a 3-second (90 frames at 30fps) animation
  of a notification badge. It should spring in from
  scale 0 to 1 with a bounce, show a number counting
  from 0 to 5, then fade out. Dark background (#111),
  white badge, red accent. 1080x1080.


■ Pro Tip: Enable Plan Mode in your AI agent. This lets the AI ask clarifying questions and create a plan before generating code — resulting in better outputs.


## Render a video
 ```sh
 npx remotion render
 ```

OR
### How to Render & Download
Once your animation is created, click the Render button in Remotion Studio. The video will be saved to your project folder as an MP4 file.


# Step 3: Write Better Prompts

The quality of your output depends on your prompt. Here's what to include for best results:
## ■ Must-Have Information 

### 1. Visual Design
• Colors (background, text, accents) — hex codes are ideal • Layout (centered card, full-screen, split view)
• Typography preferences (font size, weight)
• Overall style (minimal, playful, corporate, dark mode)
### 2. Animation Timing
• Total duration in frames or seconds
• When key animations should trigger (e.g., 'text appears at frame 20') • Sequence/order of animations
• Whether animations should be staggered or simultaneous
### 3. Animation Style
• Type of motion: spring (bouncy/natural) vs interpolate (linear/eased) • Easing preferences (smooth, snappy, bouncy)
• Specific physics if using springs (stiffness, damping)
### 4. Content & Data
• Text content, numbers, or data to display
• Whether values should be customizable via props
### 5. Dimensions
• Video size: 1080x1080 (square), 1920x1080 (landscape), 1080x1920 (portrait) • FPS: typically 30 or 60

## ■ Nice-to-Have
• Reference videos or images showing desired effect
• Specific SVG paths or shapes
• Font names (Google Fonts work well)
• Whether you need a schema for customizable props

■ Pro Tip: You don't have to write the prompt yourself! Paste this checklist along with your reference images, videos, or screenshots into your AI agent and ask it to help you craft the perfect Remotion prompt. The AI will fill in the details for you.


# Step 4: Recreate ANY Animation
Here's the secret trick: You don't need to be an animation expert to describe complex motions. Let AI do it for you.
## The Process
• 1. Find inspiration — Browse Dribbble, Mobbin, or any site with animations you like
• 2. Save the video — Download or screen-record the animation
• 3. Upload to Google AI Studio — Use Gemini to analyze the video
• 4. Use the reconstruction prompt — Gemini watches the video and writes a detailed prompt
• 5. Paste into your AI agent — Claude/Cursor recreates the animation in Remotion

## The Reconstruction Prompt
Copy this prompt and paste it into Google AI Studio along with your video:
```txt 
Analyze the attached UI animation for replication
  in Remotion.dev. I need a deep technical breakdown that
  covers the following 5 layers to ensure the generated
  code is production-ready.
  1. VISUAL SPECS (The Design System)
  - Colors: Extract specific Hex codes for backgrounds,
    accents, and text.
  - Typography: Font style (Serif/Sans), approximated
    weights, and tabular figures if numbers change.
  - Layout: Is it a centered card, full-screen, or
    split view?
  - Assets: Identify any SVGs, icons, or images needed.
  2. VIDEO CONFIGURATION (The Canvas)
  - Dimensions: (e.g., 1080x1080 Square, 1920x1080
    Landscape, or 1080x1920 Portrait).
  - FPS: (Standardize on 30fps unless the animation
    requires 60fps smoothness).
  - Duration: Estimated total frames or seconds.
  3. DATA & PROPS (The Schema)
  - What data is displayed? (Text headers, numbers,
    image URLs).
  - Define the zod schema: Which of these elements
    should be customizable props? (e.g., "Make the
    'Price' and 'User Avatar' dynamic props").
  4. ANIMATION LOGIC (The Choreography)
  - Breakdown by Frame (approximate):
    - [Frame 0-10]: Initial state.
    - [Frame 10-30]: Entry animation (Trigger).
    - [Frame 30-End]: Secondary effects.
  - Type of Motion:
    - Spring (Bouncy/Natural) -> Suggest Stiffness/
      Damping settings.
    - Interpolate (Linear/Eased) -> Suggest Input/
      Output ranges.
  5. THE REPLICATION PROMPT
  - Write a single, high-density prompt that I can
    paste into an AI coding assistant.
  - It must explicitly ask for a React Functional
    Component using remotion, zod, useCurrentFrame,
    and spring/interpolate based on the specs above.
```

## What's Next?
Once Google AI Studio analyzes your video and generates the replication prompt, copy that output and paste it into your AI coding agent (Cursor, Claude Code, or AntiGravity). The AI will then generate the actual Remotion code for your animation.
■ This works surprisingly well even on the first try. Iterate 2-3 times to perfect it.

### Example: Fintech Card Animation
Here's a complete prompt for recreating a professional fintech balance card animation. Use this as a template for your own complex animations:
```prompt
Create a React video component using Remotion to
  replicate a "Fintech Balance Chart" animation.
  ### 1. Component Structure
  - Create a main component <BalanceCard />
  - Use a zod schema to allow props: startValue (581),
    endValue (12456), duration (100 frames)
  - The card should be dark grey (#1C1C1E) on a
    black background
  ### 2. Animation Logic (useCurrentFrame)
  The animation duration is 100 frames.
  **The Chart (SVG):**
  - Create an SVG path describing a rising trend
  - Animate the drawing of the line using
    strokeDasharray and strokeDashoffset
  - Use interpolate on the current frame to drive
    the offset from full-length to 0
  **The Counter:**
  - Use interpolate to transition the number from
    startValue to endValue
  - Format the number as currency (USD) with commas
    and 2 decimals
  - IMPORTANT: Use font-variant-numeric: tabular-nums
    so the text doesn't shake while counting
  **The Dots (Sequence):**
  - Place 4-5 dots at specific points along the SVG path
  - Each dot should scale from 0 to 1
  - Stagger triggers (Dot 1 at frame 20, Dot 2 at 40)
  - Use spring physics (stiffness: 200, damping: 10)
    so they "pop" in
  ### 3. Styling
  - Use Tailwind classes or inline styles
  - The chart line should have a gradient fill below it
    (Green #4EE294 with opacity mask)
  - The dots should be white circles with a dark
border/ring
  ### 4. Output
  Provide the full code for BalanceCard.tsx and the
  Composition registration in index.tsx.
```

# Step 5: Add Voice to Animations

The Process
• 1. Generate voices with Eleven Labs — Create separate audio files for each character or element
• 2. Download the audio files — Save them as MP3 or WAV
• 3. Add to your project folder — Place them in a folder like /public/audio/
• 4. Reference in your prompt — Tell the AI which audio goes with which animation element
• 5. Iterate with Plan Mode — Refine the timing to sync audio with visuals


# Figma Integration
If you have Figma MCP installed, you can create animations directly from your designs:
• Copy the link to your Figma selection
• Paste it into your AI agent with a prompt like:
'I want to create a cool animation for this UI screen. Give me some ideas.' • The AI extracts all components, colors, and layout automatically
• It creates an implementation plan with animations
■ This is incredibly powerful for product demos — your Figma mockups come to life!

https://www.figma.com/design/A4yq0YjdCOG2N5bck19RV4/platform-d-1?node-id=1-13657&t=mS3cjAiEjepcedjS-4