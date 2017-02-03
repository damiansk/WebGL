'use strict';

const Tetra = ( function () {

	function _triangleVertices () {
		return [
			-50, -50, -50,
			1, 0, 0,

			50, -50, -50,
			0, 1, 0,

			-50, 50, -50,
			0, 0, 1,

			-50, -50, 50,
			1, 1, 1
		]
	}

	function _triangleFaces () {
		return [
			0, 1, 2,
			0, 1, 3,
			0, 2, 3,
			1, 2, 3
		]
	}

	return {
		triangleVertices: _triangleVertices,
		triangleFaces: _triangleFaces
	}
} () );
