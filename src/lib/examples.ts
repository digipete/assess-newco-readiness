/**
 * Pre-configured example organisations demonstrating different quadrants.
 */

import type { AssessmentInputs } from './scoring';

export interface ExampleOrg {
  name: string;
  description: string;
  inputs: AssessmentInputs;
}

export const EXAMPLE_ORGANISATIONS: ExampleOrg[] = [
  {
    name: 'Digital Services Agency',
    description: 'A mature digital organisation with strong leadership and modern practices.',
    inputs: {
      execSponsorship: 5,
      decisionVelocity: 4,
      ownershipClarity: 4,
      crossFunctionalMaturity: 5,
      discoveryToDelivery: 4,
      productMaturity: 4,
      architecturalCoherence: 4,
      integrationCapability: 4,
      securityEnablement: 4,
      dataQuality: 4,
      analyticsMaturity: 4,
      supplierFlexibility: 4,
      contractConstraints: 1,
      changeCapacity: 4,
      experimentationAppetite: 5,
    },
  },
  {
    name: 'Legacy Benefits Authority',
    description: 'Strong political sponsorship but heavily constrained by legacy technology.',
    inputs: {
      execSponsorship: 4,
      decisionVelocity: 3,
      ownershipClarity: 4,
      crossFunctionalMaturity: 2,
      discoveryToDelivery: 1,
      productMaturity: 1,
      architecturalCoherence: 1,
      integrationCapability: 1,
      securityEnablement: 2,
      dataQuality: 2,
      analyticsMaturity: 1,
      supplierFlexibility: 4,
      contractConstraints: 2,
      changeCapacity: 3,
      experimentationAppetite: 3,
    },
  },
  {
    name: 'Technical Innovation Hub',
    description: 'Excellent technical capability but weak governance and change management.',
    inputs: {
      execSponsorship: 1,
      decisionVelocity: 2,
      ownershipClarity: 2,
      crossFunctionalMaturity: 4,
      discoveryToDelivery: 5,
      productMaturity: 4,
      architecturalCoherence: 5,
      integrationCapability: 5,
      securityEnablement: 4,
      dataQuality: 4,
      analyticsMaturity: 4,
      supplierFlexibility: 2,
      contractConstraints: 4,
      changeCapacity: 1,
      experimentationAppetite: 2,
    },
  },
  {
    name: 'Traditional Policy Department',
    description: 'Low maturity across the board; needs significant uplift before transformation.',
    inputs: {
      execSponsorship: 1,
      decisionVelocity: 1,
      ownershipClarity: 2,
      crossFunctionalMaturity: 1,
      discoveryToDelivery: 0,
      productMaturity: 0,
      architecturalCoherence: 1,
      integrationCapability: 1,
      securityEnablement: 2,
      dataQuality: 1,
      analyticsMaturity: 0,
      supplierFlexibility: 1,
      contractConstraints: 4,
      changeCapacity: 1,
      experimentationAppetite: 1,
    },
  },
  {
    name: 'Mid-Transformation Revenue Body',
    description: 'On a transformation journey — strong in some areas, developing in others.',
    inputs: {
      execSponsorship: 4,
      decisionVelocity: 3,
      ownershipClarity: 3,
      crossFunctionalMaturity: 3,
      discoveryToDelivery: 3,
      productMaturity: 3,
      architecturalCoherence: 3,
      integrationCapability: 3,
      securityEnablement: 3,
      dataQuality: 3,
      analyticsMaturity: 2,
      supplierFlexibility: 3,
      contractConstraints: 2,
      changeCapacity: 3,
      experimentationAppetite: 3,
    },
  },
];
