const Carpet = {
	dispersion: 0,
	inheritCount: 2,
	squareCount: 0,
	setTriangleVerticles(pointCoor, width) {
		const newWidth = width / 2;

		let z = Math.random() * ( this.dispersion / ( this.inheritCount * 2 ) );
		let z1 = Math.random() * ( this.dispersion / ( this.inheritCount * 2 ) );

		const rand = ( Math.random() * this.dispersion ) - ( this.dispersion / 2 );

		if (rand > 0) {
			z *= -1;
		} else {
			z1 *= -1;
		}

		let color1 = Math.random();
		let color2 = Math.random();
		let color3 = Math.random();

		pointCoor[0] += rand;
		pointCoor[1] += rand;

		let vertex = [
			pointCoor[0] + newWidth, pointCoor[1] + newWidth, -z1,
			color1, color2, color3,
			pointCoor[0] - newWidth, pointCoor[1] + newWidth, -z,
			color2, color3, color1,
			pointCoor[0] - newWidth, pointCoor[1] - newWidth, z1,
			color3, color1, color2,
			pointCoor[0] + newWidth, pointCoor[1] - newWidth, z,
			color1, 0, color3
		];

		return vertex;
	},
	triangleVertices (x = 0, y = 0, width = 100, nesting = this.inheritCount ) {
		let triangleVerticlesArray = [];
		const newWith = width / 3;
		const points = [
			[x + newWith, y, 0],
			[x - newWith, y, 0],
			[x, y + newWith, 0],
			[x, y - newWith, 0],
			[x - newWith, y + newWith, 0],
			[x - newWith, y - newWith, 0],
			[x + newWith, y - newWith, 0],
			[x + newWith, y + newWith, 0]
		];

		if (--nesting > 0) {
			for (let point of points) {
				triangleVerticlesArray = triangleVerticlesArray.concat(
								this.triangleVertices(point[0], point[1], newWith, nesting) );
			}
		} else {
			for (let point of points) {
				this.squareCount++;
				triangleVerticlesArray = triangleVerticlesArray.concat( this.setTriangleVerticles(point, newWith) );
			}
		}

		return triangleVerticlesArray;
	},
	triangleFaces() {
		const triangleFaces = new Array( this.squareCount * 2 * 3 );
		const length = triangleFaces.length;

		for (let i = 0, x = 0; i < length; i += 6, x += 4) {
			triangleFaces[i] = x;
			triangleFaces[i + 1] = x + 1;
			triangleFaces[i + 2] = x + 3;
			triangleFaces[i + 3] = x + 1;
			triangleFaces[i + 4] = x + 2;
			triangleFaces[i + 5] = x + 3;
		}

		return triangleFaces;
	}
};