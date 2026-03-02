import { Link, useNavigate } from 'react-router-dom';
import { EXAMPLE_ORGANISATIONS } from '@/lib/examples';
import { calculateScores } from '@/lib/scoring';
import { inputsToSearchParams } from '@/lib/urlState';
import { QUADRANTS } from '@/lib/quadrants';

/**
 * Examples page — pre-filled example organisations.
 */
export default function Examples() {
  const navigate = useNavigate();

  const handleUseExample = (index: number) => {
    const example = EXAMPLE_ORGANISATIONS[index];
    const params = inputsToSearchParams(example.name, example.inputs);
    navigate(`/newco-readiness?${params.toString()}`);
  };

  return (
    <div className="govuk-main-wrapper">
      <div className="govuk-width-container">
        <Link to="/newco-readiness" className="govuk-back-link">Back to tool</Link>
        <h1 className="govuk-heading-xl">Example organisations</h1>
        <p className="govuk-body-l">
          These pre-configured examples demonstrate different positions on the readiness quadrant.
          Select one to load it into the assessment tool.
        </p>

        {EXAMPLE_ORGANISATIONS.map((example, i) => {
          const result = calculateScores(example.inputs);
          const quadrant = QUADRANTS[result.quadrant];

          return (
            <div key={i} className="mb-8 border-l-4 pl-4 pb-2" style={{ borderColor: `hsl(var(--govuk-${quadrant.tagColor === 'green' ? 'green' : quadrant.tagColor === 'red' ? 'red' : quadrant.tagColor === 'blue' ? 'blue' : 'yellow'}))` }}>
              <h2 className="govuk-heading-m mb-1">{example.name}</h2>
              <p className="govuk-body mb-2">{example.description}</p>
              <p className="govuk-body-s mb-2">
                <strong>X:</strong> {result.xScore} | <strong>Y:</strong> {result.yScore} |{' '}
                <span className={`govuk-tag govuk-tag--${quadrant.tagColor}`}>{quadrant.label}</span>
              </p>
              <button
                type="button"
                className="govuk-button govuk-button--secondary mb-0"
                onClick={() => handleUseExample(i)}
              >
                Use this example
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
