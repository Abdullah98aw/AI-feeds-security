import { defaultNotes, defaultSettings, mockAlerts, mockAuditEvents, mockCases, mockNotifications } from '../data/ministryData';
import type { Alert, AnalystNote, AuditEvent, InvestigationCase, NotificationRecord, PrototypeSettings, SimulationState } from '../types';

const prefix = 'moi-threat-intel-v2';

export const defaultSimulationState: SimulationState = {
  status: 'Ready',
  startedAt: null,
  completedAt: null,
  durationMs: 30 * 60 * 1000,
  intervalMs: 10 * 1000,
  generatedCount: 0,
  nextEventAt: null,
  pausedRemainingMs: null,
  pausedNextEventMs: null,
  recentSignatures: [],
  muted: false
};

function safeParseJson(key: string, value: string | null) {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch (error) {
    reportStorageRecovery(key, error);
    window.localStorage.removeItem(`${prefix}:${key}`);
    return undefined;
  }
}

function read<T>(key: string, fallback: T, validate: (value: unknown) => value is T = isObjectRecord as (value: unknown) => value is T): T {
  const parsed = safeParseJson(key, window.localStorage.getItem(`${prefix}:${key}`));
  if (!parsed) return fallback;
  if (!validate(parsed)) {
    reportStorageRecovery(key, new Error('Invalid object shape'));
    window.localStorage.removeItem(`${prefix}:${key}`);
    return fallback;
  }
  return { ...fallback, ...parsed };
}

function readArray<T>(key: string, fallback: T[], validate: (value: unknown) => value is T): T[] {
  const parsed = safeParseJson(key, window.localStorage.getItem(`${prefix}:${key}`));
  if (!parsed) return fallback;
  if (!Array.isArray(parsed)) {
    reportStorageRecovery(key, new Error('Expected array'));
    window.localStorage.removeItem(`${prefix}:${key}`);
    return fallback;
  }
  const valid = parsed.filter(validate);
  if (valid.length !== parsed.length) {
    reportStorageRecovery(key, new Error('Invalid records removed'));
  }
  return valid.length > 0 || parsed.length === 0 ? valid : fallback;
}

function write<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(`${prefix}:${key}`, JSON.stringify(value));
  } catch (error) {
    reportStorageRecovery(key, error);
  }
}

export const storage = {
  findings: () => readArray<Alert>('findings', mockAlerts, validateFinding),
  saveFindings: (findings: Alert[]) => write('findings', findings),
  cases: () => readArray<InvestigationCase>('cases', mockCases, validateCase),
  saveCases: (cases: InvestigationCase[]) => write('cases', cases),
  notes: () => readArray<AnalystNote>('notes', defaultNotes, validateNote),
  saveNotes: (notes: AnalystNote[]) => write('notes', notes),
  audit: () => readArray<AuditEvent>('audit', mockAuditEvents, validateAudit),
  saveAudit: (events: AuditEvent[]) => write('audit', events),
  notifications: () => readArray<NotificationRecord>('notifications', mockNotifications, validateNotification),
  saveNotifications: (notifications: NotificationRecord[]) => write('notifications', notifications),
  settings: () => migrateSettings(read<PrototypeSettings>('settings', defaultSettings, validateSettings)),
  saveSettings: (settings: PrototypeSettings) => write('settings', settings),
  simulation: () => read<SimulationState>('simulation', defaultSimulationState, validateSimulation),
  saveSimulation: (state: SimulationState) => write('simulation', state),
  resetSimulation: () => window.localStorage.removeItem(`${prefix}:simulation`),
  reset: () => ['findings', 'cases', 'notes', 'audit', 'notifications', 'settings', 'presentation', 'simulation'].forEach((key) => window.localStorage.removeItem(`${prefix}:${key}`)),
  event(action: string, description: string, values: Partial<AuditEvent> = {}) {
    const now = new Date();
    const event: AuditEvent = {
      id: `audit-${now.getTime()}`,
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: 'Ministry Analyst',
      action,
      description,
      ...values
    };
    storage.saveAudit([event, ...storage.audit()]);
    return event;
  }
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasString(value: Record<string, unknown>, key: string) {
  return typeof value[key] === 'string' && String(value[key]).trim().length > 0;
}

function validateFinding(value: unknown): value is Alert {
  return isObjectRecord(value) && hasString(value, 'id') && hasString(value, 'category') && hasString(value, 'severity') && hasString(value, 'status') && hasString(value, 'primarySector') && Array.isArray(value.supportingSectors);
}

function validateCase(value: unknown): value is InvestigationCase {
  return isObjectRecord(value) && hasString(value, 'id') && hasString(value, 'title') && Array.isArray(value.findingIds) && hasString(value, 'status');
}

function validateNote(value: unknown): value is AnalystNote {
  return isObjectRecord(value) && hasString(value, 'id') && hasString(value, 'targetId') && hasString(value, 'targetType') && hasString(value, 'text');
}

function validateAudit(value: unknown): value is AuditEvent {
  return isObjectRecord(value) && hasString(value, 'id') && hasString(value, 'action') && hasString(value, 'description');
}

function validateNotification(value: unknown): value is NotificationRecord {
  return isObjectRecord(value) && hasString(value, 'id') && hasString(value, 'messageAr') && hasString(value, 'severity') && hasString(value, 'sector');
}

function validateSimulation(value: unknown): value is SimulationState {
  return isObjectRecord(value) && hasString(value, 'status') && typeof value.durationMs === 'number' && typeof value.intervalMs === 'number' && typeof value.generatedCount === 'number' && Array.isArray(value.recentSignatures);
}

function migrateSettings(settings: PrototypeSettings): PrototypeSettings {
  return {
    ...defaultSettings,
    ...settings,
    liveSimulationSettings: {
      ...defaultSettings.liveSimulationSettings,
      ...(settings.liveSimulationSettings ?? {})
    }
  };
}

function reportStorageRecovery(key: string, error: unknown) {
  if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) {
    console.warn(`Recovered from invalid localStorage key: ${key}`, error);
  }
}

function validateSettings(value: unknown): value is PrototypeSettings {
  return isObjectRecord(value);
}
