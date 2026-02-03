---
name: Copilot UI Animation Ideas
overview: Animation ideas for the "Business Performance Copilot" Figma screen that convey intelligence and reasoning, implemented in Remotion with frame-based animations, sequencing, and optional transitions.
todos: []
isProject: false
---

# Animation Ideas for Chat-with-Data Copilot UI

Based on the [Figma screen](https://www.figma.com/design/A4yq0YjdCOG2N5bck19RV4/platform-d-1?node-id=14-23648) (Business Performance Copilot: header, query bubbles, tables, bar chart, AI summaries, Agent Status, chat input), here are focused ideas that signal **intelligence** and **reasoning**.

---

## Context Limitations Note

The Figma design (1920×4561px, ~134KB XML) exceeds MCP context limits. **Workaround**: call `get_design_context` on specific sublayers (nodeIds) rather than the full frame. Key sublayers to fetch separately if needed:

- `14:23726` – Dynamic Table card
- `14:23921` – Revenue Analysis Report (chart + summary)
- `14:24145` – Patients - No Return table
- `14:24293` – Right sidebar (Quick Actions + Agent Status)
- `14:24278` – Chat input area

---

## 1. Reasoning / “Thinking” Cues


| Idea                      | What it does                                                                                                                                                  | Why it reads as smart                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **Agent Status pulse**    | Planning Phase / Budget Tracking icons gently pulse or glow (opacity/scale via `interpolate` or `spring`)                                                     | Suggests active processing without being noisy. |
| **Data-stream particles** | Subtle dots or lines flowing from “data source” toward the table/chart (reuse pattern from [Composition.tsx](src/Composition.tsx) particles, but directional) | Implies data being pulled and analyzed.         |
| **Connecting lines**      | Short lines that draw in (stroke-dashoffset or clip-path) between “user question” and “AI response” or between “Quick Actions” and the main content           | Makes the link between ask → answer visible.    |


All driven by `useCurrentFrame()` and `fps` per [animations rule](.agents/skills/remotion-best-practices/rules/animations.md); no CSS transitions.

---

## 2. Data “Being Discovered”


| Idea                   | What it does                                                                                                             | Why it reads as smart                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| **Table rows cascade** | Rows appear one-by-one (or in small groups) with a short stagger using `<Sequence>` and `from={i * N}`                   | Feels like results streaming in as the system “finds” them. |
| **Numbers count up**   | Key metrics (Total Revenue, etc.) animate from 0 (or a seed) to final value with `interpolate(frame, [...], [0, value])` | Emphasizes the AI computing and surfacing a number.         |
| **Chart bars grow in** | Bar chart segments animate from 0 to full length, optionally staggered by series (e.g. Payments then Charges)            | Feels like the model “building” the insight.                |


Use [Sequence](.agents/skills/remotion-best-practices/rules/sequencing.md) for row/chunk timing; keep durations short (e.g. 0.5–1.5s per row/bar) so it doesn’t feel slow.

---

## 3. Insights “Being Synthesized”


| Idea                         | What it does                                                                                                                                                                  | Why it reads as smart                            |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **AI summary typewriter**    | Green summary sentence reveals character-by-character (string slice + optional cursor) per [text-animations](.agents/skills/remotion-best-practices/rules/text-animations.md) | Reads as the AI “writing” the conclusion.        |
| **Word highlight sweep**     | Highlighter-style reveal over key phrases (e.g. “Valley View”, “$2.01 million”) after the sentence is visible                                                                 | Draws attention to what the AI deemed important. |
| **Executive bullets pop in** | Bullet points appear in order with a light scale/opacity spring; optional short delay between items                                                                           | Feels like structured reasoning steps.           |


Typewriter + highlight can be two phases in the same scene (e.g. first 2s typewriter, then 1s highlight).

---

## 4. Conversation Flow


| Idea                            | What it does                                                                                                                                                                                                                                       | Why it reads as smart                            |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Query → response transition** | When moving from user bubble to “Dynamic Table” or “Revenue Analysis Report”, use a short [TransitionSeries](.agents/skills/remotion-best-practices/rules/transitions.md) (e.g. `fade` or `slide`) so the next block feels like a direct “answer”. | Reinforces cause (question) → effect (answer).   |
| **Section entrance**            | Each major block (first table, then report, then patients table) enters with a consistent motion (e.g. slide-up + fade) via `Sequence` + `interpolate`/`spring`                                                                                    | Clear narrative: question → answer 1 → answer 2. |


---

## 5. Technical Constraints (Remotion)

- **All motion from `useCurrentFrame()**` – no CSS transitions or Tailwind animation classes ([animations](.agents/skills/remotion-best-practices/rules/animations.md)).
- **Staggered entrances**: use `<Sequence from={...} durationInFrames={...} premountFor={...}>` for rows, bullets, or chart series.
- **Optional transitions**: `@remotion/transitions` (e.g. `fade`, `slide`) between “user ask” and “AI response” scenes if you use `<Series>` or `<TransitionSeries>`.
- **Typewriter**: implement via substring + frame, not per-character opacity ([text-animations](.agents/skills/remotion-best-practices/rules/text-animations.md)).

---

## Suggested order for one cohesive “hero” animation

1. **Opening**: Header + subtitle fade/scale in; user query bubble slides in (or fades).
2. **Processing**: Agent Status icons pulse; optional data-stream or connecting-line hint.
3. **First answer**: Table rows cascade in; key numbers count up; then AI summary typewriter + optional highlight.
4. **Second block**: Transition (fade/slide) into Revenue Analysis; chart bars grow in; Executive Summary bullets pop in.
5. **Third block** (if in scope): Short transition to “Patients - No Return”; same row cascade + summary typewriter pattern.

This order keeps a clear narrative (ask → thinking → answer → deeper answer) and reuses a small set of patterns (cascade, count-up, typewriter, pulse, transition) so the screen feels intelligent and consistent without overcrowding the UI.

---

## UI Elements Checklist (Validation)


| Element                                | Status  | Animation                   |
| -------------------------------------- | ------- | --------------------------- |
| Header / breadcrumb                    | skip    | Subtle fade-in              |
| Title + subtitle                       | ✅       | Fade/scale in               |
| User query bubble (green)              | ✅       | Slide in from right         |
| Timestamp                              | **add** | Fade in after bubble        |
| Dynamic Table card                     | ✅       | Row cascade                 |
| Confidence badges ("99%", "15 rows")   | **add** | Badge pop-in (scale spring) |
| Pagination ("Page 1 of 38")            | **add** | Fade in after rows          |
| Chart (Payments vs Charges)            | ✅       | Bars grow in                |
| Financial Summary table                | ✅       | Row cascade                 |
| Executive Summary bullets              | ✅       | Pop-in sequence             |
| AI summary (green bg)                  | ✅       | Typewriter + highlight      |
| Action buttons (Show Summary/Analysis) | **add** | Staggered fade-in           |
| Patients - No Return table             | ✅       | Row cascade                 |
| Chat input                             | **add** | Cursor blink / typing       |
| Model selector                         | **add** | Label fade                  |
| Quick Actions sidebar                  | ✅       | Button slide-in             |
| Agent Status panels                    | ✅       | Pulse + status badge        |
| "Waiting for Gen-2..." loader          | **add** | Pulsing dot                 |


---

## Creative Conversation Scenarios for Dental Ads

The Figma shows generic "Business Performance Copilot" content. For **dental marketing videos**, we should script conversations that resonate with practice owners.

### Available Data Sources (from `tinybird-query-tools.ts`)


| Table                          | Key Fields                                                                                                                                          | Use For                                     |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `patient_appointments_ai_view` | appointment_status (Completed/Scheduled/Cancelled), appointment_type (Exam/Cleaning/etc), schedule_column (provider), location_id, appointment_date | Scheduling, no-shows, provider productivity |
| `financial_ledger_ai_view`     | transaction_amount, category (Charge=billed / Payment=revenue / Adjustment), location_id, transaction_datetime                                      | Revenue, collections, AR                    |
| `patients_ai_view`             | patientStatus (Active/Inactive), age_range (18-30/31-50/51-70/70+), location_id                                                                     | Demographics, reactivation targets          |


---

### Scenario A: Patient Reactivation (Inactive → Scheduled)

**Data**: `patients_ai_view` (Inactive status) + `patient_appointments_ai_view` (last visit date)

**Video story** (30–40s):

1. **User types**: *"Find inactive patients who haven't had an appointment in 6+ months"*
2. **Copilot** shows table cascade: 312 patients, columns: Name, Last Visit, Age Range, Location
3. **AI Summary** (typewriter): *"312 inactive patients found. 127 are in the 31-50 age range—highest lifetime value. Recommend prioritizing this segment."*
4. **User types**: *"Show me those 127 patients with their last appointment type"*
5. **Table updates**: adds "Last Appt Type" column (Cleaning, Exam, etc.)
6. **AI Summary**: *"89 were last seen for Cleaning—likely due for hygiene recall."*
7. **Quick Action**: "Export for outreach campaign" button animates

**Why it sells**: Shows how to find and prioritize reactivation targets with data.

---

### Scenario B: Revenue Analysis by Location

**Data**: `financial_ledger_ai_view` (Payments + Adjustments = revenue)

**Video story** (30–40s):

1. **User types**: *"Total revenue by location for Q1 2024"*
2. **Copilot** shows bar chart growing in: Valley View $2.01M, Oak Grove $1.8M, Central $1.2M...
3. **Confidence badge**: "99% confidence" pops in
4. **AI Summary**: *"Q1 revenue totaled $8.4M across 12 locations. Valley View leads at $2.01M (+12% YoY). Central underperformed by 8%."*
5. **User types**: *"Why is Central down?"*
6. **Table cascade**: Payments by category for Central vs. other locations
7. **AI Summary**: *"Central has 23% fewer Adjustment credits—may indicate collection issues. Recommend reviewing denied claims."*

**Why it sells**: Multi-location owners see instant cross-practice comparison.

---

### Scenario C: No-Show & Cancellation Analysis

**Data**: `patient_appointments_ai_view` (status = Cancelled)

**Video story** (25–35s):

1. **User types**: *"Show me cancellation rate by provider for last 30 days"*
2. **Copilot** shows table: Provider | Scheduled | Cancelled | Rate
3. **Chart grows in**: horizontal bars showing cancellation % per provider
4. **AI Summary**: *"Dr. Lee has 18% cancellation rate vs. practice average of 9%. 72% of cancellations are same-day."*
5. **User types**: *"Which appointment types cancel most for Dr. Lee?"*
6. **Table**: Exam 24%, Cleaning 12%, Crown Prep 8%
7. **AI Summary**: *"Exams cancel 2x more often. Consider overbooking exam slots or sending extra reminders."*

**Why it sells**: Actionable insight into schedule leakage.

---

### Scenario D: End-of-Day Production Snapshot

**Data**: `financial_ledger_ai_view` (Charges = production) + `patient_appointments_ai_view` (Completed)

**Video story** (25–35s):

1. **User types**: *"How did we do today?"*
2. **KPI cards animate in**: Production (Charges) $14,247 | Collections (Payments) $11,892 | Completed Appts 42 | Cancellations 3
3. **Chart**: Production by provider (schedule_column)
4. **AI Summary**: *"Production hit 108% of daily goal. Dr. Smith led with $6.2K. 3 hygiene cancellations weren't backfilled—$540 lost opportunity."*
5. **Quick Action**: "View unfilled slots" glows

**Why it sells**: Practice owner gets instant daily pulse.

---

### Scenario E: Patient Demographics for Marketing

**Data**: `patients_ai_view` (age_range, patientStatus, location_id)

**Video story** (20–30s):

1. **User types**: *"Count active patients by age range for each location"*
2. **Stacked bar chart** grows in: locations on X-axis, age segments stacked
3. **AI Summary**: *"Valley View skews younger (48% under 50). Oak Grove has highest 70+ population (22%)—opportunity for implant/denture marketing."*
4. **User types**: *"How many inactive 51-70 patients at Oak Grove?"*
5. **Table**: 89 patients with status = Inactive, age_range = 51-70
6. **AI Summary**: *"89 patients. This segment has highest treatment acceptance for major restorative. Recommend reactivation campaign."*

**Why it sells**: Data-driven marketing targeting.

---

### Scenario F: Collections vs. Charges (AR Health)

**Data**: `financial_ledger_ai_view` (category = Payment vs. Charge)

**Video story** (25–35s):

1. **User types**: *"Compare charges vs. payments by location for last quarter"*
2. **Dual bar chart** grows in: Charges (blue) vs. Payments (green) per location
3. **AI Summary**: *"Practice-wide collection rate: 87%. Downtown is lowest at 72%—$48K gap between billed and collected."*
4. **User types**: *"Show Downtown's adjustments"*
5. **Table cascade**: Adjustment transactions, sorted by amount
6. **AI Summary**: *"$18K in negative adjustments (write-offs). 60% are insurance denials. Recommend reviewing coding accuracy."*

**Why it sells**: Surfaces hidden revenue leakage.

---

## Recommended Video Structure

For a **60–90s hero video**, combine scenarios:


| Time   | Content                                                             | Data Source                                 |
| ------ | ------------------------------------------------------------------- | ------------------------------------------- |
| 0–5s   | Logo + tagline: "Your AI copilot for dental"                        | —                                           |
| 5–25s  | **Scenario B** (Revenue by location) – charts + money = high impact | `financial_ledger_ai_view`                  |
| 25–40s | **Scenario D** (End-of-day snapshot) – relatable daily use          | `financial_ledger_ai_view` + `appointments` |
| 40–55s | **Scenario A** (Patient reactivation) – shows intelligence          | `patients_ai_view` + `appointments`         |
| 55–70s | **Scenario C** (No-show analysis) – actionable insight              | `patient_appointments_ai_view`              |
| 70–80s | Montage: charts growing, AI summaries typing, badges popping        | —                                           |
| 80–90s | CTA: "See what [Product] can do for your practice"                  | —                                           |


**Animation consistency**: All scenarios use the same patterns (table row cascade, chart bar grow-in, AI summary typewriter, confidence badge pop-in, Quick Action button glow).

---

## Bonus: Follow-Up Drill-Down Queries

These show the AI's reasoning depth (user asks → AI answers → user digs deeper):


| First Query                     | Follow-Up                              | Why It's Compelling           |
| ------------------------------- | -------------------------------------- | ----------------------------- |
| "Revenue by location Q1"        | "Why is Central down?"                 | Shows root-cause analysis     |
| "Cancellation rate by provider" | "Which appointment types cancel most?" | Drills into actionable detail |
| "Inactive patients 6+ months"   | "Filter to 31-50 age range"            | Shows flexible segmentation   |
| "How did we do today?"          | "Show unfilled slots"                  | Links insight to action       |


This drill-down pattern reinforces "intelligence" because the AI maintains context and surfaces progressively deeper insights.