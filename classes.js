// classes
const Fragment = (x,y,s,f,st,mV,g) => {
	let self = {
		location: createVector(x,y),
		velocity: createVector(0,0),
		acceleration: createVector(0.0),
		size: s,
		fill: f,
		stroke: st,
		maxVelocity: mV,
		gravitors: g,
		desintegrate: false
	}

	return Object.assign(
		self,
		Particle(self),
		Ellipse(self),
		WillBounceOnEdges(self,0,width,0,height,-10000,10000), // z-axys has big boundaries
		WillOrbit(self),
		WillDisintegrate(self)
	)
}

const Gravitor = (x,y) => {
	let self = {
		location: createVector(x,y),
		size: 5,
		maxDistance: 100,
		minDistance: 5,
		fill: color(255,255,255),
		temperature: 0,
	}

	return Object.assign(
		self,
		Eye(self),
		WillGlow(self),
	);

}
