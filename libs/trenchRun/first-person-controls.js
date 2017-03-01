THREE.FirstPersonControls = function (scene, camera, height, width) {
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
    };

    this.onKeyUp = function (event) {
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
    };

    this.setCameraPosition = function (x, y, z) {
        this._yawObject.position.x = x;
        this._yawObject.position.y = y;
        this._yawObject.position.z = z;
    };

    this.update = function (delta) {
        var center = 3.14159;

        var currentRotationX = this._pitchObject.rotation.x,
            currentRotationY = this._yawObject.rotation.y;

        if (this._moveUp) currentRotationX += this._rotationSpeed;
        if (this._moveLeft) currentRotationY += this._rotationSpeed;
        if (this._moveDown) currentRotationX -= this._rotationSpeed;
        if (this._moveRight) currentRotationY -= this._rotationSpeed;
        
        if ((currentRotationX < 1.5708) && (currentRotationX > -1.5708))  this._pitchObject.rotation.x = currentRotationX;

        if (currentRotationY > 0) currentRotationY = currentRotationY % 6.28319;
        else currentRotationY = currentRotationY % -6.28319;

        if ((currentRotationY < (center+2.96706)) && (currentRotationY > (center-2.96706))) this._yawObject.rotation.y = currentRotationY;

        var newYPosition = this._yawObject.position.y;

        if ((this._pitchObject.rotation.x > 0.7)) newYPosition += 8;
        else if ((this._pitchObject.rotation.x < -0.7)) newYPosition -= 8;
        else if ((this._pitchObject.rotation.x > 0.5)) newYPosition += 3;
        else if ((this._pitchObject.rotation.x < -0.5)) newYPosition -= 3;
        else if ((this._pitchObject.rotation.x > 0.3)) newYPosition += 1;
        else if ((this._pitchObject.rotation.x < -0.3)) newYPosition -= 1;
        else if ((this._pitchObject.rotation.x > 0.2)) newYPosition += 0.5;
        else if ((this._pitchObject.rotation.x < -0.2)) newYPosition -= 0.5;
        else if ((this._pitchObject.rotation.x > 0.14)) newYPosition += 0.2;
        else if ((this._pitchObject.rotation.x < -0.14)) newYPosition -= 0.2;

        if (newYPosition <= 0) newYPosition = 1;
        else if (newYPosition >= height) newYPosition = height-1;

        this._yawObject.position.y = newYPosition;

        var newXPosition = this._yawObject.position.x;

        var center = 3.14159;

        if ((this._yawObject.rotation.y > center+0.7)) newXPosition += 8;
        else if ((this._yawObject.rotation.y < center-0.7)) newXPosition -= 8;
        else if ((this._yawObject.rotation.y > center+0.5)) newXPosition += 3;
        else if ((this._yawObject.rotation.y < center-0.5)) newXPosition -= 3;
        else if ((this._yawObject.rotation.y > center+0.3)) newXPosition += 1;
        else if ((this._yawObject.rotation.y < center-0.3)) newXPosition -= 1;
        else if ((this._yawObject.rotation.y > center+0.2)) newXPosition += 0.5;
        else if ((this._yawObject.rotation.y < center-0.2)) newXPosition -= 0.5;
        else if ((this._yawObject.rotation.y > center+0.14)) newXPosition += 0.2;
        else if ((this._yawObject.rotation.y < center-0.14)) newXPosition -= 0.2;

        if (newXPosition <= ((width/2)*-1)) newXPosition = ((width/2)*-1)+1;
        else if (newXPosition >= (width/2)) newXPosition = (width/2)-1;

        this._yawObject.position.x = newXPosition;
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