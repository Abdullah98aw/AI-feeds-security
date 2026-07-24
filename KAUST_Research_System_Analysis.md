# KAUST Research System Analysis Document

## 1. Project Overview

### Project Name

**KAUST Research** is a research prototype for a simulated Security Operations Center (SOC) dashboard focused on context-aware analysis of public social-media style content.

### Research Purpose

The purpose of the prototype is to demonstrate how context-aware AI concepts can support defensive monitoring, explainable risk scoring, and analyst investigation workflows in a safe academic setting. The prototype is intended for research evaluation, presentation, and experimentation planning.

### Prototype Objective

The objective is to show an evaluator how an intelligent monitoring platform could:

- Receive simulated public posts.
- Generate contextual alerts.
- Explain why each alert was flagged.
- Support analyst review and case management.
- Demonstrate Arabic and English social-media scenarios.
- Avoid real data, real identities, and real operational information.

### Scope

The prototype is a frontend-only React application. It includes a live SOC dashboard, simulated social-media feed, alert investigation page, account intelligence, alert management, analytics, explainable AI panels, fictional heat map, threat timeline, and local export/reporting actions.

### Problem Demonstrated

The prototype demonstrates the limitation of keyword-only monitoring. Some risks are not obvious from one keyword or phrase. Instead, risk may emerge from a combination of weak contextual indicators such as text meaning, image context, account history, repeated behavior, simulated reference correlation, and confidence reasoning.

## 2. System Context

The system simulates monitoring of public social-media style posts. It is designed to look and feel like a live SOC environment, but all content is local and fictional.

The system does **not** connect to X/Twitter or any real platform. It does not use:

- Real X/Twitter APIs.
- Real government data.
- Real identities.
- Real inmate data.
- Real employee data.
- Real locations.
- Real agency logos.
- Real uniforms.
- Real operational procedures.
- Real protected records.

All posts, accounts, alerts, images, regions, metrics, and analyst workflows are **Simulated Research Data**.

## 3. Main Actors

### Security Analyst

The Security Analyst is the primary operational user in the prototype. This user reviews alerts, opens investigations, reads evidence, updates alert status, assigns analysts, marks cases as reviewed, adds notes, and exports simulated reports.

### Research Evaluator

The Research Evaluator reviews the system to assess the research concept. This actor focuses on clarity, explainability, safety boundaries, Arabic scenario support, workflow completeness, and the value of context-aware monitoring.

### Simulated Social Media Feed

The Simulated Social Media Feed represents fictional public posts. It produces English and Arabic posts with timestamps, account information, engagement metrics, language badges, optional image placeholders, and risk metadata.

### AI Context Analysis Engine

The AI Context Analysis Engine is simulated. It represents the research idea of analyzing text, image placeholders, entity safety checks, account behavior, historical patterns, and mock internal correlations. It does not call a real AI model or backend.

## 4. Functional Requirements

### Live Dashboard

The dashboard presents the main SOC view. It displays KPI cards, severity/category charts, live simulated feed, activity timeline, fictional heat map, threat progression timeline, and active monitoring indicators.

### Simulated Live Feed

The feed starts with initial simulated alerts. During the first minute, additional local mock alerts are injected into the dashboard at timed intervals. This creates the feeling of a live SOC without connecting to any external API.

### Alert Generation

Alerts are generated from local mock data. Each alert includes severity, category, confidence, status, assigned analyst, evidence, context indicators, recommended actions, and safety checks.

### Risk Scoring

Each alert has a simulated confidence score and severity level. Investigation pages animate the risk score from zero to the final confidence value to show the idea of progressive risk calculation.

### Explainable AI Panel

The Explainable AI panel shows factor-level contribution percentages. It explains which signals influenced the final risk score, such as text context, image placeholder analysis, behavior pattern, and simulated internal correlation.

### Investigation Workflow

The investigation page shows a staged AI analysis sequence before revealing the final investigation. Analysts can review evidence, see what was not detected, update status, assign analysts, mark a case as reviewed, copy a summary, and export a report.

### Account Intelligence

Account Intelligence begins with a list of simulated accounts. Each account has a profile page showing risk score, risk level, previous alerts, posting frequency, repeated patterns, suspicious indicators, interaction history, related alerts, and a simulated relationship graph.

### Alert Management

Alert Management provides a table of all alerts. It supports filtering, status display, assigned analyst information, and direct navigation into investigations.

### Analytics

Analytics shows simulated research metrics, alert trends, severity distribution, category distribution, repeated accounts, average confidence, false-positive placeholder, and a fictional heat map.

### Search and Filters

