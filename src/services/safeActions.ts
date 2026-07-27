export function safeExecuteAction(actionName: string, action: () => void, onError?: (message: string) => void) {
  try {
    action();
  } catch (error) {
    if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) {
      console.error(`Action failed: ${actionName}`, error);
    }
    onError?.(`${actionName} could not be completed. The application is still usable.`);
  }
}

export function safeRecordLookup<T extends { id: string }>(records: T[], id: string | undefined) {
  if (!id) return undefined;
  return records.find((record) => record.id === id);
}

export function validSectorParam(value: string | null, validIds: string[]) {
  if (!value || value === 'all') return 'all';
  return validIds.includes(value) ? value : 'all';
}
