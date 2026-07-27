import type { NavigateFunction, NavigateOptions } from 'react-router-dom';

type SafeNavigateOptions = NavigateOptions & {
  fallback?: string;
  onError?: (message: string) => void;
  validFindingIds?: string[];
  validCaseIds?: string[];
};

const appRoutePatterns = [
  /^\/$/,
  /^\/findings$/,
  /^\/alerts$/,
  /^\/investigation\/[^/?#]+$/,
  /^\/accounts(?:\/[^/?#]+)?$/,
  /^\/vulnerabilities$/,
  /^\/dark-web$/,
  /^\/social-osint$/,
  /^\/cases(?:\/[^/?#]+)?$/,
  /^\/unassigned$/,
  /^\/sources$/,
  /^\/notifications$/,
  /^\/audit$/,
  /^\/analytics$/,
  /^\/settings$/
];

export function isKnownAppPath(destination: string) {
  const [path] = destination.split(/[?#]/);
  return appRoutePatterns.some((pattern) => pattern.test(path));
}

export function safeNavigate(destination: unknown, navigate: NavigateFunction, options: SafeNavigateOptions = {}) {
  const fallback = options.fallback ?? '/';
  const technicalReason = validateDestination(destination, options);

  if (technicalReason) {
    if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) {
      console.error('Navigation prevented', { destination, reason: technicalReason });
    }
    options.onError?.('The requested destination is unavailable. Returning to the dashboard.');
    navigate(fallback, { replace: true });
    return false;
  }

  navigate(destination as string, options);
  return true;
}

function validateDestination(destination: unknown, options: SafeNavigateOptions) {
  if (typeof destination !== 'string' || destination.trim().length === 0) {
    return 'Destination must be a non-empty string.';
  }

  if (!destination.startsWith('/')) {
    return 'Only internal absolute application paths are allowed.';
  }

  if (!isKnownAppPath(destination)) {
    return 'Destination does not match a known application route.';
  }

  const [path] = destination.split(/[?#]/);
  const investigationMatch = path.match(/^\/investigation\/([^/?#]+)$/);
  if (investigationMatch && options.validFindingIds && !options.validFindingIds.includes(investigationMatch[1])) {
    return 'Finding ID does not exist in the current dataset.';
  }

  const caseMatch = path.match(/^\/cases\/([^/?#]+)$/);
  if (caseMatch && options.validCaseIds && !options.validCaseIds.includes(caseMatch[1])) {
    return 'Case ID does not exist in the current dataset.';
  }

  return undefined;
}
