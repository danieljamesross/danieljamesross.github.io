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
      <FontAwesomeIcon
        icon={faWordpress}
        onClick={() => window.open(PORTFOLIO_URL, "_blank")}
        className="faIconFooter"
      />
      <FontAwesomeIcon
        icon={faEnvelope}
        onClick={() => window.open(EMAIL_URL, "_self")}
        className="faIconFooter"
      />
      <FontAwesomeIcon
        icon={faGithub}
        onClick={() => window.open(GITHUB_URL, "_blank")}
        className="faIconFooter"
      />
      <FontAwesomeIcon
        icon={faSoundcloud}
        onClick={() => window.open(SOUNDCLOUD_URL, "_blank")}
        className="faIconFooter"
      />
    </div>
  );
}
