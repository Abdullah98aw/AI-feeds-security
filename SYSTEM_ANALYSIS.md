# Ministry Threat Intelligence Platform — System Analysis

## 1. Executive Summary

The platform is a frontend Ministry Threat Intelligence prototype for a central Ministry Admin analyst. It is designed to demonstrate how a Ministry-level security operations team could review simulated threat findings across sectors, route work to analysts, manage cases, inspect vulnerability exposure, review notifications, and maintain an audit trail.

The prototype addresses the workflow problem of consolidating many intelligence signals into one operational interface. It demonstrates dashboard monitoring, findings triage, investigation review, sector assignment, case management, notifications, audit history, analytics, search, localization, and responsive layouts.

The intelligence feeds, AI explanations, vulnerability matching, social OSINT analysis, dark web findings, authentication, backend, database, and live integrations are simulated. No real Ministry data, real credentials, real dark web access, real social platform data, or real AI model is used.

## 2. System Scope

Dark Web Intelligence: simulated findings from dark web, paste site, underground forum, and messaging-channel sources.

Vulnerability Intelligence: simulated CVE-style records matched against local mock asset records.

Social OSINT: safe fictional examples for Instagram-style, TikTok-style, X-style, and YouTube-style public content review.

Threat Sources: simulated feed-health records for dark web, social, vulnerability, and manual submission sources.

Findings: the main work queue for simulated intelligence findings, including severity, status, sectors, analyst assignment, notes, and investigation links.

Cases: local case records that group findings and support notes, status updates, and closure/reopening.

Notifications: Arabic operational notifications linked to findings or cases, with read/unread state.

Audit: local action history for assignments, status changes, case actions, notes, settings, exports, and notifications.

Analytics: simulated KPI and chart views for operational presentation.

Sector monitoring: the dashboard compares open, investigating, closed, overdue, critical, and average response time by sector.

## 3. Intended User

The current prototype operates as one central Ministry Admin user. There is no production authentication or user switching flow. The user can view all sectors, filter findings, assign primary and supporting sectors, update statuses, assign analysts, create and manage cases, add notes, review notifications, inspect audit history, change local prototype settings, and reset demo data.

## 4. Supported Sectors

General Directorate of Prisons: monitored for simulated inmate-data, corrections-system, and custody-record related findings.

Public Security: monitored for simulated access, gateway, uniform, and public-security operational findings.

Civil Defense: monitored for simulated facility-image, GIS, emergency-response, and vulnerability findings.

General Directorate of Narcotics Control: monitored for simulated narcotics-related discussions and analytical asset context.

Border Guard: monitored for simulated border-route, smuggling, remote-access, and coastal-system findings.

General Directorate of Passports: monitored for simulated passport-service, counterfeit-passport, enrollment, and gateway findings.

## 5. System Architecture

Frontend framework: React with TypeScript and Vite.

Routing: `createBrowserRouter` in `src/main.tsx` defines routes for the dashboard, investigations, accounts, findings, vulnerabilities, dark web, social OSINT, cases, case detail, unassigned findings, sources, notifications, audit, analytics, settings, and not-found page.

State management: `AlertStatusContext.tsx` provides app-wide state through React context and local `useState`.

Local storage: `storage.ts` persists findings, cases, notes, audit events, notifications, and settings under the `moi-threat-intel-v2` key prefix.

Mock data: `ministryData.ts`, `mockAlerts.ts`, `mockAccounts.ts`, `mockPosts.ts`, `mockMetrics.ts`, and `mockRiskFactors.ts` provide static simulated datasets.

Reusable components: sidebar, top bar, KPI cards, finding cards, badges, chart cards, heat map, activity panel, confidence breakdown, risk animation, timeline, and live notification.

Localization: English and Arabic labels are provided through `i18n.ts`; app direction changes through the root `dir` attribute.

Responsive design: Tailwind utility classes control desktop, laptop, tablet, and mobile grids, mobile drawer navigation, mobile card alternatives for tables, and responsive button/filter wrapping.

## 6. Application Pages

### Threat Dashboard

Purpose: central operational overview.

Main components: `KpiCard`, `StatusBadge`, `PostCard`, `BarChartCard`, `HeatMap`.

Main actions: filter by KPI, filter by sector, open findings queue, open investigations.

Data used: findings from context, sectors, source counts.

Persistence behavior: filters are represented in URL search params; finding data comes from localStorage-backed context.

