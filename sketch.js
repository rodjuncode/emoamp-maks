let cam;

let fragments = [];
let maxFrags = 1000;
let gravity;

let poseNet;
let pose;

function setup() {
    createCanvas(600,360);
    gravity = createVector(0,1);

	cam = createCapture(VIDEO);
	cam.size(width, height);
	cam.hide();

	// poseNet = ml5.poseNet(cam);
	// poseNet.on('pose', gotPoses);


}

function draw() {
    background(50);

    var leftEye = Gravitor(100,100);
    var rightEye = Gravitor(300,100);

    //theEye.show();

	//image(cam,0,0);    

    
    if (fragments.length < maxFrags) {
        let newF = Fragment(200,300,3,color(220),color(0),10,[leftEye,rightEye]);
        fragments.push(newF);
    }

    // if (fragments.length < maxFrags) {
    //     let newF = Fragment(width,0,3,color(220),color(0),10,[leftEye,rightEye]);
    //     fragments.push(newF);
    // }


    // if (pose) {
    //     rect(pose.nose.x, pose.nose.y,30,30);
    // }

    for (f of fragments) {
        // if (pose) {
        //     let steer = p5.Vector.sub(createVector(pose.leftEye.x, pose.leftEye.y), f.location);
        //     f.reactTo(steer.limit(1));            
        // }
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

}

function gotPoses(poses) {
    if (poses.length > 0) {
        pose = poses[0].pose;
    }
} 
