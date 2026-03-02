/**
 * GOV.UK-style footer.
 */
export default function GovFooter() {
  return (
    <footer className="govuk-footer" role="contentinfo">
      <div className="govuk-width-container">
        <p className="govuk-body-s mb-0" style={{ color: 'hsl(200, 9%, 34%)' }}>
          Built by the <strong>CustomerFirst</strong> transformation team.
          This is a demo tool for internal use only.
        </p>
      </div>
    </footer>
  );
}
