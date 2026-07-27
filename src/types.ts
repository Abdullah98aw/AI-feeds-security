export type Severity = 'Informational' | 'Low' | 'Medium' | 'High' | 'Critical';
export type AlertStatus = 'New' | 'Verification Required' | 'Assigned' | 'Investigating' | 'Resolved' | 'Closed' | 'Overdue' | 'Collected' | 'Normalizing' | 'Entity Extraction' | 'Sector Classification' | 'Risk Assessment';
export type SectorId = 'admin' | 'prisons' | 'public-security' | 'civil-defense' | 'narcotics' | 'border-guard' | 'passports' | 'multi-sector';
export type Language = 'en' | 'ar';
export type Priority = 'P4' | 'P3' | 'P2' | 'P1';
export type Credibility = 'Confirmed' | 'Probably True' | 'Possibly True' | 'Unverified' | 'Probably False';
export type Reliability = 'Reliable' | 'Usually Reliable' | 'Unknown' | 'Questionable';

export interface Post {
  id: string;
  accountId: string;
  sourceType?: 'Dark Web' | 'Vulnerability Intelligence' | 'Social Media' | 'Underground Forum' | 'Paste Site' | 'Messaging Channel';
  detectedAt?: string;
  timestamp: string;
  text: string;
  language: 'Arabic' | 'English';
  imageLabel?: string;
  likes?: number;
  reposts?: number;
  replies?: number;
  views?: number;
  fictionalRegion?: 'Region Alpha' | 'Region Bravo' | 'Region Charlie' | 'Region Delta';
  category: string;
  severity: Severity;
  confidence: number;
  status: AlertStatus;
}

export interface Alert {
  id: string;
  postId: string;
  createdAt?: string;
  updatedAt?: string;
  category: string;
  severity: Severity;
  confidence: number;
  status: AlertStatus;
  sectorId: SectorId;
  sectorName: string;
  primarySector: SectorId;
  supportingSectors: SectorId[];
  sectorReasons: Record<string, string>;
  source: NonNullable<Post['sourceType']>;
  collectionTime: string;
  dueDate: string;
  lastUpdate: string;
  processingStage: AlertStatus;
  threatSource: string;
  authenticity: 'Verification Required' | 'Pending Analyst Review' | 'Authenticity Not Confirmed' | 'Potential Exposure';
  reliability: Reliability;
  credibility: Credibility;
  previousAccuracy: number;
  independentConfirmation: boolean;
  sampleAvailability: 'Available' | 'Limited' | 'Unavailable';
  firstObserved: string;
  lastObserved: string;
  evidenceAvailability: 'Available' | 'Limited' | 'Not Available';
  detectedEntities: string[];
  maskedPreview?: string;
  sectorMatching: string;
  aiExplanation: string;
  riskExplanation: string;
  originalFinding: string;
  assignedAnalyst: string;
  escalationLevel?: 'None' | 'Watch' | 'Elevated' | 'Immediate Review';
  priority?: Priority;
  falsePositiveRisk?: 'Low' | 'Medium' | 'High';
  analystNotes?: string;
  relatedAlertIds?: string[];
  similarPreviousCases?: string[];
  whyFlagged: string;
  evidence: string[];
  contextIndicators: string[];
  notDetected: string[];
  confidenceReasoning: string;
  detectionTimeline: string[];
  recommendedAction: string;
  suggestedNextAction: string;
}

export interface Account {
  id: string;
  name: string;
  username: string;
  avatarInitials: string;
  profileSummary: string;
  accountAge: string;
  postingFrequency: string;
  language: 'Arabic' | 'English' | 'Mixed';
  lastActivity: string;
  previousAlerts: number;
  riskScore: number;
  riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
  repeatedPatterns?: string[];
  notes?: string;
  interactionHistory: string[];
  indicators: string[];
  relatedAccounts: string[];
}

export interface Asset {
  id: string;
  sectorId: SectorId;
  sectorName: string;
  vendor: string;
  product: string;
  version: string;
  criticality: Severity;
  owner: string;
  internetFacing: boolean;
  businessImpact: string;
}

export interface MinistryUser {
  id: string;
  name: string;
  role: string;
  sectorId: SectorId;
  sectorName: string;
  permissions: string[];
  responsePerformance: number;
}

