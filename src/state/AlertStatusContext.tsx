import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { storage } from '../services/storage';
import type { Alert, AlertStatus, AnalystNote, InvestigationCase, Language, NotificationRecord, Priority, PrototypeSettings, SectorId } from '../types';

interface PrototypeContextValue {
  findings: Alert[];
  cases: InvestigationCase[];
  notes: AnalystNote[];
  notifications: NotificationRecord[];
  settings: PrototypeSettings;
  language: Language;
  setLanguage: (language: Language) => void;
  getStatus: (findingId: string) => AlertStatus;
  updateFinding: (findingId: string, updates: Partial<Alert>, action?: string) => void;
  assignFinding: (findingId: string, primarySector: SectorId, supportingSectors: SectorId[], analyst: string, priority: Priority) => void;
  setStatus: (findingId: string, status: AlertStatus) => void;
  saveCase: (caseRecord: InvestigationCase) => void;
  closeCase: (caseId: string) => void;
  reopenCase: (caseId: string) => void;
  addNote: (note: Omit<AnalystNote, 'id' | 'createdAt'>) => void;
  updateNote: (noteId: string, text: string) => void;
  deleteNote: (noteId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateSettings: (settings: PrototypeSettings) => void;
  resetDemoData: () => void;
}

const PrototypeContext = createContext<PrototypeContextValue | undefined>(undefined);

export function AlertStatusProvider({ children }: { children: ReactNode }) {
  const [findings, setFindings] = useState(() => storage.findings());
  const [cases, setCases] = useState(() => storage.cases());
  const [notes, setNotes] = useState(() => storage.notes());
  const [notifications, setNotifications] = useState(() => storage.notifications());
  const [settings, setSettings] = useState(() => storage.settings());

  const persistFindings = (next: Alert[]) => {
    setFindings(next);
    storage.saveFindings(next);
  };

  const value = useMemo<PrototypeContextValue>(() => ({
    findings,
    cases,
    notes,
    notifications,
    settings,
    language: settings.language,
    setLanguage: (language) => {
      const next = { ...settings, language };
      setSettings(next);
      storage.saveSettings(next);
      storage.event('Language changed', `Language changed to ${language}.`, { newValue: language });
    },
    getStatus: (findingId) => findings.find((finding) => finding.id === findingId)?.status ?? 'Verification Required',
    updateFinding: (findingId, updates, action = 'Finding updated') => {
      const current = findings.find((finding) => finding.id === findingId);
      const next = findings.map((finding) => finding.id === findingId ? { ...finding, ...updates, lastUpdate: new Date().toLocaleString() } : finding);
      persistFindings(next);
      storage.event(action, `${action} for ${findingId}.`, { findingId, sector: updates.primarySector ?? current?.primarySector, previousValue: current?.status, newValue: updates.status ?? current?.status });
    },
    assignFinding: (findingId, primarySector, supportingSectors, analyst, priority) => {
      const previous = findings.find((finding) => finding.id === findingId);
      const next = findings.map((finding) => finding.id === findingId ? {
        ...finding,
        primarySector,
        supportingSectors,
        sectorId: supportingSectors.length ? 'multi-sector' : primarySector,
        assignedAnalyst: analyst,
        priority,
        status: 'Assigned' as AlertStatus,
        sectorReasons: Object.fromEntries([primarySector, ...supportingSectors].map((sector) => [sector, sector === primarySector ? 'Primary sector selected by Ministry analyst.' : 'Supporting sector added by Ministry analyst.'])),
        lastUpdate: new Date().toLocaleString()
      } : finding);
      persistFindings(next);
      storage.event('Finding assigned', `Finding reassigned from ${previous?.primarySector ?? 'Unassigned'} to ${primarySector}.`, { findingId, sector: primarySector, previousValue: previous?.primarySector, newValue: primarySector });
    },
    setStatus: (findingId, status) => {
      const previous = findings.find((finding) => finding.id === findingId);
      const next = findings.map((finding) => finding.id === findingId ? { ...finding, status, processingStage: status, lastUpdate: new Date().toLocaleString() } : finding);
      persistFindings(next);
      storage.event('Status changed', `Finding ${findingId} status changed to ${status}.`, { findingId, sector: previous?.primarySector, previousValue: previous?.status, newValue: status });
    },
    saveCase: (caseRecord) => {
      const exists = cases.some((item) => item.id === caseRecord.id);
      const next = exists ? cases.map((item) => item.id === caseRecord.id ? caseRecord : item) : [caseRecord, ...cases];
      setCases(next);
      storage.saveCases(next);
      storage.event(exists ? 'Case updated' : 'Case created', `${caseRecord.id} saved.`, { caseId: caseRecord.id, sector: caseRecord.primarySector, newValue: caseRecord.status });
    },
    closeCase: (caseId) => {
      const next = cases.map((item) => item.id === caseId ? { ...item, status: 'Closed' as const } : item);
      setCases(next);
      storage.saveCases(next);
      storage.event('Case closed', `${caseId} closed.`, { caseId, newValue: 'Closed' });
    },
    reopenCase: (caseId) => {
      const next = cases.map((item) => item.id === caseId ? { ...item, status: 'Open' as const } : item);
      setCases(next);
      storage.saveCases(next);
      storage.event('Case reopened', `${caseId} reopened.`, { caseId, newValue: 'Open' });
    },
    addNote: (note) => {
      const created: AnalystNote = { ...note, id: `note-${Date.now()}`, createdAt: new Date().toLocaleString() };
      const next = [created, ...notes];
      setNotes(next);
      storage.saveNotes(next);
      storage.event('Note added', `Note added to ${note.targetId}.`, { findingId: note.targetType === 'finding' ? note.targetId : undefined, caseId: note.targetType === 'case' ? note.targetId : undefined });
    },
    updateNote: (noteId, text) => {
      const target = notes.find((note) => note.id === noteId);
      const next = notes.map((note) => note.id === noteId ? { ...note, text } : note);
      setNotes(next);
      storage.saveNotes(next);
      storage.event('Note edited', `Note edited on ${target?.targetId ?? noteId}.`);
    },
    deleteNote: (noteId) => {
      const target = notes.find((note) => note.id === noteId);
      const next = notes.filter((note) => note.id !== noteId);
      setNotes(next);
      storage.saveNotes(next);
      storage.event('Note deleted', `Note deleted from ${target?.targetId ?? noteId}.`);
    },
    markNotificationRead: (id) => {
      const next = notifications.map((notification) => notification.id === id ? { ...notification, read: true } : notification);
      setNotifications(next);
      storage.saveNotifications(next);
      storage.event('Notification opened', `Notification ${id} marked as read.`);
    },
    markAllNotificationsRead: () => {
      const next = notifications.map((notification) => ({ ...notification, read: true }));
      setNotifications(next);
      storage.saveNotifications(next);
      storage.event('Notifications read', 'All notifications marked as read.');
    },
    updateSettings: (nextSettings) => {
      setSettings(nextSettings);
      storage.saveSettings(nextSettings);
      storage.event('Settings updated', 'Prototype settings updated.');
    },
    resetDemoData: () => {
      storage.reset();
      setFindings(storage.findings());
      setCases(storage.cases());
      setNotes(storage.notes());
      setNotifications(storage.notifications());
      setSettings(storage.settings());
    }
  }), [findings, cases, notes, notifications, settings]);

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
}

export function useAlertStatuses() {
  const context = useContext(PrototypeContext);
  if (!context) {
    throw new Error('useAlertStatuses must be used within AlertStatusProvider');
  }
  return context;
}

export const usePrototype = useAlertStatuses;
