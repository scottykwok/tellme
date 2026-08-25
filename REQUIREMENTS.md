# TellMe — Requirements & Design Document

**Status:** Draft v1
**Date:** 2026-08-25
**Author:** Product owner + Claude (planning session)

---

## 1. Problem Statement

Elderly people in Hong Kong who have lost their voice or have severely reduced speech (e.g. post-laryngectomy, stroke, intubation, vocal cord damage) currently have very limited tools to express basic needs. Pen-and-paper communication boards exist in some hospitals but are slow, not personalized, and hard to use one-handed or while bed-bound. Family members and caregivers need a fast, low-friction way for these patients to express themselves without requiring literacy beyond basic Traditional Chinese/Cantonese vocabulary, and without requiring fine motor precision.

**TellMe** is a communication-assistance app that lets a patient tap large picture/word cards (organized by category) to build a message, with a secondary text-input mode for anything not covered by the presets.

---

## 2. Target Users

- **Primary:** Elderly patients in Hong Kong hospitals, often bed-bound, with vocal cord damage or loss of speech, who retain basic reading comprehension of Traditional Chinese/Cantonese and can use at least one finger.
- **Secondary:** The same patients in daily life at home/outdoors, using the app to speed up communication with family or strangers.
- **Indirect user:** Caregivers/family/nurses who read the screen to understand the patient's need. (No caregiver account/login in MVP — this is a single-user, single-device tool.)

### Known constraints to design around

- Possible limited hand dexterity/tremor → large touch targets, forgiving tap zones, no gestures requiring precision (no small drag handles, no double-tap-to-confirm).
- Possible reduced vision → large text, high contrast option, no reliance on color alone to convey meaning.
- Hospital settings often have unreliable Wi-Fi → app must work fully offline.
- Device may be an older/shared tablet or the patient's own phone → keep the app lightweight, no heavy dependencies.

---

## 3. Use Cases

1. **Hospital, bed-bound (primary):** Patient is lying down, screen propped nearby or handed to them. They tap a category (身體/飲食/緊急/...) then tap a specific phrase card. The phrase appears in large text on screen for a nurse/family member standing nearby to read. No audio needed — someone is expected to be looking at the screen when it matters (e.g. call button pressed, or card tapped and screen shown to visiting staff).
2. **Daily life (secondary):** Patient is out with family, uses the same card system to quickly say things like 唔該畀杯水 without straining their voice, potentially supplementing whatever voice they do have.
3. **Something not covered by preset cards:** Patient switches to text-input mode and uses the OS's native handwriting/keyboard input (already built into iOS/Android/Chrome OS) to type a custom message, which also gets shown in large text and saved to recent messages.

---

## 4. Scope

### 4.1 MVP (Phase 1 — this document's primary focus)

- Home screen with large category buttons.
- Word/phrase card grid per category, tap-to-display-large-text.
- Mode switch: **Card selection** ⇄ **Text input** (using native OS keyboard/handwriting IME — no custom OCR built).
- Word/phrase prediction + recent messages list in text-input mode, to reduce typing.
- Large text, large buttons throughout.
- Theme: light / dark / high-contrast.
- Settings: font size adjustment, theme selection.
- Local persistence: recent messages, settings, and any customization saved as JSON in browser storage (localStorage/IndexedDB) — explicitly a **temporary/local-only solution**, not synced anywhere.
- PWA: installable to home screen, works offline (service worker + cache).
- No text-to-speech in MVP — message is shown as large on-screen text only.

### 4.2 Explicitly out of scope for MVP (future phases)

- **Phase 2 — Voice output:** Wire up system/browser TTS (Web Speech API) to read the selected phrase aloud, so caregivers don't need to be looking at the screen.
- **Phase 3 — Native app port:** Wrap/rebuild for iOS and Android (e.g. via Capacitor) for better OS integration, offline reliability, and distribution via App Store/Play Store.
- **Phase 4 — Voice cloning:** Integrate ElevenLabs (or similar) to let a patient pre-record samples of their own voice while they still can (or use family-provided samples) and have TTS speak in that voice instead of a generic system voice.
- **Not planned even long-term (unless requested later):** multi-user accounts, cloud sync, caregiver companion app, analytics/telemetry.

