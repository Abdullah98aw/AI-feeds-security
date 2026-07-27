# Ministry Threat Intelligence Platform
## Developer and System Documentation

## 1. Document Purpose
This document is for developers, reviewers, and future maintainers of the frontend prototype. It explains the actual current implementation: routes, components, state, data models, localStorage persistence, simulation logic, error handling, extension points, and known limitations.

## 2. System Overview
The platform is a simulated Ministry threat intelligence frontend. It models a central Ministry Admin experience for reviewing simulated dark web, vulnerability, social OSINT, credential, data leak, and operational threat findings. It is not connected to real feeds, real Ministry systems, a backend, or a database.

## 3. Business Problem
The prototype demonstrates how a central security operations workflow could triage intelligence, route findings to sectors, maintain analyst notes, manage cases, and monitor operational status without exposing real intelligence or sensitive data.

## 4. Intended Users
Current implementation supports a single Ministry Admin model. Role-based authentication is not implemented. Sector users are represented by mock data only.

## 5. Supported Sectors
- Ministry Admin: central triage and unassigned review.
- General Directorate of Prisons: inmate data claims.
- Public Security: credentials, public security mentions, uniforms, gateway exposure.
- Civil Defense: facility images and Civil Defense asset vulnerabilities.
- General Directorate of Narcotics Control: narcotics and trafficking discussions.
- Border Guard: border route activity and smuggling discussions.
- General Directorate of Passports: passport leaks, counterfeit passports, and unauthorized access offers.
- Multi-Sector: derived state when a finding has supporting sectors.

## 6. Functional Scope
Implemented modules include Dashboard, Findings Queue, Investigation, Vulnerability Intelligence, Dark Web Intelligence, Social OSINT, Cases, Case Detail, Unassigned Findings, Threat Sources, Notification Center, Audit Log, Analytics, Settings, and Account Intelligence.

## 7. Current Implementation Status
| Module | Status | Type | Persistence | Notes |
| --- | --- | --- | --- | --- |
| Dashboard | Implemented | Simulated | localStorage findings | KPIs update from shared context |
| Findings Queue | Implemented | Simulated | localStorage findings | Assignment/status actions |
| Investigation | Implemented | Simulated | findings, notes, cases, audit | Sticky workflow panel on xl screens |
| Vulnerabilities | Implemented | Mock | static mock data | Deterministic asset matching |
| Cases | Implemented | Simulated | localStorage cases/notes | No backend workflow |
| Notifications | Implemented | Simulated | localStorage notifications | Safe target checks and recent rendering |
| Live Simulation | Implemented | Simulated | localStorage simulation/findings/notifications/audit | Controlled, no autostart |
| Authentication | Not implemented | N/A | N/A | Single admin model only |
| Backend/API | Not implemented | N/A | N/A | Future integration point |

## 8. Technology Stack
React 19, TypeScript, Vite, Tailwind CSS, React Router, React Context, localStorage, and lucide-react icons. No test runner is defined in `package.json`.

## 9. High-Level Architecture
```text
Browser
  |
React Application
  |
Router + App Shell
  |
Pages + Reusable Components
  |
AlertStatusContext
  |
Storage Service
  |
Mock Data + localStorage
```

## 10. Production Architecture Proposal
Production should replace localStorage with a backend API, database, authentication, authorization, audit service, evidence storage, feed ingestion, AI analysis service, SIEM/CMDB integrations, and server-side validation. This is not implemented.

## 11. Folder Structure
- `src/main.tsx`: router setup and route error elements.
- `src/App.tsx`: provider/app shell/sidebar/topbar/toasts.
- `src/components/`: badges, cards, charts, fallback screens, error boundary, live toasts.
- `src/pages/`: route-level screens.
- `src/data/`: mock datasets and live simulation event templates.
- `src/services/`: storage, i18n, safe action helpers, and safe navigation validation.
- `src/state/`: shared React context and simulation timer.
- `src/types.ts`: shared TypeScript models.
- `src/styles.css`: Tailwind imports and global hardening styles.

## 12. Application Entry Point
`main.tsx` creates a browser router with route-level `errorElement` fallbacks. `App.tsx` wraps the shell in `AppErrorBoundary` and `AlertStatusProvider`. The shell renders Sidebar, TopBar, the active route outlet, and live simulation toasts.

