"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faWordpress,
  faSoundcloud,
} from "@fortawesome/free-brands-svg-icons";

const PORTFOLIO_URL = "https://vitruviandan.wordpress.com";
const EMAIL_URL = "mailto:mr.danielross@gmail.com";
const SOUNDCLOUD_URL = "https://soundcloud.com/daniel-james-ross/";
const GITHUB_URL = "https://github.com/danieljamesross";

export default function Footer() {
  return (
    <div className="footer">
      <a
        href={PORTFOLIO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Portfolio (WordPress)"
      >
        <FontAwesomeIcon
          icon={faWordpress}
          className="faIconFooter"
          aria-hidden
        />
      </a>
      <a href={EMAIL_URL} aria-label="Email">
        <FontAwesomeIcon
          icon={faEnvelope}
          className="faIconFooter"
          aria-hidden
        />
      </a>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
      >
        <FontAwesomeIcon icon={faGithub} className="faIconFooter" aria-hidden />
      </a>
      <a
        href={SOUNDCLOUD_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="SoundCloud"
      >
        <FontAwesomeIcon
          icon={faSoundcloud}
          className="faIconFooter"
          aria-hidden
        />
      </a>
    </div>
  );
}
