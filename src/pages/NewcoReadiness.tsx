import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  INPUT_GROUPS,
  type AssessmentInputs,
  type InputKey,
  EMPTY_INPUTS,
  calculateScores,
  type ScoreResult,
} from '@/lib/scoring';
import { EXAMPLE_ORGANISATIONS } from '@/lib/examples';
import { inputsToSearchParams, searchParamsToInputs, saveToLocalStorage, loadFromLocalStorage } from '@/lib/urlState';
import QuadrantChart from '@/components/QuadrantChart';
import SummaryPanel from '@/components/SummaryPanel';

/**
 * Main NewCo Readiness assessment page.
 */
export default function NewcoReadiness() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orgName, setOrgName] = useState('');
  const [inputs, setInputs] = useState<AssessmentInputs>({ ...EMPTY_INPUTS });
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [errors, setErrors] = useState<Partial<Record<InputKey | 'orgName', string>>>({});
  const [hasCalculated, setHasCalculated] = useState(false);

  // Load state from URL params or localStorage on mount
  useEffect(() => {
    const fromUrl = searchParamsToInputs(searchParams);
    if (fromUrl) {
      setOrgName(fromUrl.orgName);
      setInputs(fromUrl.inputs);
      // Auto-calculate if loaded from URL
      const scores = calculateScores(fromUrl.inputs);
      setResult(scores);
      setHasCalculated(true);
      return;
    }
    const fromStorage = loadFromLocalStorage();
    if (fromStorage) {
      setOrgName(fromStorage.orgName);
      setInputs(fromStorage.inputs);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateInput = useCallback((key: InputKey, value: string) => {
    const num = value === '' ? 0 : parseInt(value, 10);
    if (isNaN(num)) return;
    setInputs(prev => ({ ...prev, [key]: Math.max(0, Math.min(5, num)) }));
    // Clear error for this field
    setErrors(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<InputKey | 'orgName', string>> = {};
    for (const group of INPUT_GROUPS) {
      for (const input of group.inputs) {
        const val = inputs[input.key];
        if (val < 0 || val > 5 || !Number.isInteger(val)) {
          newErrors[input.key] = 'Enter a whole number between 0 and 5';
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [inputs]);

  const handleCalculate = useCallback(() => {
    if (!validate()) {
      // Focus error summary
      document.getElementById('error-summary')?.focus();
      return;
    }
    const scores = calculateScores(inputs);
    setResult(scores);
    setHasCalculated(true);
    // Update URL
    const params = inputsToSearchParams(orgName, inputs);
    setSearchParams(params, { replace: true });
    // Save to localStorage
    saveToLocalStorage(orgName, inputs);
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [inputs, orgName, validate, setSearchParams]);

  const handleReset = useCallback(() => {
    setOrgName('');
    setInputs({ ...EMPTY_INPUTS });
    setResult(null);
    setHasCalculated(false);
    setErrors({});
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const handleLoadExample = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = parseInt(e.target.value, 10);
    if (isNaN(idx) || idx < 0) return;
    const example = EXAMPLE_ORGANISATIONS[idx];
    setOrgName(example.name);
    setInputs({ ...example.inputs });
    setResult(null);
    setHasCalculated(false);
    setErrors({});
  }, []);

  const handleCopyLink = useCallback(() => {
    const params = inputsToSearchParams(orgName, inputs);
    const url = `${window.location.origin}/newco-readiness?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard');
    }).catch(() => {
      // Fallback
      prompt('Copy this link:', url);
    });
  }, [orgName, inputs]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const errorKeys = Object.keys(errors) as (InputKey | 'orgName')[];

  return (
    <div className="govuk-main-wrapper">
      <div className="govuk-width-container">
        <h1 className="govuk-heading-xl">NewCo readiness quadrant</h1>
        <p className="govuk-body-l">
          Enter assessment scores to plot an organisation and generate a readiness summary.
        </p>

        {/* Error summary */}
        {errorKeys.length > 0 && (
          <div className="govuk-error-summary" id="error-summary" tabIndex={-1} role="alert" aria-labelledby="error-summary-title">
            <h2 className="govuk-error-summary__title" id="error-summary-title">
              There is a problem
            </h2>
            <ul className="govuk-list govuk-error-summary__list">
              {errorKeys.map(key => (
                <li key={key}>
                  <a href={`#input-${key}`}>{errors[key]}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Organisation name + example loader */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8 items-start">
          <div className="govuk-form-group flex-1">
            <label className="govuk-label" htmlFor="input-orgName">
              Organisation name
            </label>
            <span className="govuk-hint">Optional. Used in the summary and share link.</span>
            <input
              className="govuk-input govuk-input--width-full"
              id="input-orgName"
              type="text"
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="example-select">
              Load an example
            </label>
            <span className="govuk-hint">Pre-filled example organisation.</span>
            <select
              className="govuk-select"
              id="example-select"
              onChange={handleLoadExample}
              defaultValue=""
            >
              <option value="" disabled>Select an example…</option>
              {EXAMPLE_ORGANISATIONS.map((ex, i) => (
                <option key={i} value={i}>{ex.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Input groups */}
        <form onSubmit={e => { e.preventDefault(); handleCalculate(); }}>
          {INPUT_GROUPS.map(group => (
            <fieldset key={group.name} className="mb-8">
              <legend className="govuk-fieldset__legend govuk-heading-m mb-1">{group.name}</legend>
              <p className="govuk-hint mb-4">{group.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
                {group.inputs.map(input => {
                  const hasError = !!errors[input.key];
                  return (
                    <div key={input.key} className={`govuk-form-group ${hasError ? 'govuk-form-group--error' : ''}`}>
                      <label className="govuk-label govuk-label--s" htmlFor={`input-${input.key}`}>
                        {input.label}
                      </label>
                      <span className="govuk-hint" id={`hint-${input.key}`}>{input.hint}</span>
                      {hasError && (
                        <span className="govuk-error-message" id={`error-${input.key}`}>
                          <span className="sr-only">Error:</span> {errors[input.key]}
                        </span>
                      )}
                      <input
                        className={`govuk-input ${hasError ? 'govuk-input--error' : ''}`}
                        id={`input-${input.key}`}
                        type="number"
                        min={0}
                        max={5}
                        step={1}
                        value={inputs[input.key]}
                        onChange={e => updateInput(input.key, e.target.value)}
                        aria-describedby={`hint-${input.key}${hasError ? ` error-${input.key}` : ''}`}
                        style={{ width: '80px' }}
                      />
                    </div>
                  );
                })}
              </div>
            </fieldset>
          ))}

          {/* Actions */}
          <div className="flex gap-4 items-center flex-wrap">
            <button type="submit" className="govuk-button">
              Calculate and plot
            </button>
            <button type="button" className="govuk-button govuk-button--secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        {/* Results */}
        {hasCalculated && result && (
          <div id="results-section" className="mt-10">
            <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />
            <h2 className="govuk-heading-l">Results{orgName ? `: ${orgName}` : ''}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <QuadrantChart result={result} orgName={orgName} />
              <SummaryPanel
                result={result}
                orgName={orgName}
                onCopyLink={handleCopyLink}
                onPrint={handlePrint}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
