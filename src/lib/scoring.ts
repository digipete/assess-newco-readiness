/**
 * NewCo Readiness Scoring Model
 * 
 * This module defines the scoring algorithm that maps 15 assessment inputs
 * (each on a 0–5 scale) to two axis scores (0–100):
 *   X-axis: "Delivery & platform enablement"
 *   Y-axis: "Governance & change readiness"
 * 
 * Weights are tweakable via the /newco-readiness/model page and persisted
 * in localStorage. The algorithm uses a weighted average approach.
 */

// ── Input keys ──────────────────────────────────────────────────────────

export const INPUT_KEYS = [
  'execSponsorship',
  'decisionVelocity',
  'ownershipClarity',
  'crossFunctionalMaturity',
  'discoveryToDelivery',
  'productMaturity',
  'architecturalCoherence',
  'integrationCapability',
  'securityEnablement',
  'dataQuality',
  'analyticsMaturity',
  'supplierFlexibility',
  'contractConstraints',
  'changeCapacity',
  'experimentationAppetite',
] as const;

export type InputKey = typeof INPUT_KEYS[number];

// ── Input metadata (labels, hints, groups) ──────────────────────────────

export interface InputMeta {
  key: InputKey;
  label: string;
  hint: string;
  group: string;
  reverseScored?: boolean;
}

export const INPUT_GROUPS: { name: string; description: string; inputs: InputMeta[] }[] = [
  {
    name: 'A) Leadership & decision rights',
    description: 'How effectively the organisation sponsors, steers, and makes decisions.',
    inputs: [
      { key: 'execSponsorship', label: 'Exec sponsorship strength', hint: '0 = no sponsor identified, 5 = active SRO with board-level support', group: 'A' },
      { key: 'decisionVelocity', label: 'Decision velocity', hint: '0 = decisions take months, 5 = rapid, delegated decision-making', group: 'A' },
      { key: 'ownershipClarity', label: 'Clarity of ownership / accountability', hint: '0 = unclear RACI, 5 = single accountable owner for every workstream', group: 'A' },
    ],
  },
  {
    name: 'B) Delivery capability & ways of working',
    description: 'Maturity of agile, product, and cross-functional delivery practices.',
    inputs: [
      { key: 'crossFunctionalMaturity', label: 'Cross-functional team maturity', hint: '0 = siloed teams, 5 = embedded multidisciplinary squads', group: 'B' },
      { key: 'discoveryToDelivery', label: 'Discovery-to-delivery practice maturity', hint: '0 = no discovery phase, 5 = continuous discovery with validated outcomes', group: 'B' },
      { key: 'productMaturity', label: 'Product management maturity', hint: '0 = no product thinking, 5 = empowered product managers with roadmaps', group: 'B' },
    ],
  },
  {
    name: 'C) Technology & integration constraints',
    description: 'How well the technology landscape supports change.',
    inputs: [
      { key: 'architecturalCoherence', label: 'Architectural coherence', hint: '0 = fragmented legacy, 5 = coherent, documented architecture', group: 'C' },
      { key: 'integrationCapability', label: 'Integration capability (APIs/events)', hint: '0 = no APIs, point-to-point only, 5 = mature API/event platform', group: 'C' },
      { key: 'securityEnablement', label: 'Security/compliance enablement (not blockers)', hint: '0 = security blocks progress, 5 = security team enables rapid delivery', group: 'C' },
    ],
  },
  {
    name: 'D) Data & measurement',
    description: 'Quality of data and ability to measure outcomes.',
    inputs: [
      { key: 'dataQuality', label: 'Data quality / availability', hint: '0 = poor, siloed data, 5 = high-quality, accessible data estate', group: 'D' },
      { key: 'analyticsMaturity', label: 'Analytics / performance measurement maturity', hint: '0 = no KPIs tracked, 5 = real-time dashboards driving decisions', group: 'D' },
    ],
  },
  {
    name: 'E) Commercial & supplier landscape',
    description: 'Flexibility of existing contracts and supplier relationships.',
    inputs: [
      { key: 'supplierFlexibility', label: 'Supplier flexibility / ability to change', hint: '0 = locked-in suppliers, 5 = flexible, collaborative supplier base', group: 'E' },
      { key: 'contractConstraints', label: 'Contract constraints (reverse-scored)', hint: '0 = no constraints, 5 = severe constraints. Higher = worse.', group: 'E', reverseScored: true },
    ],
  },
  {
    name: 'F) Change readiness',
    description: 'The organisation\'s capacity and willingness to change.',
    inputs: [
      { key: 'changeCapacity', label: 'Change capacity', hint: '0 = fully saturated, no capacity, 5 = dedicated change capacity', group: 'F' },
      { key: 'experimentationAppetite', label: 'Organisational appetite for experimentation', hint: '0 = risk-averse culture, 5 = actively encourages experimentation', group: 'F' },
    ],
  },
];

// Flat list of all input metadata
export const ALL_INPUTS: InputMeta[] = INPUT_GROUPS.flatMap(g => g.inputs);

// ── Axis definitions ────────────────────────────────────────────────────

export type AxisName = 'x' | 'y';

export const AXIS_LABELS = {
  x: 'Delivery & platform enablement',
  y: 'Governance & change readiness',
} as const;

// Which inputs contribute to each axis
export const X_AXIS_INPUTS: InputKey[] = [
  'crossFunctionalMaturity',
  'discoveryToDelivery',
  'productMaturity',
  'architecturalCoherence',
  'integrationCapability',
  'securityEnablement',
  'dataQuality',
  'analyticsMaturity',
];

