(function () {
    var TrenchRun = function (containerName, success, failure) {
        // ********** Private variables

        // ---- HTML objects

        var _container = document.getElementById(containerName);

        var _trench = window.TrenchRun.Trench;
        var _trenchBlock = window.TrenchRun.Block;

        // ---- initialize parameters

        var _skyboxColor = "#1A9EC9";
        var _sceneRadius = 500;

        // ---- three.js objects

        var _scene = null;

        var _renderer = null;

        var _clock = null;

        var _lighting = [];

        var _camera = null;
        var _controls = null;

        // ----- scene elements

        var _trenchRun = new THREE.Object3D();

        var _trenchLength = 1500,
            _trenchWidth = 160,
            _trenchHeight = 120;

        var _distance = (_trenchLength/2);

        var _blocks = [];
        
        var _closestBlock = 300;
        var _closestBlockOffset = 10;

        var _lastCreated = 0;
        var _blocksCreated = 0;
        
        var _level = 1;
        var _levelAt = 5

        var _positions = [ "top", "bottom", "left", "right", "topLeft", "topRight", "bottomLeft", "bottomRight", "center" ];
        var _dimensions = [ 2, 3, 4 ];

        // ********** Start Methods

        initializeScene();

        setupScene();

        // ********** Initialization Methods

        // Scene initialization

        function initializeScene() {
            _clock = new THREE.Clock();

            // Create the three.js scene
            _scene = new THREE.Scene();

            // Create the renderer and append it to the page
            initializeRenderer();
        }

        // Renderer initialization

        function initializeRenderer() {
            var skyboxColor = new THREE.Color(_skyboxColor);
            var skyboxOpacity = 1;

            _renderer = new THREE.WebGLRenderer({alpha:true});

            _renderer.setSize(window.innerWidth, window.innerHeight);
            _renderer.setClearColor(skyboxColor);

            _container.appendChild(_renderer.domElement);
        }

        // ********** Create scene methods

        function setupScene() {
            createTrenchRun();

            createCamera();

            bindEvents();

            startRendering();
        }
        
        function createTrenchRun() {
            var trench = new _trench(_trenchLength, _trenchWidth, _trenchHeight);

            var first = trench.create(),
                second = trench.create(),
                third = trench.create();

            _trenchRun.add(first);

            second.position.z += _trenchLength;

            _trenchRun.add(second);

            third.position.z += (_trenchLength*2);

            _trenchRun.add(third);

            _trenchRun.position.z -= _trenchLength + (_trenchLength/2);

            _scene.add(_trenchRun);
        }
        
        function createBlock() {
            var position, dimension;

            if (_level <= 3) position = _positions[getRandomInt(0,3)];
            else if (_level <= 4) position = _positions[getRandomInt(0,7)];
            else if (_level <= 6) position = _positions[getRandomInt(0,7)];
            else position = _positions[getRandomInt(0,8)];

            if (position != "center") {
                if (_blocksCreated < 10) {
                    dimension = 4;
                }
                else if ((_blocksCreated < 20) || 
                        (((position.toLowerCase() == "topleft") || (position.toLowerCase() == "topright") || (position.toLowerCase() == "bottomleft") || (position.toLowerCase() == "bottomright")) && (_level <= 5))) {
                    dimension = _dimensions[getRandomInt(1,2)] 
                }
                else {
                    dimension = _dimensions[getRandomInt(0,2)];
                }
            }
            else {
                if (_level <= 6) dimension = _dimensions[2];
                else dimension = _dimensions[getRandomInt(1,2)];
            }

            var block = new _trenchBlock(((_trenchLength/2)+50), _trenchWidth, _trenchHeight, _skyboxColor, position, dimension);

            _scene.add(block.create());

            return block;
        }

        function createCamera() {
            _camera = new THREE.PerspectiveCamera(75, (window.innerWidth / window.innerHeight), 0.1, _trenchLength/2);

            _controls = new THREE.FirstPersonControls(_scene, _camera, _trenchHeight, _trenchWidth);
            _controls.setCameraPosition(0, 20, 0);
        }

        function bindEvents() {
            window.addEventListener("resize", function (e) {
                var width = window.innerWidth,
                    height = window.innerHeight;

                _renderer.setSize(width, height);

                _camera.aspect = (width / height);
                _camera.updateProjectionMatrix();
            }, false);

            window.onblur = function () {
                _controls.cancelAllMovement();
            };
        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // ********** Rendering Methods

        function animateScene(delta) {
            var speed = 3;

            _trenchRun.position.z -= speed;
            _distance += speed;

            if ((_distance % _trenchLength) === 0) {
                _trenchRun.position.z += _trenchLength;
            }

            for (var i=(_blocks.length-1); i>=0; i--) {
                _blocks[i].animate(speed);

                if (_blocks[i].shouldDestroy((_trenchLength/2)+50)) {
                    _scene.remove(_blocks[i].get());
                    _blocks.splice(i, 1);
                }
            }
        }

        function determineBlockCreate(delta) {
            if (((delta % 10) === 0) && (_lastCreated > _closestBlock)) {
                _blocks.push(createBlock());

                _lastCreated = 0;
                _blocksCreated++;
            }
            else _lastCreated++;

            if ((_blocksCreated > 0) && (_blocksCreated >= (_level*_levelAt)) && ((_blocksCreated % _levelAt) === 0)) {
                _level++;

                if (_closestBlock > 30) _closestBlock -= _closestBlockOffset;

                // little hacky to help make level 3 not require 15 blocks
                if (_level == 3) {
                    _blocksCreated = 20;
                    _levelAt = 10;
                }

                if (_level == 5) _closestBlockOffset = 20;
            }
        }

        function startRendering() {
            var that = this;

            var renderScene = function () {
                requestAnimationFrame(renderScene);

                animateScene(_clock.getDelta());
                determineBlockCreate(_clock.getDelta());

                _controls.update(_clock.getDelta());

                _renderer.render(_scene, _camera);
            };

            renderScene();
        }

        // =====  Public Methods

        return {
        }
    };

    if (!window.TrenchRun) window.TrenchRun = TrenchRun;
})();