## 13. Routing
| Route | Component | Purpose | Dynamic Parameter | Fallback |
| --- | --- | --- | --- | --- |
| `/` | Dashboard | Ministry overview | None | Route error element |
| `/findings` | AlertManagement | Findings queue | None | Route error element |
| `/alerts` | AlertManagement | Legacy findings alias | None | Route error element |
| `/investigation/:alertId` | Investigation | Finding detail | `alertId` | Record not found fallback |
| `/accounts/:accountId?` | AccountIntelligence | Account list/detail | `accountId` | Account not found fallback |
| `/vulnerabilities` | VulnerabilityIntelligence | Mock vulnerability matching | None | Empty state |
| `/dark-web` | DarkWebIntelligence | Underground findings | None | Empty state where applicable |
| `/social-osint` | SocialOsint | Public social examples | None | Link to queue |
| `/cases` | Cases | Case management | None | Empty states |
| `/cases/:caseId` | CaseDetail | Case detail | `caseId` | Record not found fallback |
| `/unassigned` | UnassignedFindings | Manual triage | None | Empty state |
| `/sources` | ThreatSources | Mock feed health | None | Route error element |
| `/notifications` | NotificationCenter | Notifications | None | Safe target unavailable state |
| `/audit` | AuditLog | Local audit history | None | Empty state |
| `/analytics` | Analytics | Sector performance | None | Route error element |
| `/settings` | Settings | Prototype and simulation controls | None | Route error element |
| `*` | NotFound | Invalid URL | Any | Recovery screen |

## 14. Navigation Model
Sidebar links cover every canonical route and use `/findings` for the findings queue. `/alerts` remains as a legacy alias so older links do not break. The mobile drawer closes after navigation. Top bar search links to findings, cases, accounts, assets/vulnerabilities, and sectors. Imperative navigation uses `safeNavigate` where practical to reject empty, malformed, unknown, or invalid-record destinations and fall back to Dashboard. Error screens provide Previous Page, Dashboard, and Findings Queue recovery. Previous Page falls back to Dashboard when history is unavailable.

## 14A. Vercel SPA Deployment and Routing
This project is a Vite single page application using React Router `createBrowserRouter`. BrowserRouter routes such as `/vulnerabilities`, `/findings`, `/cases`, `/notifications`, and `/investigation/:alertId` are client-side routes, not physical files in the deployed output.

The production 404 root cause was missing Vercel SPA rewrite behavior. Without a rewrite, directly opening or refreshing `/vulnerabilities` can make Vercel look for a server file at that path and return its own `404: NOT_FOUND` page before React loads.

The root `vercel.json` fixes this by rewriting all incoming paths to `/index.html`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Vercel still serves generated static assets from the deployment output. The rewrite is for route fallback into the SPA entry document so React Router can decide whether the route is valid, show a page, show Record Not Found, or show the React Not Found screen.

Vite deployment settings:
- Framework Preset: Vite.
- Install Command: `npm install`, because `package-lock.json` is present.
- Build Command: `npm run build`.
- Output Directory: `dist`.
- Root Directory: the project root containing `package.json`, `vite.config.ts`, and `vercel.json`.
- Vite `base`: `/`, appropriate for deployment at the Vercel domain root.
- Vite output directory: `dist`.

Testing direct URLs:
- Build with `npm run build`.
- Run a production-equivalent preview with `npm run preview`.
- Open valid routes directly in a new tab: `/`, `/findings`, `/vulnerabilities`, `/dark-web`, `/social-osint`, `/cases`, `/notifications`, `/audit`, `/analytics`, `/settings`, `/investigation/{valid-id}`, and `/cases/{valid-id}`.
- Refresh each route and confirm the app shell remains visible.
- Open invalid routes such as `/unknown-page`, `/undefined`, and `/null` and confirm the React Not Found screen appears.
- Open invalid records such as `/investigation/invalid-id` and `/cases/invalid-id` and confirm Record Not Found appears.

Troubleshooting `404: NOT_FOUND`:
- If Vercel's own 404 appears, the request did not reach React. Check that `vercel.json` is in the deployed root directory, the Vercel Root Directory points at this project, and the Output Directory is `dist`.
- If the app shell loads and shows Page Not Found, Vercel routing is working and React Router rejected the client route.
- If assets fail, confirm `vite.config.ts` uses `base: '/'` for root-domain deployment and that Vercel is serving the Vite `dist` output.
- If an old preview URL fails, verify it is still an active deployment. Commit-specific or branch preview URLs can be deleted, expired, or superseded. Promote the intended deployment to Production for a stable production domain.

