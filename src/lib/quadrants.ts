/**
 * Quadrant definitions for the NewCo Readiness tool.
 * Labels and guidance are kept as constants for easy editing.
 */

import type { QuadrantId } from './scoring';

export interface QuadrantDefinition {
  id: QuadrantId;
  label: string;
  guidance: string;
  nextSteps: string[];
  suggestedMissionType: string;
  tagColor: 'green' | 'blue' | 'yellow' | 'red';
}

export const QUADRANTS: Record<QuadrantId, QuadrantDefinition> = {
  ready: {
    id: 'ready',
    label: 'Ready for NewCo',
    guidance: 'Proceed with Mission selection; use standard decision framework.',
    nextSteps: [
      'Identify candidate Missions from the backlog and prioritise by impact.',
      'Establish a Mission team with clear roles and decision rights.',
      'Define success metrics and reporting cadence.',
      'Begin discovery phase on the highest-priority Mission.',
    ],
    suggestedMissionType: 'Full-scope digital transformation mission',
    tagColor: 'green',
  },
  leadershipReady: {
    id: 'leadershipReady',
    label: 'Leadership ready, enablement needed',
    guidance: 'Prioritise platform, integration, and data foundations; start with a constrained Mission.',
    nextSteps: [
      'Commission a technology and data maturity assessment.',
      'Invest in API/integration platform capability.',
      'Start with a low-integration digital journey as a proof of concept.',
      'Establish a cross-functional delivery team and build ways of working.',
    ],
    suggestedMissionType: 'Low-integration digital journey',
    tagColor: 'blue',
  },
  capabilityPresent: {
    id: 'capabilityPresent',
    label: 'Capability present, governance risk',
    guidance: 'Establish decision rights, sponsorship, and a change plan before scaling.',
    nextSteps: [
      'Secure an executive sponsor with board-level authority.',
      'Clarify ownership and accountability (RACI) for transformation.',
      'Develop a change management plan and stakeholder engagement strategy.',
      'Run a timeboxed pilot with clear governance guardrails.',
    ],
    suggestedMissionType: 'Case management slice with governance overlay',
    tagColor: 'yellow',
  },
  notReady: {
    id: 'notReady',
    label: 'Not ready yet',
    guidance: 'Run a timeboxed readiness uplift; avoid high-dependency Missions.',
    nextSteps: [
      'Conduct a readiness uplift programme covering leadership, delivery, and technology.',
      'Assign a senior sponsor to champion transformation readiness.',
      'Build foundational capabilities: cross-functional teams, product thinking, data quality.',
      'Revisit assessment in 3–6 months after uplift activities.',
    ],
    suggestedMissionType: 'Data quality uplift or single-service discovery',
    tagColor: 'red',
  },
};
