import { type ScoreResult } from '@/lib/scoring';
import { QUADRANTS } from '@/lib/quadrants';

interface SummaryPanelProps {
  result: ScoreResult;
  orgName: string;
  onCopyLink: () => void;
  onPrint: () => void;
}

/**
 * Results summary panel using GOV.UK summary list pattern.
 * Shows scores, quadrant, strengths, constraints, next steps, and export options.
 */
export default function SummaryPanel({ result, orgName, onCopyLink, onPrint }: SummaryPanelProps) {
  const quadrant = QUADRANTS[result.quadrant];

  return (
    <div id="results-summary">
      <h2 className="govuk-heading-m">Assessment summary</h2>

      {/* Summary list */}
      <dl className="govuk-summary-list mb-6">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Organisation</dt>
          <dd className="govuk-summary-list__value">{orgName || 'Unnamed'}</dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Delivery &amp; platform enablement (X)</dt>
          <dd className="govuk-summary-list__value"><strong>{result.xScore}</strong> / 100</dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Governance &amp; change readiness (Y)</dt>
          <dd className="govuk-summary-list__value"><strong>{result.yScore}</strong> / 100</dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Quadrant</dt>
          <dd className="govuk-summary-list__value">
            <span className={`govuk-tag govuk-tag--${quadrant.tagColor} mr-2`}>{quadrant.label}</span>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Guidance</dt>
          <dd className="govuk-summary-list__value">{quadrant.guidance}</dd>
        </div>
      </dl>

      {/* Strengths */}
      <h3 className="govuk-heading-s">Top 3 strengths</h3>
      <ul className="govuk-list govuk-list--bullet mb-6">
        {result.strengths.map(s => (
          <li key={s.key}>
            <strong>{s.label}</strong> — scored {s.value}/5
          </li>
        ))}
      </ul>

      {/* Constraints */}
      <h3 className="govuk-heading-s">Top 3 constraints</h3>
      <ul className="govuk-list govuk-list--bullet mb-6">
        {result.constraints.map(c => (
          <li key={c.key}>
            <strong>{c.label}</strong> — scored {c.value}/5
          </li>
        ))}
      </ul>

      {/* Next steps */}
      <h3 className="govuk-heading-s">Recommended next steps</h3>
      <ul className="govuk-list govuk-list--bullet mb-4">
        {quadrant.nextSteps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ul>

      <div className="govuk-inset-text">
        <strong>Suggested Mission type:</strong> {quadrant.suggestedMissionType}
      </div>

      {/* Export */}
      <div className="flex gap-4 flex-wrap no-print mt-6">
        <button type="button" className="govuk-button govuk-button--secondary" onClick={onCopyLink}>
          Copy share link
        </button>
        <button type="button" className="govuk-button govuk-button--secondary" onClick={onPrint}>
          Download / print summary
        </button>
      </div>
    </div>
  );
}