Current limitations: all metrics are simulated and no live feed is connected.

### Findings Queue

Purpose: central finding assignment and routing.

Main components: `SeverityBadge`, `StatusBadge`, mobile finding cards, desktop table.

Main actions: search, filter, assign sector, assign analyst, set priority, update status, escalate, return for verification, mark multi-sector, remove supporting sectors, open investigation.

Data used: findings, sectors, hard-coded analyst names.

Persistence behavior: assignments and status changes persist to localStorage and create audit events.

Current limitations: no backend workflow engine and no production authorization.

### Investigation Page

Purpose: detailed review of one finding.

Main components: `SeverityBadge`, `StatusBadge`, `ConfidenceBreakdown`, `RiskScoreAnimation`, detail sections, notes form, status/audit history.

Main actions: back to queue, generate audit event for report export, copy explanation, reveal simulated masked preview, add/edit/delete notes, assign primary sector, change status, close/reopen investigation.

Data used: findings, notes, risk factors, sectors, audit events.

Persistence behavior: notes, assignments, statuses, and audit events persist locally.

Current limitations: AI explanation, risk reasoning, evidence, and sensitive preview are simulated.

### Account Intelligence

Purpose: simulated account/sector profile inspection.

Main components: `KpiCard`, `SeverityBadge`, account table, mobile account cards, SVG relationship graph.

Main actions: select account, open profile, open related alerts.

Data used: mock accounts, mock alerts, mock posts.

Persistence behavior: none beyond navigation.

Current limitations: no real account intelligence or graph engine.

### Vulnerability Intelligence

Purpose: review simulated vulnerability records and potential exposure.

Main components: filter controls, vulnerability cards, `SeverityBadge`.

Main actions: filter by sector, severity, patch status, exploitation, remediation, vendor, and product.

Data used: mock vulnerabilities, mock assets, sectors.

Persistence behavior: filters are local component state only.

Current limitations: no live CVE feed, scanner, asset inventory API, or real exploit validation.

### Dark Web Intelligence

Purpose: show simulated underground-source findings safely.

Main components: category chips, dark-web finding cards, `SeverityBadge`, `StatusBadge`.

Main actions: open investigation.

Data used: findings filtered to dark web, underground forum, paste site, and messaging channel sources.

Persistence behavior: investigation actions persist from the investigation page, not from these cards.

Current limitations: no live dark web access and no real source collection.

### Social OSINT

Purpose: show safe fictional public social-media review patterns.

Main components: platform placeholder cards, `SeverityBadge`, platform icons.

Main actions: open findings queue.

Data used: `socialOsintExamples`, sectors.

Persistence behavior: none.

Current limitations: no real social API, OCR, transcript service, image analysis, or account collection.

### Cases

Purpose: create and manage investigation cases.

Main components: create-case form, case cards.

Main actions: create case, view case, close case, reopen case.

Data used: cases, findings, sectors.

Persistence behavior: created/updated cases persist locally and create audit events.

Current limitations: new cases auto-link the first two findings; there is no full case builder or backend workflow.

### Case Detail

Purpose: inspect and manage one case.

Main components: case summary cards, related finding links, analyst notes, detail sections.

Main actions: close/reopen case, open related finding, add/edit/delete notes.

Data used: cases, findings, notes.

Persistence behavior: case status and notes persist locally.

Current limitations: attachments are placeholders and timeline is limited to mock/local audit information.

### Unassigned Findings

Purpose: triage findings that are not confidently routed.

Main components: unassigned finding cards, sector selector, action buttons.

Main actions: assign sector, mark multi-sector, archive, mark irrelevant, request verification, open investigation.

Data used: findings whose primary sector is `admin` and have no supporting sectors.

Persistence behavior: assignments and statuses persist locally and create audit events.

Current limitations: suggested sectors are not generated by a real model.

### Threat Sources

Purpose: monitor simulated feed health.

Main components: threat source cards.

Main actions: view source status; no interactive source-management action is implemented.

Data used: `mockThreatSources`.

Persistence behavior: none.

Current limitations: feed health is static mock data.

### Notification Center

Purpose: review operational Arabic notifications.

Main components: notification cards, `SeverityBadge`.

Main actions: mark one notification as read, mark all as read, open related finding or case.

Data used: notifications and sectors from context/mock data.

Persistence behavior: read state persists locally and creates audit events.

