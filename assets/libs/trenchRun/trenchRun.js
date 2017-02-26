﻿(function () {
    var TrenchRun = function (containerName, success, failure) {
        // ********** Private variables

        // ---- HTML objects

        var _container = document.getElementById(containerName);

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

        var _trenchLength = 300,
            _trenchWidth = 150,
            _trenchHeight = 115;

        var _distance = (_trenchLength/2);

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
            var step = 5;

            function createHorizontalGrid(width, length) {
                var gridGeometry = new THREE.Geometry();
                var gridMaterial = new THREE.LineBasicMaterial( { color: 0xFFFFFF } );

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
                var gridMaterial = new THREE.LineBasicMaterial( { color: 0xFFFFFF } );

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
        };
        
        function createTrenchRun() {
            var first = createTrenchGrid(),
                second = createTrenchGrid(),
                third = createTrenchGrid();

            _trenchRun.add(first);

            second.position.z += _trenchLength;

            _trenchRun.add(second);

            third.position.z += (_trenchLength*2);

            _trenchRun.add(third);

            _trenchRun.position.z -= (_trenchLength/2);

            _scene.add(_trenchRun);
        }

        function createCamera() {
            var far = ((_sceneRadius + (_sceneRadius / 2)) * 2);

            _camera = new THREE.PerspectiveCamera(75, (window.innerWidth / window.innerHeight), 0.1, far);

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

        // ********** Rendering Methods

        function startRendering() {
            var that = this;

            var renderScene = function () {
                requestAnimationFrame(renderScene);

                _controls.update(_clock.getDelta());

                _renderer.render(_scene, _camera);
            };

            renderScene();
        }

        // ********** 
        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }

        // =====  Public Methods

        return {
        }
    };

    if (!window.TrenchRun) window.TrenchRun = TrenchRun;
})();