(function () {
    var TrenchRun = function (containerName, success, failure) {
        // ********** Private variables

        // ---- HTML objects

        var _container = document.getElementById(containerName);

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

        var _positions = [ "top", "bottom", "left", "right" ];
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
        
        function createTrenchGrid() {
            var step = 20;

            var gridMaterial = new THREE.LineBasicMaterial( { color: 0xFFFFFF, opacity: 0.7, transparent: true } );

            function createHorizontalGrid(width, length) {
                var gridGeometry = new THREE.Geometry();

                for (var i=0; i<=(length/step); i++) {  
                    gridGeometry.vertices.push(new THREE.Vector3(width, 0, (i*step)));
                    gridGeometry.vertices.push(new THREE.Vector3(0, 0, (i*step)));
                }

                for (var i=0; i<=(width/step); i++) {
                    gridGeometry.vertices.push(new THREE.Vector3((i*step), 0, (length)));
                    gridGeometry.vertices.push(new THREE.Vector3((i*step), 0, 0));
                }

                var grid = new THREE.LineSegments(gridGeometry, gridMaterial);

                grid.position.x -= (width/2);

                return grid;
            }

            function createVerticalGrid(height, length) {
                var gridGeometry = new THREE.Geometry();

                for (var i=0; i<=(length/step); i++) {
                    gridGeometry.vertices.push(new THREE.Vector3(0, 0, (i*step)));
                    gridGeometry.vertices.push(new THREE.Vector3(0, height, (i*step)));
                }

                for (var i=0; i<=(height/step); i++) {
                    gridGeometry.vertices.push(new THREE.Vector3(0, (i*step), 0));
                    gridGeometry.vertices.push(new THREE.Vector3(0, (i*step), length));
                }

                var grid = new THREE.LineSegments(gridGeometry, gridMaterial);

                return grid;
            }

            var trench = new THREE.Object3D();

            var base = createHorizontalGrid(_trenchWidth, _trenchLength);

            var left = createVerticalGrid(_trenchHeight, _trenchLength);
            left.position.x -= (_trenchWidth/2);

            var right = createVerticalGrid(_trenchHeight, _trenchLength);
            right.position.x += (_trenchWidth/2);

            trench.add(base);
            trench.add(left);
            trench.add(right);

            return trench;
        }
        
        function createTrenchRun() {
            var first = createTrenchGrid(),
                second = createTrenchGrid(),
                third = createTrenchGrid();

            _trenchRun.add(first);

            second.position.z += _trenchLength;

            _trenchRun.add(second);

            third.position.z += (_trenchLength*2);

            _trenchRun.add(third);

            _trenchRun.position.z -= _trenchLength + (_trenchLength/2);

            _scene.add(_trenchRun);
        }
        
        function createBlock() {
            var dimension;

            if (_blocksCreated < 10) dimension = 4;
            else if (_blocksCreated < 20) dimension = _dimensions[getRandomInt(1,2)] 
            else dimension = _dimensions[getRandomInt(0,2)];

            var block = new _trenchBlock(((_trenchLength/2)+50), _trenchWidth, _trenchHeight, _skyboxColor, _positions[getRandomInt(0,3)], dimension);

            _scene.add(block.create());

            return block;
        }

        function createCamera() {
            _camera = new THREE.PerspectiveCamera(75, (window.innerWidth / window.innerHeight), 0.1, _trenchLength/2);

            _controls = new THREE.FirstPersonControls(_scene, _camera);
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
                _closestBlock -= _closestBlockOffset;

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