Current limitations: notifications are generated from mock records and local actions only.

### Audit Log

Purpose: show traceable local action history.

Main components: search input, mobile audit cards, desktop audit table.

Main actions: search/filter audit events.

Data used: audit events from localStorage or default mock audit events.

Persistence behavior: new audit events are written to localStorage.

Current limitations: no server-side immutable audit log.

### Analytics

Purpose: present simulated operational metrics.

Main components: `KpiCard`, `TrendChartCard`, `BarChartCard`, `HeatMap`.

Main actions: open related account profile from distribution list.

Data used: mock alerts, accounts, posts, users, sectors, metrics.

Persistence behavior: none.

Current limitations: metrics are placeholder calculations from mock data.

### Settings

Purpose: configure local prototype behavior and presentation mode controls.

Main components: settings panels, labeled form controls, presentation scenario controls.

Main actions: save settings, reset demo data.

Data used: settings, sectors.

Persistence behavior: settings persist locally; reset removes localStorage keys and restores mock defaults.

Current limitations: most presentation controls are visual prototype controls; only reset has functional behavior.

### Not Found

Purpose: handle invalid routes.

Main components: message card and links back to dashboard/findings.

Main actions: navigate to dashboard or findings.

Data used: none.

Persistence behavior: none.

Current limitations: no server-side 404 handling because this is a frontend SPA.

## 7. Dashboard

KPIs show active findings, critical findings, under-investigation count, closed-this-week count, overdue findings, and unassigned findings. Each KPI filters the visible finding list.

Sector Overview compares Prisons, Public Security, Civil Defense, Narcotics, Border Guard, and Passports using open, investigating, closed, overdue, critical, and average response values. It is implemented as responsive cards.

Threat status shows a status badge row and segmented status bar from current finding counts.

Recent/priority findings are rendered with `PostCard` and change according to sector and KPI filters.

Critical, closed, overdue, and active findings are derived from the local findings array.

Live activity is simulated through local state and mock data; no socket or live API is connected.

Filtering is implemented through URL search params and local array filtering.

## 8. Findings Management

The finding data model is `Alert`. It includes ID, post ID, category, severity, confidence, status, sector information, source, collection times, due date, processing stage, authenticity, reliability, credibility, evidence, detected entities, AI/risk explanation, assigned analyst, priority, related records, and recommended actions.

The lifecycle includes New, Verification Required, Assigned, Investigating, Resolved, Closed, Overdue, and processing-stage values such as Collected, Normalizing, Entity Extraction, Sector Classification, and Risk Assessment.

Assignment changes update primary sector, supporting sectors, sector ID, analyst, priority, status, reasons, last update, and audit history.

Primary sector is one `SectorId`. Supporting sectors are an array of `SectorId`.

Notes are stored separately as `AnalystNote` records linked to findings or cases.

Escalation is represented by finding fields and queue actions; it is local and simulated.

Closing and reopening are implemented through status updates.

## 9. Investigation Workflow

A finding arrives from mock data or local reset state. The analyst opens it from the dashboard, queue, notification, dark web card, or case. The investigation page shows summary, source/context, sector assignment, detected entities, evidence, AI explanation, risk and confidence, unknown information, recommended actions, analyst notes, status history, audit events, and assignment controls.

The analyst can change sector assignment, update status, add notes, copy the explanation, record an export event, and close or reopen the finding. All functional changes persist to localStorage and create audit records where implemented.

## 10. Dark Web Intelligence

The page contains simulated findings for data leaks, employee credentials, access for sale, inmate data, counterfeit passports, uniforms/equipment, government documents, threat actor discussions, exploit discussions, smuggling discussions, and drug trafficking discussions.

Source information includes source type, reliability, authenticity, evidence availability, observed dates, and assigned analyst.

Authenticity is never confirmed by the system. Analyst review is required.

Evidence is simulated and safe; no real dark web content is shown.

## 11. Vulnerability Intelligence

Vulnerability records include CVE ID, title, vendor, product, affected versions, severity, exploitation status, patch availability, matched asset IDs, affected sectors, remediation status, due date, asset owner, and recommended mitigation.

Product/version matching is deterministic mock logic based on registered mock assets and affected ranges.

Potential Exposure is a prototype label, not a confirmed vulnerability.

Patch and mitigation status are static mock values.

