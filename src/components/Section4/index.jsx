import React, { useContext } from 'react'

import { generate } from 'shortid'

import sketchCircSrc from '../../sketches/sketchCircles'
import sketchHorizSrc from '../../sketches/sketchHoriz'
import sketchVertSrc from '../../sketches/sketchVerts'

import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider'
import p5Wrapper from '../P5Wrapper'

const P5Wrapper1 = p5Wrapper(generate())
const P5Wrapper2 = p5Wrapper(generate())
const P5Wrapper3 = p5Wrapper(generate())
const P5Wrapper4 = p5Wrapper(generate())
const P5Wrapper5 = p5Wrapper(generate())

export default function Section4() {
    const dispatch1 = useContext(AppDispatchContext)
    const dispatch2 = useContext(AppDispatchContext)
    const dispatch3 = useContext(AppDispatchContext)
    const dispatch4 = useContext(AppDispatchContext)
    const dispatch5 = useContext(AppDispatchContext)
    const {
        sketchAudio1,
        sketchAudio2,
	sketchAudio3,
	sketchAudio4,
	sketchAudio5,
    } = useContext(AppStateContext)

    return (
        <div className="section">
            <div className="section section-content">
                {sketchAudio1 && (
                    <P5Wrapper1
                        dispatch={dispatch1}
                        sketch={sketchHorizSrc}
                        state={{ sketchAudio1 }}
			canvasWidth={150}
		    	canvasHeight={300}
                    />
                )}
		{sketchAudio2 && (
                    <P5Wrapper2
                        dispatch={dispatch2}
                        sketch={sketchVertSrc}
                        state={{ sketchAudio2 }}
		    	canvasWidth={300}
		    	canvasHeight={150}
                    />
                )}
		{sketchAudio3 && (
                    <P5Wrapper3
                        dispatch={dispatch3}
                        sketch={sketchCircSrc}
                        state={{ sketchAudio3 }}
			canvasWidth={200}
		    	canvasHeight={300}
                    />
                )}
		{sketchAudio4 && (
                    <P5Wrapper4
                        dispatch={dispatch4}
                        sketch={sketchVertSrc}
                        state={{ sketchAudio4 }}
			canvasWidth={300}
		    	canvasHeight={150}
                    />
                )}
		{sketchAudio5 && (
                    <P5Wrapper5
                        dispatch={dispatch5}
                        sketch={sketchHorizSrc}
                        state={{ sketchAudio5 }}
			canvasWidth={150}
		    	canvasHeight={300}
                    />
                )}
            </div>
        </div>
    )
}