---

## 5. Functional Requirements

> **Core design principle — two very different users of the same app:**
> - **Patient-facing screens** (Home, category grid, card grid, text-input mode, message display) are used *in the moment of need* by an elderly person who may be unwell, anxious, or unfamiliar with apps in general. These screens must have **zero learning curve**: minimal text, minimal steps, no nested menus, no jargon, no configuration choices exposed. If a first-time user can't figure it out in a few seconds without instruction, it's too complex for this surface.
> - **Settings is caregiver-facing**, set up once by a family member or nurse on the patient's behalf, not touched by the patient during actual use. It is explicitly allowed to be denser, use smaller controls/text, and expose more options than anywhere else in the app — clarity for the caregiver configuring it matters more than large-touch-target simplicity here.
>
> This distinction should drive every UI decision below: when in doubt on a patient-facing screen, cut the option rather than add it; Settings is where configurability belongs.

### 5.1 Home Screen

- Grid of large, high-contrast category buttons — nothing else on this screen competes for attention. Each button: icon + Traditional Chinese label, minimum touch target ~88×88pt (larger than typical mobile guidance of 44pt, given tremor/vision constraints).
- Default categories, in fixed display order (see §7 for starter content and §5.1.1 for the ordering rationale): 緊急 (Emergency), 身體 (Body), 身體部位 (Body Parts), 護理 (Toilet & Care), 飲食 (Food & Drink), 感受 (Feelings), 日常 (Common Phrases).
- 緊急 (Emergency) category is visually distinguished (e.g. red/orange accent even in other themes) and always pinned as the first or most prominent button — this is a safety-relevant path and should never require more than 2 taps from launch.
- A persistent, always-visible mode toggle (Card mode ⇄ Text mode) and a "Recent" shortcut are reachable from the home screen without entering a category. No other controls, labels, or settings visible here — anything not essential to "express a need right now" belongs in Settings, not the Home screen.

#### 5.1.1 Categorization principles

Findability under stress/impairment is a grouping problem, not just a labeling one — these rules govern how categories and phrases are organized, and should be followed when the vocabulary is edited later:

- **Cap at 5–7 top-level categories.** Beyond that, quick visual scanning breaks down for a patient under discomfort or time pressure. The starter set (§7) now uses **7 — the ceiling of this range**; any further vocabulary growth should be merged into an existing category rather than adding a new top-level one (see 身體部位 note below).
- **Fixed order, not alphabetical or user-sortable in MVP.** Predictability beats cleverness — a patient should be able to build muscle memory for "emergency is always top-left." Order: 緊急 first (safety-critical), then 身體 and 身體部位 and 護理 (physical needs — how it feels, where it hurts, and physical care), then 飲食, then 感受 and 日常 (softer/social needs) last.
- **身體 vs 身體部位 split intentionally.** 身體 holds *symptoms/sensations* (頭痛, 好攰, 郁唔到...); 身體部位 holds plain *body-part names* (眼/耳/口/鼻/喉/氣管/上身/下身/手/大腿) as standalone cards — tapping one just shows that word (e.g. 喉) for the caregiver to ask follow-up questions verbally. This was a deliberate choice against a two-step "pick body part → pick symptom" composer, to keep the single-tap-immediate interaction model consistent everywhere in card mode.
- **One consistent icon + accent color per category**, reused identically on the home button, the category header, and the back button — so a patient can relocate a category by shape/color recognition alone, without needing to read.
- **Cap ~10–12 phrases per category** so the whole grid fits on one screen with no scrolling — if a category grows past that in practice, split it into a new top-level category rather than nesting a sub-menu (an extra tap level is worse than an extra home-screen button).
- **Deliberate duplication for urgent items.** A few high-priority symptoms (e.g. 頭暈) intentionally appear in both 緊急 and their natural category (身體) — this is a considered redundancy, not an editing oversight, so a patient never has to guess which single category holds something urgent.
- **Order phrases within a category by expected frequency of use**, most-likely-needed first, so the top-left card is usually the right tap.

