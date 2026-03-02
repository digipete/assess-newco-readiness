import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ALL_INPUTS,
  X_AXIS_INPUTS,
  Y_AXIS_INPUTS,
  type Weights,
  type InputKey,
  DEFAULT_WEIGHTS,
  loadWeights,
  saveWeights,
  resetWeights,
  AXIS_LABELS,
} from '@/lib/scoring';

/**
 * Model tuning page — shows and edits scoring weights.
 */
export default function Model() {
  const [weights, setWeights] = useState<Weights>(loadWeights);
  const [saved, setSaved] = useState(false);

  const getAxis = (key: InputKey): string => {
    if (X_AXIS_INPUTS.includes(key)) return AXIS_LABELS.x;
    if (Y_AXIS_INPUTS.includes(key)) return AXIS_LABELS.y;
    return '—';
  };

  const handleWeightChange = useCallback((key: InputKey, value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    setWeights(prev => ({ ...prev, [key]: Math.max(0, Math.min(3, num)) }));
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    saveWeights(weights);
    setSaved(true);
  }, [weights]);

  const handleReset = useCallback(() => {
    resetWeights();
    setWeights({ ...DEFAULT_WEIGHTS });
    setSaved(false);
  }, []);

  return (
    <div className="govuk-main-wrapper">
      <div className="govuk-width-container">
        <Link to="/newco-readiness" className="govuk-back-link">Back to tool</Link>
        <h1 className="govuk-heading-xl">Scoring model</h1>
        <p className="govuk-body-l">
          Adjust the weights used to calculate axis scores. Each input contributes to either
          the X-axis (Delivery &amp; platform enablement) or Y-axis (Governance &amp; change readiness).
        </p>
        <p className="govuk-body">
          Weights range from 0.0 (excluded) to 3.0 (triple emphasis). Default is 1.0 for all inputs.
          Changes are saved in your browser.
        </p>

        <table className="govuk-table">
          <thead>
            <tr>
              <th className="govuk-table__header" style={{ width: '35%' }}>Input</th>
              <th className="govuk-table__header" style={{ width: '40%' }}>Axis</th>
              <th className="govuk-table__header" style={{ width: '15%' }}>Weight</th>
              <th className="govuk-table__header" style={{ width: '10%' }}>Default</th>
            </tr>
          </thead>
          <tbody>
            {ALL_INPUTS.map(input => (
              <tr key={input.key}>
                <td className="govuk-table__cell">
                  {input.label}
                  {input.reverseScored && <span className="govuk-hint mb-0 mt-1" style={{ fontSize: '14px' }}>(reverse-scored)</span>}
                </td>
                <td className="govuk-table__cell" style={{ fontSize: '16px' }}>{getAxis(input.key)}</td>
                <td className="govuk-table__cell">
                  <input
                    className="govuk-input"
                    type="number"
                    min={0}
                    max={3}
                    step={0.1}
                    value={weights[input.key]}
                    onChange={e => handleWeightChange(input.key, e.target.value)}
                    aria-label={`Weight for ${input.label}`}
                    style={{ width: '70px' }}
                  />
                </td>
                <td className="govuk-table__cell" style={{ fontSize: '16px', color: 'hsl(200, 9%, 34%)' }}>
                  {DEFAULT_WEIGHTS[input.key]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex gap-4 items-center flex-wrap">
          <button type="button" className="govuk-button" onClick={handleSave}>
            Save model
          </button>
          <button type="button" className="govuk-button govuk-button--secondary" onClick={handleReset}>
            Reset to default model
          </button>
          {saved && (
            <span className="govuk-tag govuk-tag--green">Saved</span>
          )}
        </div>
      </div>
    </div>
  );
}