Current limitations: no live vulnerability feed, no real scanner, no CMDB integration, and no real exploit validation.

## 12. Social OSINT

Instagram-style content uses a safe image placeholder and OCR-style findings.

TikTok-style content uses a vertical media placeholder and speech-to-text/entity findings.

X-style content uses a public mention example.

YouTube-style content uses a public comment example.

Image, OCR, transcript, and entity findings are static simulated strings.

## 13. Case Management

Case creation is implemented with local form state and `saveCase`. New cases are stored in localStorage and currently auto-link the first two findings.

Cases include finding IDs, title, summary, primary sector, supporting sectors, owner, priority, status, opened time, notes, recommended actions, attachments, and timeline.

Case detail supports notes, related findings, close/reopen, recommended actions, attachments placeholders, audit history, and timeline placeholders.

Local persistence is implemented for cases and notes.

## 14. Sector Monitoring

The Ministry user monitors all supported sectors centrally. The dashboard computes open, investigating, closed, overdue, critical, and average response values per sector from current findings. Multi-sector findings are counted where the primary sector or supporting sectors match the sector card.

## 15. Notifications

Notifications are Arabic messages with severity, sector, time, optional related finding, optional related case, and read state.

Read/unread state is persisted to localStorage. Live notifications are simulated by local data/state and the `LiveNotification` component; no real push service is connected.

## 16. Audit Log

The audit log records local actions such as finding creation, assignment, status changes, case creation/closure/reopening, note changes, notification reads, settings updates, language changes, and export events where those actions call `storage.event`.

It supports traceability within the browser prototype only. It is not immutable and is not server-backed.

## 17. Analytics

Available metrics and charts include pipeline precision, human review recall, mean sector response, review latency, finding trends, top categories, severity distribution, sector/account distribution, fictional heat map, average confidence, false positive rate, and evaluation data status.

All analytics are derived from mock data.

## 18. Search

Search is implemented in `TopBar`. It searches findings, cases, assets, vulnerabilities, and sectors. Results are grouped by type and navigate to investigation pages, case pages, vulnerability page, or sector-filtered dashboard routes.

## 19. Localization

The app supports English and Arabic language selection through settings/context. The root `dir` and `lang` attributes switch between LTR and RTL. Labels come from `i18n.ts`; notifications are Arabic. Language choice persists in localStorage.

Arabic support is implemented at the layout level, but the prototype does not provide a complete translation for every static English phrase.

## 20. Responsive Design

Desktop behavior: navigation sidebar is visible, content uses bounded max width, summary cards and content sections use multi-column layouts when readable.

Laptop behavior: content-heavy cards reduce columns to avoid narrow text.

Tablet behavior: sidebar becomes a drawer; content-heavy sections stack; tables use mobile card alternatives where implemented.

Mobile behavior: drawer navigation, single-column cards, full-width actions where needed, and mobile card alternatives for findings, audit, and account lists.

Responsive tables: findings, audit, and account list provide mobile card views. Other dense content is card-based.

## 21. Local Storage and Persistence

Persisted keys under `moi-threat-intel-v2`:

- `findings`
- `cases`
- `notes`
- `audit`
- `notifications`
- `settings`
- `presentation` is cleared by reset, but no full presentation state implementation is present.

Reset demo data removes those keys and reloads defaults from mock data.

## 22. Simulated AI Capabilities

Entity extraction: simulated through static `detectedEntities`.

Sector classification: simulated through preset `primarySector`, `supportingSectors`, and `sectorReasons`.

Threat classification: simulated through preset categories and severity values.

Risk scoring: simulated through confidence, risk factors, and static explanations.

Confidence reasoning: simulated through `confidenceReasoning` strings and `mockRiskFactors`.

Asset matching: simulated through fixed vulnerability-to-asset relationships.

Explainable AI: simulated through `aiExplanation`, `riskExplanation`, and confidence breakdown. No real AI model runs.

## 23. Data Models

Finding: `Alert`.

Sector: sector objects with `id`, `name`, `nameAr`, and `shortName`.

Asset: `Asset`.

Vulnerability: `VulnerabilityRecord`.

Case: `InvestigationCase`.

Notification: `NotificationRecord`.

Audit Event: `AuditEvent`.

Analyst Note: `AnalystNote`.

Threat Source: `ThreatSourceRecord`.

Settings: `PrototypeSettings`.

## 24. Security and Privacy Considerations

