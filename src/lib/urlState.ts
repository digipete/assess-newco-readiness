/**
 * Serialise/deserialise assessment state to/from URL query params.
 */

import { INPUT_KEYS, type AssessmentInputs, type InputKey, EMPTY_INPUTS } from './scoring';

// Short param keys for compact URLs
const PARAM_MAP: Record<InputKey, string> = {
  execSponsorship: 'es',
  decisionVelocity: 'dv',
  ownershipClarity: 'oc',
  crossFunctionalMaturity: 'cf',
  discoveryToDelivery: 'dd',
  productMaturity: 'pm',
  architecturalCoherence: 'ac',
  integrationCapability: 'ic',
  securityEnablement: 'se',
  dataQuality: 'dq',
  analyticsMaturity: 'am',
  supplierFlexibility: 'sf',
  contractConstraints: 'cc',
  changeCapacity: 'cp',
  experimentationAppetite: 'ea',
};

const REVERSE_PARAM_MAP: Record<string, InputKey> = Object.fromEntries(
  Object.entries(PARAM_MAP).map(([k, v]) => [v, k as InputKey])
) as Record<string, InputKey>;

export function inputsToSearchParams(orgName: string, inputs: AssessmentInputs): URLSearchParams {
  const params = new URLSearchParams();
  if (orgName) params.set('org', orgName);
  for (const key of INPUT_KEYS) {
    if (inputs[key] !== 0) {
      params.set(PARAM_MAP[key], String(inputs[key]));
    }
  }
  return params;
}

export function searchParamsToInputs(params: URLSearchParams): { orgName: string; inputs: AssessmentInputs } | null {
  const orgName = params.get('org') || '';
  const hasAny = INPUT_KEYS.some(k => params.has(PARAM_MAP[k]));
  if (!hasAny && !orgName) return null;

  const inputs = { ...EMPTY_INPUTS };
  for (const [shortKey, inputKey] of Object.entries(REVERSE_PARAM_MAP)) {
    const val = params.get(shortKey);
    if (val !== null) {
      const num = parseInt(val, 10);
      if (!isNaN(num) && num >= 0 && num <= 5) {
        inputs[inputKey] = num;
      }
    }
  }
  return { orgName, inputs };
}

const STORAGE_KEY = 'newco-readiness-state';

export function saveToLocalStorage(orgName: string, inputs: AssessmentInputs): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ orgName, inputs }));
}

export function loadFromLocalStorage(): { orgName: string; inputs: AssessmentInputs } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return null;
}
