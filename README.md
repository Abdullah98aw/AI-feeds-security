# KAUST Research

KAUST Research is an academic research prototype for an AI-powered, context-aware security monitoring dashboard for public social-media style content. It demonstrates how explainable risk scoring and analyst workflow can detect simulated public security risks that simple keyword monitoring may miss.

## Simulated-data disclaimer

All posts, accounts, images, account relationships, metrics, internal references, and analyst records are fictional simulated research data. This prototype does not connect to X/Twitter or any real public platform. It does not use real government data, real identities, real uniforms, real logos, real records, real locations, inmate data, employee data, or operational procedures.

## Live monitoring simulation

The dashboard starts with a small set of existing simulated alerts. During the first minute, additional local mock alerts are injected into the feed every 8 seconds to demonstrate a live SOC monitoring experience. This is a frontend-only timer using local mock data; no real API, scraper, streaming service, or social-media platform is used.

High and Critical simulated alerts show clickable popup notifications that open the related investigation. The dashboard also includes an activity panel, fictional heat map, threat progression timeline, animated KPI cards, and search/filter controls.

Filters include reset and empty states so evaluators can safely explore the live feed without losing the demo context.

## Arabic scenarios

The prototype includes Arabic-language fictional posts for research demonstration. These posts use vague, safe, non-operational wording and are designed to show Arabic/English-friendly rendering, contextual analysis, explainability, and analyst workflow. They do not include real agency names, real locations, national IDs, inmate numbers, employee records, badges, logos, or methods for hiding sensitive data.

The Arabic scenarios include safe fictional examples for official-looking uniform exposure, restricted facility-like placeholders, simulated protected-reference correlation, operational service sentiment, and repeated vague behavioral hints. Arabic text is rendered right-to-left with language badges.

## Research scope

The prototype is intended for defensive monitoring research, explainable AI demonstration, and analyst workflow evaluation. It is not a surveillance product and does not process real social-media data.

## System analysis document

A detailed academic system analysis is available in [KAUST_Research_System_Analysis.md](./KAUST_Research_System_Analysis.md). It explains the research motivation, scope, requirements, workflow, data model, AI simulation logic, Arabic scenario support, safety boundaries, limitations, and future work.

## How to run

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Page overview

- Security Monitoring Dashboard: KPIs, simulated live feed, filters, and chart summaries.
- Alert Investigation: original post, account context, AI explanation, evidence, status, and analyst notes.
- Alert Investigation also supports local status updates, return navigation, and JSON demo report export.
- Alert Investigation includes copy summary, mark reviewed, assignment selection, related alerts, priority, escalation level, false-positive risk, and case-history panels.
- Account Intelligence: account list, profile details, risk summary, indicators, relationship graph, related alerts, and interaction history.
- Alert Management: alert table with status, ownership, severity, category, and investigation action.
- Analytics: alert trends, category analysis, clickable repeated accounts, severity distribution, fictional heat map, and mock research metrics.

## Technology

- React + TypeScript
- Tailwind CSS
- React Router
- Local mock TypeScript data files only