## 15. Error Handling
`AppErrorBoundary` catches render/lifecycle failures. `RouteErrorElement` catches React Router route errors. `ErrorFallback` provides user-friendly recovery buttons and avoids raw stack traces. Development mode logs technical errors to the console. Dynamic finding/case/account IDs are checked before rendering.

## 16. State Management
`AlertStatusContext` owns findings, cases, notes, notifications, settings, simulation state, and live toasts. Pages subscribe through `usePrototype`. Updates are persisted through `storage.ts` and immediately reflected in all subscribed pages.

## 17. Storage Service
Storage prefix: `moi-threat-intel-v2`. Keys: `findings`, `cases`, `notes`, `audit`, `notifications`, `settings`, `presentation`, `simulation`. Reads use safe JSON parsing, shape validation, fallback defaults, and shallow settings migration. Invalid records are ignored. Unusable data returns mock defaults. Writes are try/catch guarded.

## 18. Data Models
- Alert/Finding: id, postId, category, severity, confidence, status, sector routing, source, timestamps, authenticity, reliability, credibility, evidence, explanations, actions, and relationships.
- Sector: id, English/Arabic names, short name.
- Case: id, linked finding IDs, title, summary, sectors, owner, priority, status, notes, timeline.
- Analyst Note: id, target, author, createdAt, text, visibility.
- Notification: id, title, Arabic/English message, severity, sector, source, simulated flag, outcome, assignment reason, confidence, targets, read state.
- Audit Event: id, date/time, user, action, sector, finding/case IDs, previous/new values, description.
- Vulnerability: CVE, vendor/product/version range, severity, patch state, matched assets, sectors, remediation.
- Asset: id, sector, vendor/product/version, criticality, owner, internet-facing flag, impact.
- Threat Source: id, name, type, status, reliability, update health.
- Settings: language, notification duration, simulation speed, dashboard defaults, live simulation settings.
- Simulation State: status, timestamps, duration, interval, generated count, next event time, pause data, recent signatures, muted flag.

## 19. Finding Lifecycle
Findings are created from mock data or live simulation. They move through collection, verification, assignment, investigation, case linkage, analyst notes, closure, or reopening. All important actions create local audit events.

## 20. Processing Workflow
Processing stages model ingestion: Collected, Normalizing, Entity Extraction, Sector Classification, Risk Assessment, Verification, Assigned, Investigating, Resolved, Closed. Operational status is the analyst-facing state; processing stage is the simulated pipeline state.

## 21. Sector Assignment Logic
Primary sector is the owner. Supporting sectors are unique and cannot duplicate primary. Unassigned findings use `admin` and no supporting sectors. Multi-sector findings use a real primary sector and supporting sector list. Simulation can generate assigned, unassigned, and multi-sector outcomes.

## 22. Risk and Confidence Logic
Risk score, severity, reliability, credibility, authenticity, and explainable AI are simulated. `RiskScoreAnimation` animates confidence, shows risk level, and expands contributing factors. Reduced-motion preference is respected.

## 23. Investigation Page
Sections: header, summary, source/sector context, evidence, detected entities, AI/risk explanation, recommended actions, analyst notes, status timeline, audit events, related findings/cases, asset context, and sticky risk/workflow panel.

## 24. Analyst Notes
Notes support add, edit, delete, validation, localStorage persistence, visible confirmation, and audit records. Empty notes are rejected. New notes appear immediately.

## 25. Case Management
Cases can be created, viewed, linked to findings, closed/reopened, and annotated. Case workflows are local only and do not enforce backend approvals.

## 26. Notification System
Notifications distinguish assigned, unassigned, verification, multi-sector, critical, vulnerability, dark web, social OSINT, case update, analyst assignment, closed, reopened, and completed outcomes. Notification Center validates target finding/case existence before rendering links.

## 27. Live Simulation
Settings page controls Start, Pause, Resume, Stop, Restart, Clear Simulated Notifications, toast mute, interval, duration, severity mix, sector mix, auto-create findings, and audit creation. Defaults are 10 seconds and 30 minutes. A single provider interval controls simulation and is restored from timestamps after refresh.

