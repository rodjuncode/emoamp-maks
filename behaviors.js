// # behaviors

// basic stuff
const WillMove = (self) => ({
	move: () => {
		self.velocity.add(self.acceleration);
		if (self.maxVelocity > 0) {
			self.velocity.limit(self.maxVelocity);
		}
		self.location.add(self.velocity);
		self.acceleration.mult(0);
	}
});

const WillReact = (self) => ({
	reactTo: (force) => {
		self.acceleration.add(force);
	}
});

const WillOrbit = (self) => ({
	orbit: () => {
		if (self.gravitors != null) {
			for (var i = 0; i < self.gravitors.length; i++) {
				if (p5.Vector.dist(self.location, self.gravitors[i].location) < self.gravitors[i].maxDistance) {
					var steering = p5.Vector.sub(self.gravitors[i].location,self.location).normalize().mult(1.2);
					self.acceleration.add(steering);
				}
			}
		}
	}
});

const WillDisintegrate = (self) => ({
	checkCrash: () => {
		if (self.gravitors != null) {
			for (var i = 0; i < self.gravitors.length; i++) {
				if (p5.Vector.dist(self.location, self.gravitors[i].location) < self.gravitors[i].minDistance) {
					self.desintegrate = true;
				}
			}
		}
	}
});

const WillBounceOnEdges = (self, xLimit1, xLimit2, yLimit1, yLimit2, zLimit1, zLimit2) => ({
	bounce: () => {
		let loss = 0.8;
		if (self.location.x < xLimit1) {
			self.velocity.x = -self.velocity.x*loss;
			self.location.x = xLimit1;
			return true;
		}
		if (self.location.x > xLimit2) {
			self.velocity.x = -self.velocity.x*loss;
			self.location.x = xLimit2;
			return true;
		}
		if (self.location.y < yLimit1) {
			self.velocity.y = -self.velocity.y*loss;
			self.location.y = yLimit1;
			return true;
		}
		if (self.location.y > yLimit2) {
			self.velocity.y = -self.velocity.y*loss;
			self.location.y = yLimit2;
			return true;
		}
		if (self.location.z < zLimit1) {
			self.velocity.z = -self.velocity.z*loss;
			self.location.z = zLimit1;
			return true;
		}
		if (self.location.z > zLimit2) {
			self.velocity.z = -self.velocity.z*loss;
			self.location.z = zLimit2;
			return true;
		}				
		return false;
	}
});

const WillGoAroundEdges = (self, xLimit, yLimit) => ({
	bounce: () => {
		if (self.location.x < 0) {
			self.location.x = xLimit;
			return true;
		}
		if (self.location.x > xLimit) {
			self.location.x = 0;
			return true;
		}
		if (self.location.y < 0) {
			self.location.y = yLimit;
			return true;
		}  
		if (self.location.y > yLimit) {
			self.location.y = 0;
			return true;
		}	
		return false;
	}
});

// pulser stuff
const WillHavePulsersAttached = (self, pulsersQty) => ({
	pulse: () => {
		if (self.pulsers == null || self.pulsers.length == 0) {
			self.pulsers = [];
			for (let i = 0; i < pulsersQty; i++) {
				self.pulsers[i] = Pulser(self.size/2*(pulsersQty-1), self, 100, 10, 0.00008, self.color, i);
			}
		}
		for (let i = 0; i < self.pulsers.length; i++) {
			self.pulsers[i].grow();
			self.pulsers[i].show();
		}
	}
});

const WillPulse = (self, speed) => ({
	grow: () => {
		let pR = self.radius - (self.anchor.size/2*self.index);
		if (pR <= self.maxRadius) { 
			self.radius += speed + self.anchor.velocity.mag(); // keep growing based on anchor's velocity
		} else {
			self.radius = (self.index-1)*self.anchor.size/2; // starts again, -radius
		}
	},
	show: (where) => {
		if (where == null) {
			where = this;
		}		
		where.push();
		where.translate(self.anchor.location.x, self.anchor.location.y);
		where.noFill();
		where.stroke(self.color);
		where.beginShape();
		for (let a = 0; a < TWO_PI-TWO_PI/self.vertex; a += TWO_PI/self.vertex) {
			let _noise = noise(cos(a) + 1, sin(a) + 1, self.offSet);
			let _offset = map(_noise, 0, 1, -self.radius/self.noiseRange, self.radius/self.noiseRange);
			let _radius = self.radius - (self.anchor.size/2*self.index) + _offset;
			if (_radius > 0) {
				where.vertex(_radius*cos(a),_radius*sin(a));
				self.offSet += self.offSetProgression;
			}	
		}
		where.endShape(CLOSE);
		where.pop();		
	}
})

// shape stuff
const Ellipse = (self, c) => ({
	show: () => {
		push();
		if (c != null) {
			fill(c);
			stroke(c);
		} 
		ellipseMode(CENTER);
		ellipse(self.location.x, self.location.y, self.size, self.size)
		pop();
	}
});

const Rectangle = (self) => ({
	show: () => {
		push();
		if (self.fill != null) {
			fill(self.fill);
		} 
		if (self.stroke != null) {
			stroke(self.stroke);
		} 
		rectMode(CENTER);
		rect(self.location.x, self.location.y, self.size, self.size)
		pop();
	}
});

// behaviors sets
const Particle = (self) => Object.assign({},WillMove(self),WillReact(self));