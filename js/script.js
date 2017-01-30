'use strict';

( function () {

	const gl_canvas = document.getElementById( 'canvas' );
	const errorLog  = document.querySelector( '.error' );
	const controlsRotate = document.querySelectorAll( '.rotate' );
	const controlsRange = document.querySelectorAll( '.range' );
	const controlsRange1 = document.querySelectorAll( '.range1' );
	const zoom = document.getElementById( 'zoom' );

	const tetraButton = document.querySelector( '#tetra' );
	const carpetButton = document.querySelector( '#carpet' );
	const eggButton = document.querySelector( '#egg' );

	let animationAxies = {
		x: false,
		y: true,
		z: false
	};

	let position;
	let color;

	let triangleVertexBuffer = [];
	let triangleFacesBuffer = [];
	let pointsCount = 0;

	let PosMatrix;
	let MovMatrix;
	let ViewMatrix;
	let matrixProjection;
	let matrixMovement;
	let matrixView;

	let triangleVertices = [];
	let triangleFaces = [];

	let rotationSpeed = 0.001;
	let zoomRatio = -200;

	let animationID;


	let inheritCount = 2;
	let dispersion = 50;



	function gl_getContext ( canvas ) {
		let ctx;

		try {
			ctx = canvas.getContext ( 'webgl' );
			ctx.viewportWidth = canvas.width;
			ctx.viewportHeight = canvas.height;
		} catch ( e ) {
			errorLog.innerHTML = "Nieudana inicjalizacja kontekstu WebGL!";
		}

		return ctx;
	}

	const gl_ctx = gl_getContext( gl_canvas );


	function gl_initShaders () {
		const vertexShader = "\n\
			attribute vec3 position;\n\
			uniform mat4 PosMatrix;\n\
			uniform mat4 MovMatrix;\n\
			uniform mat4 ViewMatrix; \n\
			attribute vec3 color;\n\
			varying vec3 vColor;\n\
			void main(void) {\n\
				gl_Position = PosMatrix * ViewMatrix * MovMatrix * vec4(position, 1.);\n\ \
				vColor = color;\n\
			}";

		const fragmentShader = "\n\
			precision mediump float;\n\
			varying vec3 vColor;\n\
			void main(void) {\n\
				gl_FragColor = vec4(vColor, 1.);\n\
			}";

		const getShader = function( source, type, typeString ) {
			const shader = gl_ctx.createShader( type );
			gl_ctx.shaderSource( shader, source );
			gl_ctx.compileShader( shader );

			if ( !gl_ctx.getShaderParameter( shader, gl_ctx.COMPILE_STATUS ) ) {
				errorLog.innerHTML = `Error: ${typeString}`;
				return false;
			}
			return shader;
		};

		const shaderVertex = getShader( vertexShader, gl_ctx.VERTEX_SHADER, 'VERTEX' );
		const shaderFragment = getShader( fragmentShader, gl_ctx.FRAGMENT_SHADER, 'FRAGMENT' );

		const shaderProgram = gl_ctx.createProgram();
		gl_ctx.attachShader( shaderProgram, shaderVertex );
		gl_ctx.attachShader( shaderProgram, shaderFragment );

		gl_ctx.linkProgram( shaderProgram );

		PosMatrix = gl_ctx.getUniformLocation( shaderProgram, "PosMatrix" );
		MovMatrix = gl_ctx.getUniformLocation( shaderProgram, "MovMatrix" );
		ViewMatrix = gl_ctx.getUniformLocation( shaderProgram, "ViewMatrix" );

		position = gl_ctx.getAttribLocation( shaderProgram, 'position' );
		color = gl_ctx.getAttribLocation( shaderProgram, 'color' );
		gl_ctx.enableVertexAttribArray( position );
		gl_ctx.enableVertexAttribArray( color );
		gl_ctx.useProgram( shaderProgram );
	}

	function gl_initBuffers() {
		triangleVertexBuffer = gl_ctx.createBuffer();
		gl_ctx.bindBuffer( gl_ctx.ARRAY_BUFFER, triangleVertexBuffer );
		gl_ctx.bufferData( gl_ctx.ARRAY_BUFFER,
			new Float32Array( triangleVertices ),
			gl_ctx.STATIC_DRAW ) ;

		triangleFacesBuffer = gl_ctx.createBuffer();
		gl_ctx.bindBuffer( gl_ctx.ELEMENT_ARRAY_BUFFER, triangleFacesBuffer );
		gl_ctx.bufferData( gl_ctx.ELEMENT_ARRAY_BUFFER,
			new Uint16Array( triangleFaces ),
			gl_ctx.STATIC_DRAW );
	}

	function gl_setMatrix () {
		matrixProjection = MATRIX.getProjection(40,gl_canvas.width/gl_canvas.height, 1, 2500);
		matrixMovement = MATRIX.getIdentityMatrix();
		matrixView = MATRIX.getIdentityMatrix();
		MATRIX.translateZ(matrixView, zoomRatio);
	}

	function gl_draw() {
		gl_ctx.clearColor( 0.0, 0.0, 0.0, 0.0 );
		gl_ctx.enable(gl_ctx.DEPTH_TEST);
		gl_ctx.depthFunc(gl_ctx.LEQUAL);
		gl_ctx.clearDepth(1.0);
		let timeOld = 0;

		const animate = function ( time ) {
			const dAngle = rotationSpeed * (time - timeOld);

			if ( animationAxies.x === true ) {
				MATRIX.rotateX(matrixMovement, dAngle);
			}
			if ( animationAxies.y === true ) {
				MATRIX.rotateY(matrixMovement, dAngle);
			}
			if ( animationAxies.z === true ) {
				MATRIX.rotateZ(matrixMovement, dAngle);
			}

			timeOld = time;

			gl_ctx.viewport(0.0, 0.0, gl_canvas.width, gl_canvas.height);
			gl_ctx.clear(gl_ctx.COLOR_BUFFER_BIT | gl_ctx.DEPTH_BUFFER_BIT);

			gl_ctx.uniformMatrix4fv(PosMatrix, false, matrixProjection);
			gl_ctx.uniformMatrix4fv(MovMatrix, false, matrixMovement);
			gl_ctx.uniformMatrix4fv(ViewMatrix, false, matrixView);

			gl_ctx.vertexAttribPointer(position, 3, gl_ctx.FLOAT, false, 4*(3+3), 0);
			gl_ctx.vertexAttribPointer(color, 3, gl_ctx.FLOAT, false, 4*(3+3), 3*4);

			gl_ctx.bindBuffer( gl_ctx.ARRAY_BUFFER, triangleVertexBuffer );
			gl_ctx.bindBuffer( gl_ctx.ELEMENT_ARRAY_BUFFER, triangleFacesBuffer );

			gl_ctx.drawElements( gl_ctx.TRIANGLES, pointsCount , gl_ctx.UNSIGNED_SHORT, 0 );
			gl_ctx.flush();

			animationID = window.requestAnimationFrame( animate );
		};

		animate( 0 );
	}




	function runAnimation () {
		gl_initShaders();
		gl_initBuffers();
		gl_setMatrix();
		gl_draw();
	}

	function reset () {
		gl_ctx.clear( gl_ctx.COLOR_BUFFER_BIT );
		gl_ctx.clear( gl_ctx.DEPTH_BUFFER_BIT );
		gl_ctx.clear( gl_ctx.STENCIL_BUFFER_BIT );

		window.cancelAnimationFrame( animationID );

		runAnimation();
	}

	function updateAutoRotation () {
		animationAxies[this.dataset.axis] = this.checked;
	}

	function updateSpeedOrZoom () {
		if ( this.id === 'zoom' ) {
			zoomRatio = this.value;
			MATRIX.translateZ( matrixView, this.value );
		}
		if ( this.id === 'speed' ) {
			rotationSpeed = this.value;
		}
	}


	for ( let control of controlsRotate ) {
		control.addEventListener( 'change', updateAutoRotation )
	}

	for ( let control of controlsRange ) {
		control.addEventListener( 'change', updateSpeedOrZoom );
		control.addEventListener( 'mousemove', updateSpeedOrZoom );
	}

	function eggZoom( isEgg ) {
		if ( isEgg === true ) {
			zoom.value = "-50";
			zoom.max = "-10";
			zoom.min = "-100";
		} else {
			zoom.value = "-200";
			zoom.max = "-100";
			zoom.min = "-200";
		}
	}

	function isCarpet( temp ) {
		if ( temp === true ) {
			for ( let control of controlsRange1 ) {
				control.disabled = false;
			}
			zoom.value = "-50";
			zoom.max = "-10";
			zoom.min = "-100";
		} else {
			for ( let control of controlsRange1 ) {
				control.disabled = true;
			}
		}
	}

	function updateCarpet () {
		if ( this.id === 'inherit' ) {
			Carpet.inheritCount = this.value;
		}
		if ( this.id === 'dispersion' ) {
			Carpet.dispersion = this.value;
		}

		showCarpet();
	}


	function showTetra () {
		triangleVertices = Tetra.triangleVertices();
		triangleFaces = Tetra.triangleFaces();
		pointsCount = triangleFaces.length;


		zoomRatio = -200;
		eggZoom( false );

		isCarpet( false );

		reset();
	}

	function showCarpet() {
		triangleVertices = Carpet.triangleVertices();
		triangleFaces = Carpet.triangleFaces();
		pointsCount = triangleFaces.length;


		zoomRatio = -200;
		eggZoom( false );

		isCarpet( true );

		reset();
	}

	function showEgg() {
		triangleVertices = Egg.triangleVertices();
		triangleFaces = Egg.triangleFaces();
		pointsCount = triangleFaces.length;

		zoomRatio = -50;
		eggZoom( true );

		isCarpet( false );

		reset();
	}
	
	tetraButton.addEventListener( 'click', showTetra );
	carpetButton.addEventListener( 'click', showCarpet );
	eggButton.addEventListener( 'click', showEgg );

	for ( let control of controlsRange1 ) {
		control.addEventListener( 'change', updateCarpet );
	}


	runAnimation();

} )();