# Tharaka-Nithi Digital Connect V2

A polished, mobile-first Progressive Web App current for the Tharaka-Nithi Digital Connect concept.

## What is included

- Existing county super-app sections preserved from the original current.
- Refined visual system and responsive layout.
- Quick-action home experience.
- County-at-a-glance dashboard cards.
- Smart search suggestion shell.
- Dark mode.
- Larger-text accessibility toggle.
- Offline status indicator.
- PWA install prompt support.
- "Ask TN AI" assistant shell (current only; no live AI/API connection).
- Existing jobs, services, marketplace, agriculture, property, transport, healthcare, events, county, leaders, emergency, profile and notifications flows.
- Improved PWA caching strategy.

## Important

This remains a front-end application. The current content is content entered locally and is not a connection to county systems, hospitals, businesses, political offices, payment systems, or live data feeds.

Do not publish unverified emergency numbers, political identities, government contacts, fees, market prices or health information as official data without verification.

## Run locally

Serve the folder with a local HTTP server. For example, VS Code Live Server or:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

PWA/service-worker functionality requires HTTP(S), not a `file://` URL.

## Account access

Name: Cedrick Mwiti
Password: TharakaNithi2026

## Production roadmap

1. Replace mock data with API services.
2. Add secure backend authentication.
3. Add PostgreSQL and migrations.
4. Add verified county/hospital/business data.
5. Integrate maps.
6. Integrate M-Pesa through a server-side payment service.
7. Add push notifications and real-time services.
8. Add admin/moderation dashboard.
9. Add monitoring, analytics, backups and security controls.
10. Verify all official information before public launch.

## TN AI Conversational Chatbot (V2)

Version 2 includes a full ChatGPT-style conversational chatbot interface called **TN AI**.

It supports:
- persistent local conversation history
- new chat
- typing indicator
- suggested prompts
- copy/feedback controls
- mobile full-screen chat
- contextual responses using the current's Jobs, Services, Healthcare, Agriculture, Property, Events and Transport local data
- an optional backend integration point via `window.TN_AI_API_URL`

### Connecting a real AI backend

The frontend intentionally does not contain an AI API key. A secure backend can be configured by setting `window.TN_AI_API_URL` to your server endpoint. The endpoint should accept a JSON body containing `message` and `history`, then return JSON such as:

```json
{"reply":"Your assistant response here"}
```

Keep all provider API keys and secrets on the server. Do not place them in `script.js` or other frontend files.


### Language switching
TN AI detects whether each message is written in English or Kiswahili (`window.TNC_LANG` in `script.js`) and replies in that language. Short or ambiguous messages ("yes", "Chuka") keep using whichever language the conversation was last using, so the bot doesn't flip languages mid-conversation on a one-word reply.

## TN AI Frontend Knowledge Layer

The chatbot now reads the same frontend datasets used by the application through `knowledge.js`. This is a first-stage, frontend-only knowledge layer. Later it can be replaced with live backend/database retrieval without changing the chat UI.

## TN AI question coverage
The frontend TN AI now includes a broad intent/question library covering the app's current modules and actions: account recovery, sign-up/logout, jobs and opportunities, skills/services, marketplace, agriculture, property, transport, healthcare and the queue, events, county services, leaders/community concerns, emergency directory guidance, announcements, notifications, profile, search, PWA/install/offline help, privacy/security guidance, and cross-site lookup. It answers from the same frontend datasets used by the app. It is not a substitute for a live backend or verified official data.


## Admin Panels
Open `admin-login.html` to choose an admin workspace: `county-admin.html`, `hospital-admin.html` or `security-admin.html`. See `README-ADMIN-REDESIGN.md` for what each portal covers.

Content published from any admin portal (announcements, opportunities, services, alerts, etc.) is written to a shared `localStorage` store (`tnc_live_content_v1`, see `tnc-sync.js`) and appears on the public app automatically — no separate publish/deploy step. This keeps every browser tab on the **same device** in sync in real time; because this remains a backend-free current, syncing across different devices requires the real API described in the production roadmap below.


Branding update: the supplied Tharaka-Nithi County emblem is used throughout the app and as the PWA icon.


## Admin editing

Every administrator can edit the application's editable content from the admin editor:
site settings, home content, announcements, county services, leaders, emergency contacts,
hospitals, opportunities, businesses, agriculture, transport, events, property and community
information. Records can be added, edited, and deleted.

This build remains frontend-only. Changes are stored in the browser with localStorage and
synchronize across tabs on the same device. No backend or API has been added.