### 5.2 Card Selection Mode

- Tapping a category opens a grid of phrase cards within it (text-only cards is acceptable for MVP; icons are a nice-to-have if time allows, not required).
- Tapping a phrase card immediately displays it full-screen in very large text (this is the "message shown to caregiver" moment).
- A "back" affordance returns to the category grid or home screen.
- Optionally, a short list of favorite/pinned phrases can float at the top of every category (nice-to-have, not MVP-blocking).

### 5.3 Text Input Mode

- Standard text input field bound to the OS's native keyboard, which on iOS/Android already supports Cantonese/Chinese handwriting input as an IME option — the app does **not** implement its own handwriting recognition.
- As the user types, show:
  - **Prediction/autocomplete** — suggest matching phrases from the built-in vocabulary bank and from the user's recent messages, ranked by prefix match then recency/frequency.
  - **Recent messages list** — tappable list of the last N (e.g. 20) messages sent, so a frequently repeated custom message doesn't need retyping.
- Submitting (via an explicit "Show" / send button, large and unambiguous) displays the message full-screen in large text, same as card mode, and appends it to recent messages.

### 5.4 Message Display

- Full-screen, large text display is the shared end state of both modes — this is the actual "communication" moment, so it should be unmistakable, high-contrast, and easy to dismiss/return from with one tap.

### 5.5 Settings (caregiver-facing — see design principle above)

Unlike every other screen, Settings is designed for a caregiver/family member configuring the app on the patient's behalf — normal mobile UI density and conventions apply here (standard-size controls, more text/labels, grouped options), rather than the oversized-everything approach used elsewhere.

- Font size: at least 3 steps (e.g. Large / X-Large / XX-Large), affecting cards, input text, and message display consistently.
- Theme: Light / Dark / High-contrast (high-contrast is a distinct theme, not just "extra dark", per WCAG-AA-oriented contrast ratios).
- Reset/clear recent messages.
- A short in-app note explaining the local-only data storage limitation (see §5.6) in plain language, so the caregiver setting it up understands the tradeoff.
- (Nice-to-have, not MVP-blocking) Reorder or hide categories, edit/add custom phrases within a category.
- Settings should be reachable from the Home screen via a single, small, unobtrusive icon (e.g. a corner gear icon) — deliberately less prominent than the category buttons, since it's not part of the patient's moment-to-moment flow.

### 5.6 Data Persistence (local, temporary solution)

All state is stored client-side as JSON (localStorage for small settings, IndexedDB if recent-message volume grows) — see §8 for schema. Explicitly **not** backed by any server or account in this phase. This is called out as a known limitation: data does not survive a cleared browser/app cache, and does not sync across devices.

### 5.7 PWA Requirements