The dashboard and alert management pages support search and filtering by severity, category, language, account, date, status, and confidence. Reset filters and no-result empty states are included.

### Export Button

The investigation page includes an **Export Report (Demo)** button. It downloads a JSON report containing alert ID, post text, account, severity, confidence, category, explanation, evidence, recommended actions, current status, assigned analyst, priority, escalation level, false-positive risk, notes, and a simulated-data disclaimer.

### Simulated Heat Map

The heat map uses fictional regions only: Region Alpha, Region Bravo, Region Charlie, and Region Delta. It does not represent real geography.

### Threat Timeline

The threat timeline shows progression from Low to Medium to High to Critical using simulated timestamps. It helps evaluators understand how severity escalation is represented visually.

## 5. Non-Functional Requirements

### Usability

The UI is designed to be understandable within the first few minutes. Navigation is clear, major actions are visible, and investigation workflows are structured around analyst tasks.

### Performance

The application runs entirely in the browser using local mock data. This reduces latency and avoids dependency on network services.

### Security

The prototype avoids real integrations and real sensitive data. Exported reports contain only simulated content.

### Privacy

No real personal information is collected, processed, stored, or transmitted. All identities and accounts are fictional.

### Explainability

Every alert includes why it was flagged, evidence factors, confidence reasoning, context indicators, and what was not detected.

### Maintainability

The code uses React components, TypeScript types, local data modules, and separate pages. This keeps the prototype easier to extend and review.

### Responsiveness

The layout uses responsive grids, wrapped controls, scrollable tables, and adaptive page sections for desktop, laptop, tablet, and mobile widths.

### Research Ethics

The prototype is intentionally designed as an academic simulation. It avoids real surveillance, real operational data, and unsafe scenarios.

## 6. System Architecture

### Frontend Architecture

The system is a single-page React application built with TypeScript and Vite. The frontend renders all pages, components, charts, simulated alerts, and interactions.

### Mock Data Layer

All data is stored locally in TypeScript files:

- `mockPosts.ts`
- `mockAlerts.ts`
- `mockAccounts.ts`
- `mockRiskFactors.ts`
- `mockMetrics.ts`

This mock data layer replaces any need for backend APIs during the research demonstration.

### Components

Reusable components include:

- `Sidebar`
- `TopBar`
- `KpiCard`
- `PostCard`
- `ActivityPanel`
- `LiveNotification`
- `SeverityBadge`
- `StatusBadge`
- `ChartCard`
- `HeatMap`
- `ThreatTimeline`
- `RiskScoreAnimation`
- `ConfidenceBreakdown`

### Pages

Main pages include:

- Dashboard
- Investigation
- Account Intelligence
- Alert Management
- Analytics

### Routing

React Router provides client-side navigation:

- `/` for Dashboard.
- `/investigation/:alertId` for Alert Investigation.
- `/accounts` for Account Intelligence list.
- `/accounts/:accountId` for Account Intelligence detail.
- `/alerts` for Alert Management.
- `/analytics` for Analytics.

### State Management

The prototype uses React local state and a small context provider for alert statuses. Updated statuses are stored in `localStorage`, allowing the user to change an alert status and see that status reflected after navigating back to the dashboard or alert table.

### Simulated Alert Injection

The dashboard uses timers to reveal hidden mock alerts during the first minute. Each injected alert updates:

- Live feed.
- KPI values.
- Charts.
- Activity timeline.
- Analyst queue.
- Popup notification for High/Critical alerts.

### Dynamic UI Updates

The UI reacts to local state changes. Filters update visible alerts, KPI cards animate, notifications appear and disappear, and investigation pages animate staged analysis and risk scoring.

## 7. Data Model

### Post

The `Post` entity represents a simulated social-media style post.

Main fields:

- `id`: Unique post identifier.
- `accountId`: Related simulated account.
- `sourceType`: Simulated social-media source label.
- `detectedAt`: Simulated detection time.
- `timestamp`: Display timestamp.
- `text`: English or Arabic post text.
- `language`: Arabic or English.
- `imageLabel`: Optional safe image placeholder.
- `likes`, `replies`, `reposts`, `views`: Simulated engagement metrics.
- `fictionalRegion`: Abstract fictional region.
- `category`: Alert category.
- `severity`: Risk severity.
- `confidence`: Simulated confidence score.
- `status`: Initial workflow status.

### Alert

The `Alert` entity represents a simulated detection result.

Main fields:

