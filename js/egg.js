const Egg = {
	n: 20,
	triangleVertices () {
		let triangleVerticlesArray = [];

		let u,
			v;

		let eggPoint = [0, 0, 0];

		let color = [0, 0, 0];

		for (let i = 0; i < this.n * this.n + 10; i++) {
			u = (i % this.n) / (this.n - 1.0);
			v = (i / this.n) / (this.n - 1.0);

			eggPoint[0] = (-90 * Math.pow(u, 5) + 225 * Math.pow(u, 4) - 270 * Math.pow(u, 3) + 180 * Math.pow(u, 2) - 45 * u) * Math.cos( Math.PI * v );
			eggPoint[1] = 160 * Math.pow(u, 4) - 320 * Math.pow(u, 3) + 160 * Math.pow(u, 2) - 5;
			eggPoint[2] = (-90 * Math.pow(u, 5) + 225 * Math.pow(u, 4) - 270 * Math.pow(u, 3) + 180 * Math.pow(u, 2) - 45 * u) * Math.sin( Math.PI * v );

			color[0] = Math.random();
			color[1] = Math.random();
			color[2] = Math.random();

			triangleVerticlesArray = triangleVerticlesArray.concat(...eggPoint);
			triangleVerticlesArray = triangleVerticlesArray.concat(...color);
		}
		return triangleVerticlesArray;
	},
	triangleFaces() {
		const triangleFaces = [];

		let x = 0;
		for (let i = 0; i < this.n * this.n - this.n + 10; i++) {
			triangleFaces[x++] = i;
			triangleFaces[x++] = i + 1;
			triangleFaces[x++] = i + this.n;
		}
		for (let i = 0; i < this.n * this.n - this.n - 1 + 10; i++) {
			triangleFaces[x++] = i + 1;
			triangleFaces[x++] = i + 1 + this.n;
			triangleFaces[x++] = i + this.n;
		}
		return triangleFaces;
	}
};