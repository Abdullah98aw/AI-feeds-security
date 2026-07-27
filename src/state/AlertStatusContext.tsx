import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { generateLiveSimulationEvent } from '../data/liveSimulationEvents';
import { defaultSimulationState, storage } from '../services/storage';
import type { Alert, AlertStatus, AnalystNote, InvestigationCase, Language, LiveSimulationToast, NotificationRecord, Priority, PrototypeSettings, SectorId, SimulationState } from '../types';

interface PrototypeContextValue {
  findings: Alert[];
  cases: InvestigationCase[];
  notes: AnalystNote[];
  notifications: NotificationRecord[];
  settings: PrototypeSettings;
  simulation: SimulationState;
  simulationNow: number;
  liveToasts: LiveSimulationToast[];
  language: Language;
  setLanguage: (language: Language) => void;
  getStatus: (findingId: string) => AlertStatus;
  updateFinding: (findingId: string, updates: Partial<Alert>, action?: string) => void;
  assignFinding: (findingId: string, primarySector: SectorId, supportingSectors: SectorId[], analyst: string, priority: Priority) => void;
  setStatus: (findingId: string, status: AlertStatus) => void;
  saveCase: (caseRecord: InvestigationCase) => void;
  closeCase: (caseId: string) => void;
  reopenCase: (caseId: string) => void;
  addNote: (note: Omit<AnalystNote, 'id' | 'createdAt'>) => AnalystNote;
  updateNote: (noteId: string, text: string) => void;
  deleteNote: (noteId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateSettings: (settings: PrototypeSettings) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  stopSimulation: () => void;
  restartSimulation: () => void;
  clearSimulatedNotifications: () => void;
  dismissLiveToast: (id: string) => void;
  setLiveToastsMuted: (muted: boolean) => void;
  resetDemoData: () => void;
}

const PrototypeContext = createContext<PrototypeContextValue | undefined>(undefined);

export function AlertStatusProvider({ children }: { children: ReactNode }) {
  const [findings, setFindings] = useState(() => storage.findings());
  const [cases, setCases] = useState(() => storage.cases());
  const [notes, setNotes] = useState(() => storage.notes());
  const [notifications, setNotifications] = useState(() => storage.notifications());
  const [settings, setSettings] = useState(() => storage.settings());
  const [simulation, setSimulation] = useState(() => reconcileSimulation(storage.simulation()));
  const [simulationNow, setSimulationNow] = useState(() => Date.now());
  const [liveToasts, setLiveToasts] = useState<LiveSimulationToast[]>([]);
  const findingsRef = useRef(findings);
  const notificationsRef = useRef(notifications);
  const settingsRef = useRef(settings);
  const simulationRef = useRef(simulation);

  useEffect(() => { findingsRef.current = findings; }, [findings]);
  useEffect(() => { notificationsRef.current = notifications; }, [notifications]);
  useEffect(() => { settingsRef.current = settings; }, [settings]);
  useEffect(() => { simulationRef.current = simulation; }, [simulation]);

  const persistFindings = (next: Alert[]) => {
    setFindings(next);
    storage.saveFindings(next);
  };

  const saveSimulation = useCallback((next: SimulationState) => {
    const reconciled = reconcileSimulation(next);
    simulationRef.current = reconciled;
    setSimulation(reconciled);
    storage.saveSimulation(reconciled);
  }, []);

  const pushToast = useCallback((toast: LiveSimulationToast) => {
    if (!settingsRef.current.liveSimulationSettings.toastEnabled || simulationRef.current.muted) return;
    setLiveToasts((current) => [toast, ...current].slice(0, 3));
  }, []);

  const emitSimulationEvent = useCallback(() => {
    const current = simulationRef.current;
    const generated = generateLiveSimulationEvent({
      existingCount: findingsRef.current.length + current.generatedCount,
      recentSignatures: current.recentSignatures
    });
    const liveSettings = settingsRef.current.liveSimulationSettings;

    if (liveSettings.autoCreateFindings) {
      const nextFindings = [generated.finding, ...findingsRef.current];
      findingsRef.current = nextFindings;
      setFindings(nextFindings);
      storage.saveFindings(nextFindings);
    }

    const nextNotifications = [generated.notification, ...notificationsRef.current].slice(0, 240);
    notificationsRef.current = nextNotifications;
    setNotifications(nextNotifications);
    storage.saveNotifications(nextNotifications);

    if (liveSettings.autoCreateAuditEvents) {
      storage.event('Simulated live event generated', `${generated.finding.id} created from controlled live simulation.`, {
        findingId: liveSettings.autoCreateFindings ? generated.finding.id : undefined,
        sector: generated.finding.primarySector,
        newValue: generated.finding.status
      });
    }

    const nextSimulation: SimulationState = {
      ...current,
      generatedCount: current.generatedCount + 1,
      nextEventAt: Date.now() + current.intervalMs,
      recentSignatures: [generated.signature, ...current.recentSignatures].slice(0, 10)
    };
    saveSimulation(nextSimulation);
    pushToast({
      id: generated.notification.id,
      title: generated.notification.title ?? generated.finding.category,
      severity: generated.finding.severity,
      sector: generated.finding.primarySector,
      sectorName: generated.finding.sectorName,
      source: generated.finding.source,
      time: generated.finding.collectionTime,
      findingId: liveSettings.autoCreateFindings ? generated.finding.id : undefined
    });
  }, [pushToast, saveSimulation]);

  const completeSimulation = useCallback(() => {
    const now = Date.now();
    const next: SimulationState = { ...simulationRef.current, status: 'Completed', completedAt: now, nextEventAt: null, pausedRemainingMs: null, pausedNextEventMs: null };
    saveSimulation(next);
    const notification: NotificationRecord = {
      id: `sim-complete-${now}`,
      title: 'Live simulation completed',
      messageAr: 'اكتمل تشغيل المحاكاة التجريبية لمدة العرض المحددة.',
      severity: 'Informational',
      sector: 'admin',
      source: 'Messaging Channel',
      simulated: true,
      time: new Date(now).toLocaleString(),
      read: false
    };
    const nextNotifications = [notification, ...notificationsRef.current].slice(0, 240);
    notificationsRef.current = nextNotifications;
    setNotifications(nextNotifications);
    storage.saveNotifications(nextNotifications);
    storage.event('Live simulation completed', 'Controlled live threat simulation completed automatically.', { newValue: 'Completed' });
    pushToast({ id: notification.id, title: notification.title ?? 'Live simulation completed', severity: 'Informational', sector: 'admin', sectorName: 'Ministry Admin', source: 'Messaging Channel', time: notification.time });
  }, [pushToast, saveSimulation]);

  useEffect(() => {
    if (simulation.status !== 'Running') return undefined;
    const timer = window.setInterval(() => {
      const now = Date.now();
      setSimulationNow(now);
      const current = simulationRef.current;
      if (current.status !== 'Running' || !current.startedAt) return;
      if (now >= current.startedAt + current.durationMs) {
        completeSimulation();
        return;
      }
      if (current.nextEventAt && now >= current.nextEventAt) {
        emitSimulationEvent();
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [completeSimulation, emitSimulationEvent, simulation.status]);

  const startSimulation = useCallback(() => {
    if (simulationRef.current.status === 'Running') return;
    const now = Date.now();
    const settings = settingsRef.current.liveSimulationSettings;
    const intervalMs = clamp(settings.eventIntervalSeconds, 5, 60) * 1000;
    const durationMs = clamp(settings.durationMinutes, 1, 30) * 60 * 1000;
    const next: SimulationState = {
      ...defaultSimulationState,
      status: 'Running',
      startedAt: now,
      durationMs,
      intervalMs,
      nextEventAt: now + intervalMs,
      muted: simulationRef.current.muted
    };
    saveSimulation(next);
    storage.event('Live simulation started', 'Controlled live threat simulation started.', { newValue: 'Running' });
  }, [saveSimulation]);

  const pauseSimulation = useCallback(() => {
    const current = simulationRef.current;
    if (current.status !== 'Running' || !current.startedAt) return;
    const now = Date.now();
    saveSimulation({
      ...current,
      status: 'Paused',
      pausedRemainingMs: Math.max(0, current.startedAt + current.durationMs - now),
      pausedNextEventMs: Math.max(0, (current.nextEventAt ?? now) - now),
      nextEventAt: null
    });
    storage.event('Live simulation paused', 'Controlled live threat simulation paused.', { newValue: 'Paused' });
  }, [saveSimulation]);

  const resumeSimulation = useCallback(() => {
    const current = simulationRef.current;
    if (current.status !== 'Paused') return;
    const now = Date.now();
    const remaining = current.pausedRemainingMs ?? current.durationMs;
    saveSimulation({
      ...current,
      status: 'Running',
      startedAt: now - (current.durationMs - remaining),
      nextEventAt: now + (current.pausedNextEventMs ?? current.intervalMs),
      pausedRemainingMs: null,
      pausedNextEventMs: null
    });
    storage.event('Live simulation resumed', 'Controlled live threat simulation resumed.', { newValue: 'Running' });
  }, [saveSimulation]);

  const stopSimulation = useCallback(() => {
    const now = Date.now();
    saveSimulation({ ...simulationRef.current, status: 'Stopped', completedAt: now, nextEventAt: null, pausedRemainingMs: null, pausedNextEventMs: null });
    storage.event('Live simulation stopped', 'Controlled live threat simulation stopped by user.', { newValue: 'Stopped' });
  }, [saveSimulation]);

  const restartSimulation = useCallback(() => {
    stopSimulation();
    window.setTimeout(startSimulation, 0);
  }, [startSimulation, stopSimulation]);

  const clearSimulatedNotifications = useCallback(() => {
    const next = notificationsRef.current.filter((notification) => !notification.simulated);
    notificationsRef.current = next;
    setNotifications(next);
    storage.saveNotifications(next);
    setLiveToasts([]);
    storage.event('Simulated notifications cleared', 'Simulated live notifications cleared from Notification Center.');
  }, []);

  const dismissLiveToast = useCallback((id: string) => setLiveToasts((current) => current.filter((toast) => toast.id !== id)), []);

  const setLiveToastsMuted = useCallback((muted: boolean) => {
    saveSimulation({ ...simulationRef.current, muted });
    if (muted) setLiveToasts([]);
  }, [saveSimulation]);

  const value = useMemo<PrototypeContextValue>(() => ({
    findings,
    cases,
    notes,
    notifications,
    settings,
    simulation,
    simulationNow,
    liveToasts,
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
        status: finding.status === 'New' || finding.status === 'Verification Required' ? 'Assigned' as AlertStatus : finding.status,
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
      return created;
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
      const clampedSettings = {
        ...nextSettings,
        liveSimulationSettings: {
          ...nextSettings.liveSimulationSettings,
          eventIntervalSeconds: clamp(nextSettings.liveSimulationSettings.eventIntervalSeconds, 5, 60),
          durationMinutes: clamp(nextSettings.liveSimulationSettings.durationMinutes, 1, 30),
          soundEnabled: false
        }
      };
      setSettings(clampedSettings);
      storage.saveSettings(clampedSettings);
      storage.event('Settings updated', 'Prototype settings updated.');
    },
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    stopSimulation,
    restartSimulation,
    clearSimulatedNotifications,
    dismissLiveToast,
    setLiveToastsMuted,
    resetDemoData: () => {
      storage.reset();
      setFindings(storage.findings());
      setCases(storage.cases());
      setNotes(storage.notes());
      setNotifications(storage.notifications());
      setSettings(storage.settings());
      saveSimulation(storage.simulation());
      setLiveToasts([]);
    }
  }), [findings, cases, notes, notifications, settings, simulation, simulationNow, liveToasts, startSimulation, pauseSimulation, resumeSimulation, stopSimulation, restartSimulation, clearSimulatedNotifications, dismissLiveToast, setLiveToastsMuted, saveSimulation]);

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

function reconcileSimulation(state: SimulationState): SimulationState {
  if (state.status !== 'Running' || !state.startedAt) return state;
  const now = Date.now();
  if (now >= state.startedAt + state.durationMs) {
    return { ...state, status: 'Completed', completedAt: state.completedAt ?? now, nextEventAt: null, pausedRemainingMs: null, pausedNextEventMs: null };
  }
  return state;
}

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}
