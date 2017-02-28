(function () {
    var Trench = function (trenchLength, trenchWidth, trenchHeight) {
        var _trenchLength = trenchLength,
            _trenchWidth = trenchWidth,
            _trenchHeight = trenchHeight;

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

        return {
        	create: function() {
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
        };
    };

    if (window.TrenchRun) {
    	if (!window.TrenchRun.Trench) window.TrenchRun.Trench = Trench;
    }
})();