## 28. Audit Log
Audit records are created for language/settings changes, status changes, assignments, notes, cases, exports, sensitive reveal requests, simulation lifecycle, and generated events.

## 29. Search
Top bar searches findings, cases, mock assets, vulnerabilities, and sectors. Search result links point to existing routes.

## 30. Localization
The app supports English/Arabic labels through `i18n.ts`, `dir` switching in the shell, Arabic notification text, and localStorage language persistence. Some content remains English because it is mock analyst data.

## 31. Responsive Design
Desktop uses a fixed sidebar and sticky top bar. Mobile uses a drawer. Investigation workflow panel is sticky only on xl screens and static on tablets/iPhones. Tables use horizontal wrappers. Cards and forms use responsive grids.

## 32. Reusable Components
Important components: `AppErrorBoundary`, `ErrorFallback`, `RouteErrorElement`, `Sidebar`, `TopBar`, `LiveSimulationToasts`, `RiskScoreAnimation`, `SeverityBadge`, `StatusBadge`, `KpiCard`, `PostCard`, `ChartCard`, `HeatMap`, `ConfidenceBreakdown`.

## 33. Styling System
Tailwind utilities plus global CSS define dark theme, signal color, cards, buttons, form controls, sticky panel, overflow protection, and responsive constraints.

## 34. How to Run the Project
Install: `npm install`
Development: `npm run dev`
Build: `npm run build`
Preview: `npm run preview`
No test command is currently defined.

## 35. How to Add a New Page
Create a component in `src/pages`, import it in `main.tsx`, add a route with `errorElement`, add Sidebar link if needed, add search/navigation entries if relevant, and test invalid/empty states.

## 36. How to Add a New Finding Type
Add mock template data in `ministryData.ts` or live template data in `liveSimulationEvents.ts`, include sector routing, evidence, explanations, risk factors, and notification outcome metadata.

## 37. How to Add a New Sector
Update `sectors`, sector IDs in `types.ts`, mock users/assets/findings, dashboard logic if needed, assignment dropdowns, live simulation templates, and documentation.

## 38. How to Add a New Notification Template
Update `liveSimulationEvents.ts`, choose an `outcome`, Arabic/English messages, assignment reason, suggested action, confidence, source, and sector-safe routing.

## 39. How to Add a New Route Safely
Add route with `errorElement`, add fallback UI for missing data, update Sidebar/TopBar/search links, avoid `href="#"`, validate params, and manually test route, invalid ID, refresh, and mobile drawer.

## 40. Testing Checklist
Test every route, invalid URLs, invalid IDs, corrupt localStorage, notes, cases, notifications, simulation start/pause/resume/stop, assigned/unassigned outcomes, dashboard KPIs, browser Back, Dashboard fallback, desktop, iPhone widths, and Arabic RTL.

## 41. Known Limitations
No backend, database, real authentication, real authorization, real AI, real feeds, real evidence storage, automated tests, or production security controls.

## 42. Security and Privacy
All data is simulated. Sensitive previews are masked. localStorage is not secure for production. No real personal data or operational intelligence should be entered.

## 43. Production Readiness Gap
Production needs identity, RBAC, backend APIs, database, audit immutability, real integrations, evidence controls, encryption, monitoring, automated tests, and deployment hardening.

## 44. Future Integration Points
Backend API, authentication, authorization, database, AI service, OSINT provider, dark web provider, vulnerability feed, CMDB, SIEM, evidence storage, reporting, and notification delivery.

## 45. Troubleshooting
- White screen: route/global error fallback should appear; check console in development.
- Invalid route: use Dashboard or Findings recovery.
- Corrupted localStorage: storage falls back to safe defaults; use Reset Demo Data in Settings.
- Missing record: dynamic pages show Record not found.
- Build error: run `npm run build` and fix TypeScript output.
- Stale simulation: stop/restart simulation or reset demo data.
- Notification target unavailable: Notification Center shows target unavailable instead of a broken link.

## 46. Final System Flow
An analyst starts the simulation in Settings. A simulated finding is generated with an assigned, unassigned, verification, multi-sector, critical, source-specific, or status outcome. The event appears as a toast, a notification, a finding, and an audit record. Dashboard KPIs and sector cards update through shared context. The analyst opens the finding, reviews risk/workflow, adjusts assignment/status, adds notes, links a case, and closes or reopens the finding. All changes remain local and simulated.