export const Y_AXIS_INPUTS: InputKey[] = [
  'execSponsorship',
  'decisionVelocity',
  'ownershipClarity',
  'changeCapacity',
  'experimentationAppetite',
  'supplierFlexibility',
  'contractConstraints', // reverse-scored
];

// ── Weights ─────────────────────────────────────────────────────────────

export type Weights = Record<InputKey, number>;

export const DEFAULT_WEIGHTS: Weights = {
  execSponsorship: 1.0,
  decisionVelocity: 1.0,
  ownershipClarity: 1.0,
  crossFunctionalMaturity: 1.0,
  discoveryToDelivery: 1.0,
  productMaturity: 1.0,
  architecturalCoherence: 1.0,
  integrationCapability: 1.0,
  securityEnablement: 1.0,
  dataQuality: 1.0,
  analyticsMaturity: 1.0,
  supplierFlexibility: 1.0,
  contractConstraints: 1.0,
  changeCapacity: 1.0,
  experimentationAppetite: 1.0,
};

const WEIGHTS_STORAGE_KEY = 'newco-readiness-weights';

/** Load saved weights from localStorage, falling back to defaults */
export function loadWeights(): Weights {
  try {
    const stored = localStorage.getItem(WEIGHTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults so new keys are always present
      return { ...DEFAULT_WEIGHTS, ...parsed };
    }
  } catch { /* ignore parse errors */ }
  return { ...DEFAULT_WEIGHTS };
}

/** Save weights to localStorage */
export function saveWeights(weights: Weights): void {
  localStorage.setItem(WEIGHTS_STORAGE_KEY, JSON.stringify(weights));
}

/** Reset weights to defaults */
export function resetWeights(): void {
  localStorage.removeItem(WEIGHTS_STORAGE_KEY);
}

// ── Assessment inputs type ──────────────────────────────────────────────

export type AssessmentInputs = Record<InputKey, number>;

export const EMPTY_INPUTS: AssessmentInputs = {
  execSponsorship: 0,
  decisionVelocity: 0,
  ownershipClarity: 0,
  crossFunctionalMaturity: 0,
  discoveryToDelivery: 0,
  productMaturity: 0,
  architecturalCoherence: 0,
  integrationCapability: 0,
  securityEnablement: 0,
  dataQuality: 0,
  analyticsMaturity: 0,
  supplierFlexibility: 0,
  contractConstraints: 0,
  changeCapacity: 0,
  experimentationAppetite: 0,
};

// ── Scoring algorithm ───────────────────────────────────────────────────

/**
 * Convert a single 0–5 input to a 0–100 contribution.
 * For reverse-scored inputs (like contractConstraints), invert: (5 - value) * 20
 */
function normalise(value: number, reverseScored: boolean): number {
  const clamped = Math.max(0, Math.min(5, value));
  const effective = reverseScored ? (5 - clamped) : clamped;
  return effective * 20; // 0–100
}

/**
 * Compute a weighted average for a set of input keys.
 * Returns a score 0–100.
 */
function weightedAxisScore(
  inputs: AssessmentInputs,
  axisKeys: InputKey[],
  weights: Weights,
): number {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const key of axisKeys) {
    const meta = ALL_INPUTS.find(m => m.key === key);
    const normalised = normalise(inputs[key], meta?.reverseScored ?? false);
    const weight = weights[key];
    totalWeightedScore += normalised * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;
  return Math.round(totalWeightedScore / totalWeight);
}

export interface ScoreResult {
  xScore: number;
  yScore: number;
  quadrant: QuadrantId;
  strengths: { key: InputKey; label: string; value: number }[];
  constraints: { key: InputKey; label: string; value: number }[];
}

export type QuadrantId = 'ready' | 'leadershipReady' | 'capabilityPresent' | 'notReady';

/**
 * Determine which quadrant the point falls in.
 * Threshold is 50 for both axes.
 */
function determineQuadrant(x: number, y: number): QuadrantId {
  if (x >= 50 && y >= 50) return 'ready';
  if (x < 50 && y >= 50) return 'leadershipReady';
  if (x >= 50 && y < 50) return 'capabilityPresent';
  return 'notReady';
}

/**
 * Main scoring function. Takes assessment inputs and optional weights,
 * returns x/y scores, quadrant, strengths, and constraints.
 */
export function calculateScores(
  inputs: AssessmentInputs,
  weights?: Weights,
): ScoreResult {
  const w = weights ?? loadWeights();

  const xScore = weightedAxisScore(inputs, X_AXIS_INPUTS, w);
  const yScore = weightedAxisScore(inputs, Y_AXIS_INPUTS, w);
  const quadrant = determineQuadrant(xScore, yScore);

  // Compute effective scores for each input (normalised * weight)
  const effectiveScores = ALL_INPUTS.map(meta => {
    const normalised = normalise(inputs[meta.key], meta.reverseScored ?? false);
    return {
      key: meta.key,
      label: meta.label,
      value: inputs[meta.key],
      effectiveScore: normalised * w[meta.key],
    };
  });

  // Sort to find top 3 strengths (highest effective score)
  const sorted = [...effectiveScores].sort((a, b) => b.effectiveScore - a.effectiveScore);
  const strengths = sorted.slice(0, 3).map(({ key, label, value }) => ({ key, label, value }));

  // Top 3 constraints (lowest effective score, or highest constraint signals)
  const weakest = [...effectiveScores].sort((a, b) => a.effectiveScore - b.effectiveScore);
  const constraints = weakest.slice(0, 3).map(({ key, label, value }) => ({ key, label, value }));

  return { xScore, yScore, quadrant, strengths, constraints };
}
