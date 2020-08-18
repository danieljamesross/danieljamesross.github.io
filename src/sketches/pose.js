// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/ml5/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR
export default function (s) {
    s.state = {}
    s.dispatch = () => {}
    s.canvasWidth = {}
    s.canvasHeight = {}
    let video = null
    let poseNet = null
    let pose = null
    let skeleton = null

    s.setup = () => {
        s.createCanvas(s.canvasWidth, s.canvasHeight)
	video = s.createCapture(s.VIDEO)
	video.hide()
	poseNet = ml5.poseNet(video, modelLoaded)
	poseNet.on('pose', gotPoses)
	s.filter(INVERT)
    }

    let gotPoses = (poses) =>  {
	/* 	console.log(poses) */
	if (poses.length > 0) {
	    pose = poses[0].pose
	    /* 	    console.log(pose) */
	    skeleton = poses[0].skeleton
	}
    }

    let modelLoaded = () => {
	console.log('poseNet ready')
    }

    s.draw = () => {
	s.image(video, 0, 0)

	
	if (pose) {
	    let eyeR = pose.rightEye
	    let eyeL = pose.leftEye

	    drawSunglasses(eyeL, eyeR)
	   

	}
    }

    let drawSunglasses = (eyeL, eyeR) => {
	let d = s.dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y)
	s.clear()
	s.fill(255, 69, 0)
	s.noStroke()
	s.ellipse(eyeR.x, eyeR.y, d * 0.5)
	s.ellipse(eyeL.x, eyeL.y, d * 0.5)
    }
}
