import { Link } from 'react-router-dom';

/**
 * About page explaining the NewCo Readiness Quadrant tool.
 */
export default function About() {
  return (
    <div className="govuk-main-wrapper">
      <div className="govuk-width-container">
        <Link to="/newco-readiness" className="govuk-back-link">Back to tool</Link>
        <h1 className="govuk-heading-xl">About the NewCo Readiness Quadrant</h1>

        <h2 className="govuk-heading-m">What this tool is</h2>
        <p className="govuk-body">
          The NewCo Readiness Quadrant is a practical assessment tool used by the CustomerFirst transformation team
          during early-stage Mission selection. It helps assess how ready an organisation is to adopt a NewCo
          methodology and adhere to the CustomerFirst decision framework.
        </p>

        <h2 className="govuk-heading-m">How it works</h2>
        <ol className="govuk-list govuk-list--number">
          <li>
            <strong>Enter scores</strong> — Assess the organisation across 15 dimensions grouped into 6 categories,
            each on a 0–5 scale.
          </li>
          <li>
            <strong>Calculate</strong> — The tool processes your inputs through a weighted scoring algorithm to produce
            two axis scores (0–100).
          </li>
          <li>
            <strong>Review the quadrant</strong> — The organisation is plotted on a 2×2 quadrant chart showing its
            readiness position with tailored guidance and recommended next steps.
          </li>
          <li>
            <strong>Share or export</strong> — Copy a shareable link or print the summary for inclusion in briefing packs.
          </li>
        </ol>

        <h2 className="govuk-heading-m">The two axes</h2>
        <dl className="govuk-summary-list mb-6">
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">X-axis: Delivery &amp; platform enablement</dt>
            <dd className="govuk-summary-list__value">
              Measures technical capability, delivery maturity, data quality, and integration readiness.
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Y-axis: Governance &amp; change readiness</dt>
            <dd className="govuk-summary-list__value">
              Measures leadership strength, decision-making speed, change capacity, and commercial flexibility.
            </dd>
          </div>
        </dl>

        <h2 className="govuk-heading-m">The four quadrants</h2>
        <table className="govuk-table">
          <thead>
            <tr>
              <th className="govuk-table__header">Quadrant</th>
              <th className="govuk-table__header">Meaning</th>
              <th className="govuk-table__header">Guidance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="govuk-table__cell"><span className="govuk-tag govuk-tag--green">Ready for NewCo</span></td>
              <td className="govuk-table__cell">High delivery capability and strong governance</td>
              <td className="govuk-table__cell">Proceed with Mission selection using the standard decision framework.</td>
            </tr>
            <tr>
              <td className="govuk-table__cell"><span className="govuk-tag">Leadership ready, enablement needed</span></td>
              <td className="govuk-table__cell">Strong governance but gaps in delivery/tech</td>
              <td className="govuk-table__cell">Prioritise platform and data foundations; start with a constrained Mission.</td>
            </tr>
            <tr>
              <td className="govuk-table__cell"><span className="govuk-tag govuk-tag--yellow">Capability present, governance risk</span></td>
              <td className="govuk-table__cell">Good technical capability but weak governance</td>
              <td className="govuk-table__cell">Establish decision rights and a change plan before scaling.</td>
            </tr>
            <tr>
              <td className="govuk-table__cell"><span className="govuk-tag govuk-tag--red">Not ready yet</span></td>
              <td className="govuk-table__cell">Low maturity across the board</td>
              <td className="govuk-table__cell">Run a readiness uplift programme; avoid high-dependency Missions.</td>
            </tr>
          </tbody>
        </table>

        <h2 className="govuk-heading-m">Customising the model</h2>
        <p className="govuk-body">
          The scoring weights can be adjusted on the{' '}
          <Link to="/newco-readiness/model">Model</Link> page. Changes are saved locally in your browser.
          This allows teams to emphasise different factors based on their context.
        </p>

        <div className="govuk-inset-text">
          This tool is for internal use by the CustomerFirst transformation team. It is in <strong>Alpha</strong> and
          subject to change. Contact the team with feedback or questions.
        </div>
      </div>
    </div>
  );
}
