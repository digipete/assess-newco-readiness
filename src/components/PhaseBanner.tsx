/**
 * GOV.UK Phase banner component showing the service phase (Alpha/Beta).
 */
export default function PhaseBanner() {
  return (
    <div className="govuk-phase-banner govuk-width-container">
      <p className="govuk-body-s mb-0 py-1">
        <span className="govuk-phase-banner__tag mr-2">Alpha</span>
        This is a new service – your{' '}
        <a href="#" className="govuk-link">feedback</a>{' '}
        will help us to improve it.
      </p>
    </div>
  );
}