export interface InvestigationCase {
  id: string;
  alertId?: string;
  findingIds: string[];
  title: string;
  summary: string;
  primarySector: SectorId;
  supportingSectors: SectorId[];
  sectorName: string;
  owner: string;
  priority: Priority;
  status: 'Draft' | 'Open' | 'Investigating' | 'Awaiting Verification' | 'Escalated' | 'Resolved' | 'Closed';
  openedAt: string;
  notes: string;
  recommendedActions: string[];
  attachments: string[];
  timeline: AuditEvent[];
}

export interface RiskFactor {
  alertId: string;
  factors: Array<{
    label: string;
    contribution: number;
    detail: string;
  }>;
}

export interface VulnerabilityRecord {
  id: string;
  cveId: string;
  title: string;
  vendor: string;
  product: string;
  affectedVersions: string;
  minVersion: number;
  maxVersion: number;
  severity: Severity;
  exploitedInWild: boolean;
  patchAvailability: 'Patch Available' | 'No Patch' | 'Workaround Available';
  publishedDate: string;
  matchedAssetIds: string[];
  affectedSectors: SectorId[];
  remediationStatus: 'Review Required' | 'Patch Pending' | 'Mitigation Applied' | 'Not Affected' | 'Accepted Risk' | 'Closed';
  dueDate: string;
  assetOwner: string;
  recommendedMitigation: string;
}

export interface ThreatSourceRecord {
  id: string;
  name: string;
  type: 'Dark Web Feed' | 'Underground Forum' | 'Paste Site' | 'Social Media OSINT' | 'Vulnerability Feed' | 'Messaging Channel' | 'Manual Submission';
  status: 'Enabled' | 'Disabled';
  reliability: Reliability;
  lastSuccessfulUpdate: string;
  findingsCollected: number;
  averageDelay: string;
  collectionMethod: string;
  healthStatus: 'Healthy' | 'Delayed' | 'Review Required';
}

export interface AnalystNote {
  id: string;
  targetId: string;
  targetType: 'finding' | 'case';
  author: string;
  createdAt: string;
  text: string;
  visibility: 'Ministry Internal' | 'Shared With Assigned Sectors';
}

export interface AuditEvent {
  id: string;
  date: string;
  time: string;
  user: string;
  action: string;
  sector?: SectorId;
  findingId?: string;
  caseId?: string;
  previousValue?: string;
  newValue?: string;
  description: string;
}

export interface NotificationRecord {
  id: string;
  title?: string;
  messageAr: string;
  severity: Severity;
  sector: SectorId;
  time: string;
  source?: NonNullable<Post['sourceType']>;
  simulated?: boolean;
  findingId?: string;
  caseId?: string;
  read: boolean;
}

export type SimulationStatus = 'Ready' | 'Running' | 'Paused' | 'Completed' | 'Stopped';

export interface SimulationSettings {
  eventIntervalSeconds: number;
  durationMinutes: number;
  toastEnabled: boolean;
  soundEnabled: boolean;
  severityMix: 'Balanced' | 'High Priority' | 'Lower Noise';
  sectorMix: 'Balanced' | 'Operational Sectors' | 'Technical Exposure';
  autoCreateFindings: boolean;
  autoCreateAuditEvents: boolean;
}

export interface SimulationState {
  status: SimulationStatus;
  startedAt: number | null;
  completedAt: number | null;
  durationMs: number;
  intervalMs: number;
  generatedCount: number;
  nextEventAt: number | null;
  pausedRemainingMs: number | null;
  pausedNextEventMs: number | null;
  recentSignatures: string[];
  muted: boolean;
}

export interface LiveSimulationToast {
  id: string;
  title: string;
  severity: Severity;
  sector: SectorId;
  sectorName: string;
  source: NonNullable<Post['sourceType']>;
  time: string;
  findingId?: string;
}

export interface PrototypeSettings {
  language: Language;
  notificationDuration: number;
  simulationSpeed: 'Slow' | 'Normal' | 'Fast';
  defaultDateRange: string;
  defaultSector: SectorId | 'all';
  riskThreshold: Severity;
  liveSimulation: boolean;
  liveSimulationSettings: SimulationSettings;
}
