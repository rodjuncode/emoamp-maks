let cam;

let fragments = [];
const maxFrags = 1000;
const maxVelocity = 10;
const fragSize = 4;
const fragFill = 220;
const fragStroke = 0;

var leftEye;
var rightEye;
var eyes;

let poseNet;
let pose;

var voice;
const volThreshold = 0.003;

function setup() {
    createCanvas(600,360);
    gravity = createVector(0,1);

	cam = createCapture(VIDEO);
	cam.size(width, height);
	cam.hide();

    leftEye = Gravitor(width/2,height/2);
    rightEye = Gravitor(width/2,height/2);
    eyes = { gravs: [leftEye,rightEye] };

	poseNet = ml5.poseNet(cam);
    poseNet.on('pose', gotPoses);
    
    voice = new p5.AudioIn();
    voice.start();

}

function draw() {
    background(0);

//    image(cam,0,0);

    if (pose) {
        eyes.gravs[0] = Gravitor(pose.leftEye.x,pose.leftEye.y);
        eyes.gravs[1] = Gravitor(pose.rightEye.x,pose.rightEye.y);
    } 

    var vol = voice.getLevel();

    if (fragments.length < maxFrags 
            && vol > volThreshold) {
        let middleEye = (pose.leftEye.x - pose.rightEye.x)/2;
        let fragX = pose.rightEye.x + middleEye;
        let fragY = pose.nose.y + middleEye;
        let newF = Fragment(fragX,fragY,fragSize,color(fragFill),color(fragStroke),maxVelocity,eyes.gravs); // code better
        newF.reactTo(createVector(random(-10,10),10));
        fragments.push(newF);
    }

    for (f of fragments) {
        f.reactTo(p5.Vector.random2D());
        f.orbit();
        f.checkCrash();        
        f.move();
        f.bounce();
        f.show();
    }

    for (var i = 0; i < fragments.length; i++) {
        if (fragments[i].desintegrate) {
            fragments.splice(i,1);
        }

    }

    eyes.gravs[0].show();
    eyes.gravs[1].show();


}

function gotPoses(poses) {
    if (poses.length > 0) {
        pose = poses[0].pose;
    }
} 