Sensitive data previews are masked. The prototype contains no real credentials, no real personal data, and no real Ministry data. Storage is local browser storage only. Authentication and authorization are not production implemented. The prototype should not be treated as a secure operational system.

## 25. Current Limitations

- No backend.
- No database.
- No real authentication.
- No live dark web integration.
- No real social platform API.
- No live vulnerability feed.
- No real AI model.
- No production authorization.
- Local browser storage only.
- No server-side audit immutability.
- No real export file generation.
- Presentation controls are mostly simulated.

## 26. Future Integration Points

Real services could replace mock data at the context/storage boundary. Future integration points include authentication, user/role service, findings API, case-management API, notes API, audit API, notifications/push service, vulnerability feed, asset inventory or CMDB, social OSINT collection service, dark web intelligence provider, AI classification service, evidence repository, export/reporting service, and analytics warehouse.

## 27. Complete User Journey

1. Open dashboard.
2. Review sector status.
3. Open a finding.
4. Review AI explanation.
5. Assign sectors.
6. Add notes.
7. Add or review finding inside a case.
8. Update status.
9. Review notifications.
10. Review audit log.
11. Close the case.
12. Review analytics.

Export is represented as an audit event only; no actual report file is generated.

## 28. Demonstration Scenarios

Configured presentation scenarios in Settings:

- Scenario 1: Vulnerability matched to Civil Defense asset.
- Scenario 2: Claimed inmate data leak assigned to Prisons.
- Scenario 3: Border route smuggling assigned to Border Guard and Narcotics.

The controls are prototype UI controls. Reset Demo Data is functional. Start, Pause, Resume, Restart, and Inject Next Finding do not connect to a real scenario engine.

## 29. Visual Design System

Typography: dark-mode dashboard typography with readable page titles, descriptions, section titles, card titles, metadata, and form labels.

Cards: rounded 8px cards, consistent borders, dark panels, flexible height, responsive width, and safe text wrapping.

Badges: auto-width severity/status badges with readable padding and wrapping safeguards.

Buttons: primary signal buttons, secondary bordered buttons, danger action buttons, and icon buttons in the top bar.

Tables: desktop tables for dense queue/audit/account data, with mobile card alternatives where needed.

Spacing: page sections use consistent vertical spacing and card padding.

Responsive grids: content-heavy cards avoid excessive columns; mobile falls back to one-column layouts.

Arabic support: root RTL direction, Arabic-capable font stack, Arabic notifications, and layout wrapping safeguards.

## 30. Final Implementation Status

| Module | Status | Implementation Type | Persistence | Limitations |
|---|---|---|---|---|
| Dashboard | Complete | Simulated frontend | URL params and local findings | No live metrics |
| Sector Overview | Complete | Simulated frontend | Local findings | Average response is mock-derived |
| Findings Queue | Complete | Local workflow | Findings and audit localStorage | No backend approvals |
| Investigation Page | Complete | Local workflow with simulated AI | Findings, notes, audit localStorage | AI/evidence are simulated |
| Vulnerability Intelligence | Complete | Simulated matching | None for filters | No real CVE or asset feed |
| Dark Web Intelligence | Complete | Simulated cards | None on page | No real dark web access |
| Social OSINT | Complete | Simulated examples | None | No real platform APIs |
| Cases | Partial | Local case workflow | Cases and audit localStorage | New cases auto-link findings |
| Case Detail | Partial | Local case workflow | Cases and notes localStorage | Attachments/timeline are placeholders |
| Unassigned Findings | Complete | Local workflow | Findings and audit localStorage | No real routing AI |
| Threat Sources | Simulated | Static health cards | None | No live feed health |
| Notifications | Complete | Local notification state | Notifications and audit localStorage | No push service |
| Audit Log | Complete | Local audit viewer | Audit localStorage | Not immutable/server-backed |
| Analytics | Simulated | Mock metrics/charts | None | No analytics backend |
| Settings | Partial | Local settings | Settings localStorage | Presentation controls mostly simulated |
| Search | Complete | Local grouped search | None | Searches loaded mock/local data only |
| Localization | Partial | English/Arabic shell support | Settings localStorage | Not every phrase is translated |
| Authentication | Not Implemented | None | None | Single central Ministry user only |
| Backend/API | Not Implemented | None | None | Frontend prototype only |
| Database | Not Implemented | None | Browser localStorage only | No production storage |
