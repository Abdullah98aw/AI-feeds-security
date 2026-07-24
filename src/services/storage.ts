import { defaultNotes, defaultSettings, mockAlerts, mockAuditEvents, mockCases, mockNotifications } from '../data/ministryData';
import type { Alert, AnalystNote, AuditEvent, InvestigationCase, NotificationRecord, PrototypeSettings } from '../types';

const prefix = 'moi-threat-intel-v2';

function read<T>(key: string, fallback: T): T {
  try {
    const saved = window.localStorage.getItem(`${prefix}:${key}`);
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
  } catch {
    return fallback;
  }
}

function readArray<T>(key: string, fallback: T[]): T[] {
  try {
    const saved = window.localStorage.getItem(`${prefix}:${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  window.localStorage.setItem(`${prefix}:${key}`, JSON.stringify(value));
}

export const storage = {
  findings: () => readArray<Alert>('findings', mockAlerts),
  saveFindings: (findings: Alert[]) => write('findings', findings),
  cases: () => readArray<InvestigationCase>('cases', mockCases),
  saveCases: (cases: InvestigationCase[]) => write('cases', cases),
  notes: () => readArray<AnalystNote>('notes', defaultNotes),
  saveNotes: (notes: AnalystNote[]) => write('notes', notes),
  audit: () => readArray<AuditEvent>('audit', mockAuditEvents),
  saveAudit: (events: AuditEvent[]) => write('audit', events),
  notifications: () => readArray<NotificationRecord>('notifications', mockNotifications),
  saveNotifications: (notifications: NotificationRecord[]) => write('notifications', notifications),
  settings: () => read<PrototypeSettings>('settings', defaultSettings),
  saveSettings: (settings: PrototypeSettings) => write('settings', settings),
  reset: () => ['findings', 'cases', 'notes', 'audit', 'notifications', 'settings', 'presentation'].forEach((key) => window.localStorage.removeItem(`${prefix}:${key}`)),
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
