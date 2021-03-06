let cam;

var fragments = [];
const maxFrags = 50;
const maxVelocity = 10;
const fragSize = 3;
const fragFill = 220;
const fragStroke = 0;
const fragGenerateInterval = 1;

var leftEye;
var rightEye;
var eyes;
var gravitors;

let poseNet;
let pose;

var drawCount = 0;

var voice;
const volThreshold = 0.1;

function setup() {
    createCanvas(600,360,WEBGL);
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
    background(0,0,0,250);
    translate(-width/2,-height/2);

//    image(cam,0,0);

    if (pose) {
        eyes.gravs[0].location.x = pose.leftEye.x;
        eyes.gravs[0].location.y = pose.leftEye.y;
        eyes.gravs[1].location.x = pose.rightEye.x;
        eyes.gravs[1].location.y = pose.rightEye.y;

        // eyes.gravs[0] = Gravitor(pose.leftEye.x,pose.leftEye.y);
        // eyes.gravs[1] = Gravitor(pose.rightEye.x,pose.rightEye.y);
    } 


    var vol = voice.getLevel();

    if (fragments.length < maxFrags 
            && vol > volThreshold
            && drawCount % fragGenerateInterval == 0) {
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

    for (g of eyes.gravs) {
        g.cool();
        g.show();
    }

    // eyes.gravs[0].show();
    // eyes.gravs[1].show();

    drawCount++;

}

function gotPoses(poses) {
    if (poses.length > 0) {
        pose = poses[0].pose;
    }
} 


// development continues here!!!
// - halo