- Valid Web App Manifest (name, icons at multiple sizes, `display: standalone`, theme colors matching the app's light/dark themes).
- Service worker precaching the app shell and the vocabulary bank so the app is fully usable offline after first load — critical since hospital Wi-Fi is unreliable.
- Installable/"Add to Home Screen" prompt on both iOS Safari and Android Chrome.

---

## 6. Non-Functional Requirements

- **Offline-first:** app must be 100% functional with no network connection after initial install; nothing in the MVP critical path should depend on a network call.
- **Performance:** should load and become interactive in under ~2s on a mid-range/older Android tablet; card taps should feel instant (<100ms visual feedback).
- **Accessibility:** target WCAG 2.1 AA contrast ratios at minimum for all default themes; high-contrast theme should exceed AA; all interactive elements reachable and operable via simple single taps (no multi-touch, no long-press-only actions, no swipe-only navigation for core paths).
- **Privacy:** this app handles sensitive health-related personal expression. Since MVP is local-only with no backend, there is no transmission risk by default — this should be preserved as a property, not accidentally broken by adding analytics/telemetry SDKs later without explicit review.
- **Device support:** modern mobile Safari (iOS) and Chrome (Android) at minimum; should degrade gracefully (not crash) on older browsers even if some PWA features are unavailable.
- **Localization:** Traditional Chinese (Hong Kong Cantonese usage) is the only language for MVP; do not hard-code English-only assumptions in text handling (e.g. avoid libraries that mishandle CJK line-breaking/truncation).

---

## 7. Starter Vocabulary (draft — for review/editing)

This is a first draft to seed development and testing. Every phrase is written in **colloquial spoken Hong Kong Cantonese (港式口語)**, not Standard Written Chinese (書面語) — e.g. 唔該 not 請, 呢個 not 這個, 睇 not 看, 攰 not 累. This matters because the reader is a caregiver hearing the patient's "voice," and stiff written Chinese would feel unnatural coming from an elderly Cantonese speaker. Any future additions to this list should be checked against the same standard, not just translated from Mandarin/written Chinese.

Categories below are listed in the fixed display order defined in §5.1.1 (urgency/physical-need first, social/soft needs last), and each stays within the ~10–12 phrase cap.

### 緊急 (Emergency) — always 1 tap from home
| Phrase |
|---|
| 救命 |
| 快啲嚟 |
| 我好唔舒服 |
| 我好痛 |
| 我頭暈 |
| 我唔舒服，好嚴重 |
| 我要見醫生 |
| 我要見護士 |
| 我唔夠氣 |
| 我跌咗 |

### 身體 (Body / how I feel physically)
| Phrase |
|---|
| 頭痛 |
| 肚痛 |
| 胸口痛 |
| 好攰 |
| 頭暈 |
| 心跳好快 |
| 手/腳麻痺 |
| 郁唔到 |
| 好凍 |
| 好熱 |
| 想瞓覺 |
| 瞓唔到 |

### 身體部位 (Body Parts — standalone, points to where)
| Phrase |
|---|
| 眼 |
| 耳 |
| 口 |
| 鼻 |
| 上身 |
| 下身 |
| 手 |
| 大腿 |
| 喉 |
| 氣管 |

### 護理 (Toilet & Personal Care)
| Phrase |
|---|
| 想去廁所 |
| 想換片 |
| 想抹身 |
| 想坐起身 |
| 想瞓返低 |
| 張床想較高/較低 |
| 想攞多個枕頭 |
| 吸痰 |

### 飲食 (Food & Drink)
| Phrase |
|---|
| 想飲水 |
| 肚餓 |
| 想食嘢 |
| 唔想食 |
| 想食粥 |
| 想飲湯 |
| 太熱 |
| 太凍 |
| 呢個我唔食得 |
| 我對呢啲敏感 |
| 想漱口 |

### 感受 (Feelings)
| Phrase |
|---|
| 我好辛苦 |
| 我好驚 |
| 我好悶 |
| 我唔開心 |
| 我想有人陪 |
| 太嘈 |
| 我想靜一靜 |
| 唔該慢慢嚟 |

### 日常 (Common Phrases)
| Phrase |
|---|
| 唔該 |
| 多謝 |
| 係 |
| 唔係 |
| 等一等 |
| 唔使 |
| 唔該幫我 |
| 我想同屋企人講嘢 |
| 想開電視 |
| 開窗/閂窗 |
| 冷氣太凍/太熱 |

> **Action item for owner:** review this list, especially the emergency category, with a clinician/nurse or family member familiar with the actual patient's vocabulary before launch. This list should live as an editable JSON file, not be hard-coded, so it's easy to adjust without a code change.

---

## 8. Data Model (local JSON)

```jsonc
// settings.json — localStorage key: "tm_settings"
{
  "fontSize": "large",        // "large" | "xlarge" | "xxlarge"
  "theme": "light",           // "light" | "dark" | "highContrast"
  "lastMode": "card",         // "card" | "text"
  "lastCategoryId": "body"
}

// recentMessages.json — localStorage/IndexedDB key: "tm_recent"
[
  {
    "id": "uuid",
    "text": "我想飲水",
    "source": "card",          // "card" | "text"
    "categoryId": "food",      // null if source is "text"
    "timestamp": "2026-08-25T09:12:00+08:00"
  }
]

// vocabulary.json — bundled with app, versioned, not user-edited in MVP
{
  "categories": [
    {
      "id": "emergency",
      "label": "緊急",
      "accent": "red",
      "phrases": ["救命", "快啲嚟", "..."]
    }
  ]
}
```

---

## 9. Tech Stack & Architecture (recommended)

- **Framework:** React + Vite. Chosen for ecosystem maturity and because it eases a later Phase 3 native port via Capacitor or React Native without a full rewrite.
- **Styling:** CSS variables/tokens for theme (light/dark/high-contrast) and font-size scaling, so both settings compose cleanly across every screen instead of being handled per-component.
- **State:** local component state + a small persistence layer (a thin wrapper around localStorage/IndexedDB) — no need for Redux/heavy state libraries at this scope.
- **PWA tooling:** `vite-plugin-pwa` (or hand-rolled manifest + service worker) for offline caching and installability.
- **Text input / handwriting:** plain `<input>`/`<textarea>` relying on the OS IME — no client-side handwriting recognition library needed in this phase.
- **TTS (Phase 2):** Web Speech API (`speechSynthesis`) — free, offline-capable on most platforms, no integration cost.
- **Voice cloning (Phase 4):** ElevenLabs API — will require network access and an account/key, a deliberate exception to the "offline-first" rule scoped to that one feature only.

---

## 10. Deployment

- MVP is a fully static, offline-first PWA (no backend), so hosting is deliberately **host-agnostic** — Vercel, Netlify, and Cloudflare Pages are all interchangeable for this phase (static build + HTTPS + git-based CI/CD). No need to commit to one now.
- Keep this decision easy to revisit for **Phase 4**: ElevenLabs will need an API key kept off the client, which means a small serverless/edge function proxying those calls. Prefer whichever static host is chosen to also support serverless functions out of the box (Vercel and Netlify both do) so Phase 4 doesn't force a platform migration — just avoid a host that is static-only with no function support.

## 11. Roadmap

| Phase | Scope |
|---|---|
| **1 — MVP** | Home screen, card selection, text input w/ OS handwriting IME, prediction, recent messages, large text/buttons, theming, local JSON persistence, installable offline PWA. |
| **2 — Voice output** | System/browser TTS reads selected/typed phrase aloud. |
| **3 — Native port** | iOS/Android app via Capacitor (or similar), App Store/Play Store distribution, deeper OS integration. |
| **4 — Personalized voice** | ElevenLabs voice cloning integration using patient's own pre-recorded voice samples. |

---

## 12. Open Questions / Risks

- **Vocabulary correctness:** the draft phrase list (§7) needs review by someone close to actual patient needs (nurse/family) — wording, completeness, and especially the Emergency list are safety-relevant.
- **Data loss risk:** since storage is local-only, clearing browser data or losing the device loses all recent messages and settings. This is accepted for MVP but should be clearly communicated in-app (e.g. a note in Settings), and revisited if the tool becomes daily-critical.
- **Multiple patients/devices:** if the app is used on a shared hospital tablet across different patients, local storage would mix messages/settings between them — out of scope for MVP but worth flagging if that usage pattern emerges.
- **iOS PWA limitations:** iOS Safari's PWA support (offline storage limits, no push notifications, manifest quirks) is more restricted than Android Chrome — worth a quick spike early in Phase 1 to confirm offline caching actually works reliably on iOS before committing further.
