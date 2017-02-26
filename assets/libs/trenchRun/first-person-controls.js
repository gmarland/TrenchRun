THREE.FirstPersonControls = function (scene, camera) {
    var that = this;

    this._movementSpeed = 3;
    this._rotationSpeed = 0.02;

    this._scene = scene;

    // Set the camera up in the object  and rotate it 90 degrees on the y (we need to do this for positioning later)
    this._camera = camera;

    this._pitchObject = new THREE.Object3D();
    this._pitchObject.add(this._camera);

    this._yawObject = new THREE.Object3D();
    this._yawObject.add(this._pitchObject);

    this._scene.add(this._yawObject);
    
    this._yawObject.rotation.y = 3.14159;

    this._shiftPressed = false;

    this._moveUp = false; 
    this._moveLeft = false; 
    this._moveDown = false;
    this._moveRight = false;

    this.onKeyDown = function (event) {
        event.preventDefault();

        if (event.key.toLowerCase() == "shift") this._shiftPressed = true;
        else {
            switch (event.keyCode) {
                case 38: /*up*/
                case 87: /*W*/ 
                    this._moveUp = true; 
                    break;
                case 37: /*left*/
                case 65: /*A*/ 
                    this._moveLeft = true; 
                    break;
                case 40: /*down*/
                case 83: /*S*/ 
                    this._moveDown = true;
                    break;
                case 39: /*right*/
                case 68: /*D*/ 
                    this._moveRight = true;
                    break;
            }
        }
    };

    this.onKeyUp = function (event) {
        if (event.key.toLowerCase() == "shift") this._shiftPressed = false;
        else {
            switch (event.keyCode) {
                case 38: /*up*/
                case 87: /*W*/
                    this._moveUp = false; 
                    break;
                case 37: /*left*/
                case 65: /*A*/ 
                    this._moveLeft = false; 
                    break;
                case 40: /*down*/
                case 83: /*S*/ 
                    this._moveDown = false; 
                    break;
                case 39: /*right*/
                case 68: /*D*/ 
                    this._moveRight = false; 
                    break;
            }
        }
    };

    this.setCameraPosition = function (x, y, z) {
        this._yawObject.position.x = x;
        this._yawObject.position.y = y;
        this._yawObject.position.z = z;
    };

    this.update = function (delta) {
        if (this._shiftPressed) {
            if (this._moveUp) this._yawObject.translateZ(-this._movementSpeed);
            if (this._moveDown) this._yawObject.translateZ(this._movementSpeed);
            if (this._moveLeft) this._yawObject.translateX(-this._movementSpeed);
            if (this._moveRight) this._yawObject.translateX(this._movementSpeed);
        }
        else {
            var currentRotationX = this._pitchObject.rotation.x,
                currentRotationY = this._yawObject.rotation.y;

            if (this._moveUp) currentRotationX += this._rotationSpeed;
            if (this._moveLeft) currentRotationY += this._rotationSpeed;
            if (this._moveDown) currentRotationX -= this._rotationSpeed;
            if (this._moveRight) currentRotationY -= this._rotationSpeed;
            
            var currentRotationX = currentRotationX % 6.28319;
            var currentRotationY = currentRotationY % 6.28319;

            this._pitchObject.rotation.x = currentRotationX;
            this._yawObject.rotation.y = currentRotationY;
        }
    };

    this.cancelAllMovement = function () {
        this.moveForward = false;
        this.moveLeft = false;
        this.moveBackward = false;
        this.moveRight = false;
        this.moveUp = false; 
        this.moveDown = false;

        this._shiftPressed = false;
    };

    this.dispose = function () {
        window.removeEventListener('keydown', _onKeyDown, false);
        window.removeEventListener('keyup', _onKeyUp, false);
    }

    var _onKeyUp = bind(this, this.onKeyUp);
    var _onKeyDown = bind(this, this.onKeyDown);

    window.addEventListener('keydown', _onKeyDown, false);
    window.addEventListener('keyup', _onKeyUp, false);

    function bind(scope, fn) {
        return function () {
            fn.apply(scope, arguments);
        };
    }

};