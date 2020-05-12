import React from 'react'

import MainSection from '../MainSection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faGithub, faWordpress, faSoundcloud } from '@fortawesome/free-brands-svg-icons'

const djr = 'https://vitruviandan.wordpress.com'
const eMail = 'mailto:mr.danielross@gmail.com'
const twitter = 'https://twitter.com/danieljamesross'
const soundCloud = 'https://soundcloud.com/daniel-james-ross/'
const gitHub = 'https://github.com/danieljamesross'

export default function AppContent() {
    return (
	<div className="App">
	    <div className="header">
		<h1>daniel james ross</h1>
	    </div>
	    <div className="header">
		<h2>Interactive Sound, Algorithmic Composition & Creative Programming</h2>
	    </div>
	    <div className="section">
		<MainSection />
	    </div>
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
	    <p className="thanks">
		Adapted from
		<a href='https://github.com/atorov/react-hooks-p5js'
		   target="_blank">
	&nbsp; react-hooks-p5js.
		</a>
	&nbsp; Thank you, Atorov.
	    </p>
	</div>
    )
}
