(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{394:function(e,r,t){"use strict";t.r(r),t.d(r,"AppDispatchContext",(function(){return y})),t.d(r,"AppStateContext",(function(){return S}));var n=t(12),a=t.n(n),o=t(397),c=t.n(o),s={sketchAudio1:!1,sketchAudio2:!1,sketchAudio3:!1,sketchAudio4:!1,sketchAudio5:!1,startButton:!0,recordButton:!1,playButton:!1,pauseButton:!1,clearButton:!1,recordGesture:!1,playGesture:!1,playError:!1,slider:0,showSlider:!1,showGesture:!1,checkbox:!1,speedScaler:1,sectionNum:0,sliderMax:100,showTitle:!0,changeSection:!1,circColour:"rgb(10,25,48)",horizColour:"rgb(10,25,48)",vertColour:"rgb(10,25,48)",circRms:1,vertRms:1,horizRms:1,numSections:25,infoPage:!1,trashed:!1,canvasScaler:window.outerWidth<=600?.4:1};function i(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function u(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?i(Object(t),!0).forEach((function(r){l(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}var h=function(e,r){var t,n,a=r.type,o=r.payload;switch(a){case"START":return u(u({},e),{},(l(t={sketchAudio1:!0,sketchAudio2:!0,sketchAudio3:!0,sketchAudio4:!0,sketchAudio5:!0,startButton:!1,recordButton:!0,playButton:!0,clearButton:!0,showSlider:!0,checkbox:!0,slider:0,sliderMax:100},"showSlider",!1),l(t,"speedScaler",1),l(t,"showTitle",!1),l(t,"playGesture",!1),l(t,"canvasCircleWidth",300*e.canvasScaler),l(t,"canvasCircleHeight",300*e.canvasScaler),l(t,"canvasVertWidth",300*e.canvasScaler),l(t,"canvasVertHeight",100*e.canvasScaler),l(t,"canvasHorizWidth",100*e.canvasScaler),l(t,"canvasHorizHeight",300*e.canvasScaler),l(t,"showMenu",!0),t));case"END":return u(u({},e),{},(l(n={sketchAudio1:!0,sketchAudio2:!0,sketchAudio3:!0,sketchAudio4:!0,sketchAudio5:!0,startButton:!1,recordButton:!0,playButton:!0,clearButton:!0,showSlider:!0,checkbox:!0},"showSlider",!1),l(n,"speedScaler",1),l(n,"sectionNum",0),l(n,"showTitle",!1),l(n,"playGesture",!1),l(n,"canvasCircleWidth",300*e.canvasScaler),l(n,"canvasCircleHeight",300*e.canvasScaler),l(n,"canvasVertWidth",300*e.canvasScaler),l(n,"canvasVertHeight",100*e.canvasScaler),l(n,"canvasHorizWidth",100*e.canvasScaler),l(n,"canvasHorizHeight",300*e.canvasScaler),l(n,"canvasScaler",window.innerWidth<=600?.4:1),l(n,"showMenu",!0),l(n,"readyToGo",!1),l(n,"trashed",!1),n));case"SET_PLAY_GESTURE":return u(u({},e),{},{playGesture:!0,playButton:!1,pauseButton:!0,playError:!1,showSlider:!0,sectionNum:0===e.sectionNum?1:e.sectionNum,readyToGo:!1,recordGesture:!1,showTitle:!1,trashed:!1});case"SHOW_ERROR":return u(u({},e),{},{playError:!0,sectionNum:0});case"SET_PAUSE_GESTURE":return u(u({},e),{},{playGesture:!1,playButton:!0,pauseButton:!1});case"SET_SECTION":return u(u({},e),{},{trashed:!1},o);case"TOGGLE_RECORD_GESTURE":return u(u({},e),{},{recordGesture:!e.recordGesture,playError:!1,trashed:!1});case"TOGGLE_PLAY_GESTURE":return u(u({},e),{},{playGesture:!e.playGesture,playButton:!e.playButton,pauseButton:!e.pauseButton,recordGesture:!1,trashed:!1,slider:0});case"TOGGLE_SKETCH":return u(u({},e),{},l({},o.key,o.value));case"SET_SLIDER_VALUE":return u(u({},e),{},{slider:o});case"INC_SLIDER_VALUE":return u(u({},e),{},{slider:e.slider+1});case"TOGGLE_SHOW_GESTURE":return u(u({},e),{},{showGesture:!e.showGesture,trashed:!1});case"SLIDER_MAX":return u(u({},e),{},{playGesture:!1,playButton:!0,pauseButton:!1,sectionNum:e.sectionNum+1});case"SET_COLOURS":return u(u({},e),{},{circColour:o.circColour,horizColour:o.horizColour,vertColour:o.vertColour});case"SET_COLOUR_DOMAINS":return u(u({},e),{},{circDom:o.circDom,horizDom:o.horizDom,vertDom:o.vertDom});case"SET_VERT_RMS":return u(u({},e),{},{vertRms:o});case"SET_CIRC_RMS":return u(u({},e),{},{circRms:o});case"SET_HORIZ_RMS":return u(u({},e),{},{horizRms:o});case"TOGGLE_INFO":return u(u({},e),{},{infoPage:!e.infoPage});case"TRASHED":return u(u({},e),{},{trashed:!0});case"SET_CANVAS_SCALER":return u(u({},e),{},{canvasScaler:o,canvasCircleWidth:300*o,canvasCircleHeight:300*o,canvasHorizWidth:100*o,canvasHorizHeight:300*o,canvasVertWidth:300*o,canvasVertHeight:100*o});default:return e}};function p(e,r){return function(e){if(Array.isArray(e))return e}(e)||function(e,r){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var t=[],n=!0,a=!1,o=void 0;try{for(var c,s=e[Symbol.iterator]();!(n=(c=s.next()).done)&&(t.push(c.value),!r||t.length!==r);n=!0);}catch(e){a=!0,o=e}finally{try{n||null==s.return||s.return()}finally{if(a)throw o}}return t}(e,r)||function(e,r){if(!e)return;if("string"==typeof e)return d(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(e);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return d(e,r)}(e,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function d(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}var y=Object(n.createContext)((function(){})),S=Object(n.createContext)(s);function v(e){var r=e.children,t=p(Object(n.useReducer)(h,s),2),o=t[0],c=t[1];return a.a.createElement(y.Provider,{value:c},a.a.createElement(S.Provider,{value:o},r))}v.propTypes={children:c.a.any.isRequired};r.default=v},397:function(e,r,t){e.exports=t(406)()},406:function(e,r,t){"use strict";var n=t(407);function a(){}function o(){}o.resetWarningCache=a,e.exports=function(){function e(e,r,t,a,o,c){if(c!==n){var s=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw s.name="Invariant Violation",s}}function r(){return e}e.isRequired=e;var t={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:r,element:e,elementType:e,instanceOf:r,node:e,objectOf:r,oneOf:r,oneOfType:r,shape:r,exact:r,checkPropTypes:o,resetWarningCache:a};return t.PropTypes=t,t}},407:function(e,r,t){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"}}]);
//# sourceMappingURL=4.7352.js.map