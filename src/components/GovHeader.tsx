import { Link, useLocation } from 'react-router-dom';

/**
 * GOV.UK-style header with Crown logo placeholder and service navigation.
 */
export default function GovHeader() {
  const location = useLocation();

  const navLinks = [
    { href: '/newco-readiness', label: 'Tool' },
    { href: '/newco-readiness/about', label: 'About' },
    { href: '/newco-readiness/model', label: 'Model' },
    { href: '/newco-readiness/examples', label: 'Examples' },
  ];

  return (
    <header className="govuk-header" role="banner">
      <div className="govuk-header__container">
        <div className="flex items-center gap-6">
          {/* Crown-style logo mark */}
          <Link to="/newco-readiness" className="govuk-header__logo" aria-label="Go to CustomerFirst homepage">
            <span className="hidden sm:inline">GOV.UK</span>
          </Link>
          <Link to="/newco-readiness" className="govuk-header__service-name">
            CustomerFirst
          </Link>
        </div>
        <nav aria-label="Service navigation">
          <ul className="govuk-header__navigation" role="list">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="govuk-header__nav-link"
                  aria-current={location.pathname === link.href ? 'page' : undefined}
                  style={location.pathname === link.href ? { textDecoration: 'underline', textDecorationThickness: '3px' } : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
