---
name: apple-design
description: Build fluid, tactile, Apple-grade user interfaces with 17 WWDC design principles, tactile press states, interruptible springs, authentic glass materials, and tight typography.
---

# Apple Design System & Interaction Principles

Design and engineering principles taken from Apple WWDC design talks and Emil Kowalski's interaction physics. Every interface built with this skill responds, moves, and feels tactile like iOS and macOS.

---

## The Core Interaction Numbers

| Interaction | Value / Formula | Behavior |
| :--- | :--- | :--- |
| **Press feedback** | `scale(0.97)` in `100ms` | Feedback starts on touch-down, never on release. |
| **Default spring** | Damping `1.0`, Response `0.3–0.4s` | Critically damped, zero overshoot. |
| **Drawer / Sheet spring**| Damping `0.8`, Response `0.3s` | Subtle landing bounce. |
| **Move / Reposition spring**| Damping `1.0`, Response `0.4s` | Smooth spatial translations. |
| **After a flick** | Damping `~0.8` | Preserves finger velocity on release. |
| **Drag initiation** | `~10px` slop, then 1:1 | High-precision pointer tracking. |
| **Rubber-banding** | Constant `0.55` | Soft resistance when pulled past scroll boundaries. |
| **Flick deceleration** | $d \approx 0.998$ | Natural momentum with smooth boundary snap. |
| **Glass material** | `blur(20px) saturate(180%)` | Translucent backdrop material, never stacked light-on-light. |
| **Headline tracking** | `letter-spacing: -0.02em` | Tighter tracking as font size increases. |
| **Cheap frame budget** | `transform`, `opacity` only | Never animate layout properties (width, height, top, left, margin). |
| **Reduced motion** | `prefers-reduced-motion` | Smooth cross-fade, no slides or springs. |

---

## The 17 WWDC Principles

### 01. Respond on Press
- **Rule**: Visual feedback must trigger immediately on pointer down, NOT on pointer up/click.
- **Implementation**:
  ```css
  .apple-press {
    transition: transform 100ms cubic-bezier(0.25, 1, 0.5, 1);
  }
  .apple-press:active {
    transform: scale(0.97);
  }
  ```
  In Tailwind: `active:scale-[0.97] transition-transform duration-100 ease-out`

### 02. Direct Manipulation
- Elements move 1:1 with user pointer capture.
- When dragging, keep the exact initial grab point under the finger.

### 03. Interruptible (The Most Important Principle)
- Interruptible beats smooth.
- If the user taps, drags, or cancels mid-flight, the motion turns around from **where it currently is** with preserved velocity.
- Never restart an animation or snap to frame 0.

### 04. Springs, Not Curves
- Avoid arbitrary CSS cubic bezier curves with fixed durations (`ease-in-out 300ms`).
- In Framer Motion / spring physics:
  - Default UI: `{ type: "spring", damping: 20, stiffness: 300 }` (damping ratio ~1.0)
  - Sheets / Drawers: `{ type: "spring", damping: 24, stiffness: 280 }`

### 05. Velocity Handoff
- Carry the user's gesture release velocity ($v \div \text{distance}$) straight into the animation.

### 06. Momentum
- Predict the landing spot based on release velocity and snap into position smoothly without artificial easing.

### 07. Spatial Consistency
- Elements must leave through the same vector/pathway they entered from unless explicitly transformed.

### 08. Hint the Direction
- Provide subtle direction cues (peek states, in-between frame hints) to orient the user.

### 09. Rubber-Banding
- Edges resist pulling using Apple's 0.55 logarithmic tension coefficient rather than hitting an abrupt hard wall.

### 10. Gesture Details
- Highlight on initial contact; require a small 10px directional movement threshold before committing to a scroll/drag.

### 11. Smooth Frames
- Animate strictly composite-layer properties: `transform` (translate, scale, rotate) and `opacity`.
- Zero reflow triggers on animations.

### 12. Materials & Depth
- Layer translucent glass with:
  ```css
  background: rgba(14, 18, 27, 0.75);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  ```
- Keep content legible underneath; avoid stacking light glass on light glass.

### 13. Multimodal Feedback
- Combine haptic feedback, audio feedback, and visual state in the exact same frame when meaningful user actions complete.

### 14. Reduced Motion
- Always respect `@media (prefers-reduced-motion: reduce)`.
- Replace physical translations and spring bounciness with subtle cross-fades (`opacity` 0 to 1 in 150ms).

### 15. Typography
- Large headlines ($>24\text{px}$) demand tighter tracking (`letter-spacing: -0.02em` or `-0.03em`).
- Body text remains neutral or slightly loose (`0` to `0.01em`) for maximum legibility.

### 16. The Eight Apple Design Principles
1. **Purpose**: Every element serves an authentic user goal.
2. **Agency**: Users feel in control; interface responds to them.
3. **Responsibility**: Predictable, safe, and respectful of focus.
4. **Familiarity**: Leverages standard mental models.
5. **Flexibility**: Adapts across compact mobile and wide desktop viewports.
6. **Simplicity**: Clear hierarchy without unnecessary visual clutter.
7. **Craft**: Sub-pixel alignment, cohesive color harmony, and micro-interactions.
8. **Delight**: Smooth physics and tactile feedback that feel alive.

### 17. Process
- Prototype with real gesture physics.
- Inspect interactions in slow motion.
- Verify with real thumb interactions on actual touch screens.
