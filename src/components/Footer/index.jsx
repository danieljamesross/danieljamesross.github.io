import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faGithub, faWordpress, faSoundcloud } from '@fortawesome/free-brands-svg-icons';

const djr = 'https://vitruviandan.wordpress.com';
const eMail = 'mailto:mr.danielross@gmail.com';
const twitter = 'https://twitter.com/danieljamesross';
const soundCloud = 'https://soundcloud.com/daniel-james-ross/';
const gitHub = 'https://github.com/danieljamesross';

export default function Footer() {
    return (
	    <div className="footer">
		<FontAwesomeIcon icon={faWordpress}
		onClick={() =>
		    window.open(djr,'_blank')}
		className="faIcon" />
		<FontAwesomeIcon icon={faEnvelope}
		onClick={() =>
		    window.open(eMail,'_self')}
		className="faIcon" />
		<FontAwesomeIcon icon={faGithub}
		onClick={() =>
		    window.open(gitHub,'_blank')}
		className="faIcon" />
		<FontAwesomeIcon icon={faSoundcloud}
		onClick={() =>
		    window.open(soundCloud,'_blank')}
		className="faIcon" />
		<FontAwesomeIcon icon={faTwitter}
		onClick={() =>
		    window.open(twitter,'_blank')}
		className="faIcon" />
	    </div>
    );
}