- `id`: Unique alert identifier.
- `postId`: Related post.
- `createdAt`, `updatedAt`: Simulated lifecycle timestamps.
- `category`: Risk category.
- `severity`: Low, Medium, High, or Critical.
- `confidence`: Simulated AI confidence score.
- `status`: Open, Investigating, Resolved, or False Positive.
- `assignedAnalyst`: Current analyst owner.
- `priority`: Simulated priority level.
- `escalationLevel`: Simulated escalation level.
- `falsePositiveRisk`: Estimated false-positive risk.
- `whyFlagged`: Main explanation.
- `evidence`: Evidence factors.
- `contextIndicators`: Context that increased risk.
- `notDetected`: Safety-relevant negative findings.
- `confidenceReasoning`: Explanation of confidence.
- `detectionTimeline`: Simulated detection steps.
- `recommendedAction`: Safe analyst action.
- `suggestedNextAction`: Follow-up workflow suggestion.

### Account

The `Account` entity represents a fictional public account.

Main fields:

- `id`: Unique account identifier.
- `name`: Display name.
- `username`: Simulated username.
- `avatarInitials`: Placeholder avatar.
- `profileSummary`: Account summary.
- `language`: Arabic, English, or Mixed.
- `accountAge`: Simulated age.
- `lastActivity`: Last simulated post time.
- `postingFrequency`: Mock posting frequency.
- `previousAlerts`: Historical alert count.
- `riskScore`: Simulated account risk score.
- `riskLevel`: Low, Medium, High, or Critical.
- `repeatedPatterns`: Repeated behavior patterns.
- `interactionHistory`: Fictional interactions.
- `relatedAccounts`: Relationship graph links.
- `notes`: Analyst note text.

### RiskFactor

The `RiskFactor` entity supports explainability.

Main fields:

- `alertId`: Related alert.
- `factors`: List of factor objects.
- `label`: Factor name.
- `contribution`: Percentage contribution.
- `detail`: Human-readable explanation.

### Metric

Metrics represent simulated research values.

Examples:

- Precision.
- Recall.
- F1-score.
- Detection latency.
- False-positive rate.
- Average confidence.
- Daily alert trend.

### TimelineEvent

Timeline events represent live activity and investigation sequences.

Examples:

- New post received.
- Context analysis started.
- Image classified.
- Risk score updated.
- Alert generated.
- Investigation completed.

### Recommendation

Recommendations are safe analyst actions attached to alerts.

Examples:

- Review contextual evidence.
- Check historical activity.
- Continue analyst review.
- Archive evidence.
- Monitor future simulated activity.

## 8. User Journey

1. The user opens the dashboard.
2. Initial simulated alerts appear.
3. The live monitoring indicator shows that simulated monitoring is active.
4. New simulated posts and alerts appear during the first minute.
5. KPI cards, charts, heat map, activity timeline, and alert feed update.
6. A High or Critical popup notification appears.
7. The analyst clicks the notification or an alert card.
8. The investigation page opens.
9. A staged AI analysis sequence starts.
10. The risk score animates from zero to the final confidence score.
11. Investigation details appear, including evidence, risk factors, context indicators, and what was not detected.
12. The analyst reviews recommendations.
13. The analyst can assign the alert, update status, mark it reviewed, copy a summary, or export a report.
14. The analyst returns to the dashboard or alert management page.

## 9. Detection Logic

The detection logic is simulated for research demonstration. It is not a production AI model and does not use a backend inference service.

### Contextual Text Analysis

The prototype simulates text analysis by assigning explanations and risk factors based on the mock scenario. For Arabic posts, it demonstrates right-to-left text rendering and Arabic contextual phrase analysis.

### Image Placeholder Analysis

The system does not process real images. Instead, it uses safe placeholder labels such as "official-looking correctional/security uniform" or "restricted facility-like interior" to demonstrate how image context might affect a risk score.

### Entity Recognition

Entity recognition is simulated through safety checks. The system explicitly reports that no real identity, real location, real logo, real national ID, real inmate data, or real protected record was detected.

### Behavior Pattern Analysis

Behavior pattern analysis is simulated using account history, previous alerts, repeated patterns, posting frequency, and related-account interactions.

### Simulated Internal Correlation

Some alerts show mock internal correlation, such as a fictional protected-reference match. This is fully simulated and does not use real internal records.

### Confidence Scoring

Confidence scores are predefined in mock data and explained through contribution factors. The score animation is a UI demonstration, not a real model output.

### Severity Classification

Severity is assigned in the mock alerts as Low, Medium, High, or Critical. It reflects the fictional scenario design and research demonstration goals.

## 10. Explainable AI

The prototype shows explainability through several elements:

- **Why the alert was flagged:** A narrative explanation for the alert.
- **Evidence factors:** Specific simulated signals that contributed to the alert.
- **Confidence breakdown:** Percentage contributions from analysis factors.
- **What was detected:** Text context, image placeholder, behavior pattern, or simulated correlation.
- **What was not detected:** Explicit safety checks confirming no real identity, location, logo, protected record, or operational procedure.
- **Recommended action:** Safe analyst guidance for academic review.

This supports evaluator understanding by showing that the system is not a black box. It explains the simulated reasoning behind each alert.

## 11. Safety and Privacy Design

The prototype avoids unsafe or sensitive content by design.

It does not use:

- Real identities.
- Real locations.
- Real agency logos.
- Real operational procedures.
- Real inmate data.
- Real national IDs.
- Real employee data.
- Real social-media APIs.
- Real X/Twitter content.

Every page displays or reinforces that the data is **Simulated Research Data**. The scenarios are fictional and non-operational.

## 12. Page-by-Page Explanation

### Dashboard

**Purpose:** Provide the main SOC monitoring experience.

**Main components:** KPI cards, live feed, activity panel, charts, filters, High/Critical notifications, threat timeline, fictional heat map, recent investigations, and simulated monitoring indicator.

**What evaluators should notice:** The system feels active and demonstrates live contextual alert generation without real APIs.

**Research support:** Shows the overall context-aware monitoring concept and analyst triage workflow.

### Investigation

**Purpose:** Provide detailed analysis of a selected alert.

**Main components:** Original post, staged AI analysis, risk score animation, confidence breakdown, risk factors, evidence, context indicators, not-detected list, recommendations, assignment, status update, notes, related alerts, copy summary, and export report.

**What evaluators should notice:** The page explains why an alert exists and what evidence supports it.

**Research support:** Demonstrates explainable AI and analyst decision support.

### Account Intelligence

**Purpose:** Show account-level context.

**Main components:** Account list, risk score, risk level, language, last activity, detailed profile, repeated patterns, suspicious indicators, related alerts, interaction history, notes, and relationship graph.

**What evaluators should notice:** Account behavior can change the interpretation of a post.

**Research support:** Demonstrates behavior-pattern analysis and historical context.

### Alert Management

**Purpose:** Provide a table-based alert queue.

**Main components:** Alert table, search, filters, severity, category, account, timestamp, confidence, status, assigned analyst, and investigation action.

**What evaluators should notice:** Alerts can be managed and reviewed systematically.

**Research support:** Shows operational workflow around contextual alerts.

### Analytics

**Purpose:** Summarize simulated research metrics and trends.

**Main components:** Precision, recall, F1-score, detection latency, alert trends, category distribution, severity distribution, repeated accounts, false-positive placeholder, and fictional heat map.

**What evaluators should notice:** Metrics are clearly labeled as simulated and intended for research demonstration.

**Research support:** Shows how future model evaluation could be presented.

## 13. Research Value

The prototype supports the research contribution in several ways:

- Demonstrates context-aware monitoring beyond keyword matching.
- Shows explainable risk scoring through evidence and confidence breakdowns.
- Supports analyst decision-making with investigation workflows.
- Includes Arabic scenarios and RTL rendering.
- Demonstrates behavior analysis through account intelligence.
- Preserves safety by using fully fictional simulated data.
- Provides a complete academic demo without real APIs or real sensitive information.

## 14. Limitations

The prototype has honest limitations:

- No real AI model yet.
- No real-time API connection.
- Mock data only.
- No actual computer vision.
- No production backend.
- No operational deployment.
- Evaluation metrics are simulated.
- Export is a JSON demo report, not a production reporting system.
- Status persistence uses browser localStorage only.
- Browser-based responsive screenshot testing was not available in the current sandbox.

## 15. Future Work

Possible future improvements include:

- Integrating real AI models on approved research datasets.
- Adding human-in-the-loop validation.
- Creating a real evaluation dataset.
- Improving Arabic NLP and dialect handling.
- Adding stronger visual analysis with safe controlled images.
- Building a secure backend.
- Adding audit logging.
- Adding role-based access control.
- Designing formal research experiments.
- Adding persistent case management.
- Adding evaluator feedback capture.

## 16. README Summary

KAUST Research is a fully simulated academic SOC prototype for context-aware analysis of public social-media style content. It demonstrates live alert intake, Arabic and English simulated posts, explainable AI risk scoring, investigation workflow, account intelligence, alert management, analytics, and fictional heat-map visualization. The system does not connect to X/Twitter or any real API and does not use real government data, identities, inmate data, locations, logos, or operational procedures. All content is clearly labeled as Simulated Research Data and is intended only for safe academic evaluation.
