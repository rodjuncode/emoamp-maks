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
		desintegrate: false,
		halo: 10
	}

	return Object.assign(
		self,
		Particle(self),
		Glow(self),
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
		minDistance: 20,
		temperature: 0,
		halo: 30
	}

	return Object.assign(
		self,
		Glow(self),
		WillHeat(self),
	);

}
