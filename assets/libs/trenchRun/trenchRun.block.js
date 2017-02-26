(function () {
    var Block = function (startZ, trenchWidth, trenchHeight, backgroundColor, position, ratio) {
        var block = null;

        function createBlock(blockWidth, blockHeight) {
            var blockObject = new THREE.Object3D();

            var geometry = new THREE.BoxGeometry( blockWidth, blockHeight, 10 ),
                material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(backgroundColor)
                });
            
            blockObject.add(new THREE.Mesh( geometry, material ));

            var wireGeometry = new THREE.BoxGeometry((blockWidth + 0.2), (blockHeight + 0.2), 10.2 ),
                wireMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    wireframe: true
                });

            blockObject.add(new THREE.Mesh( wireGeometry, wireMaterial ));

            blockObject.position.z = startZ;

            return blockObject;
        }

        return {
            animate: function(movement) {
                if (block) block.position.z -= movement;
            },

            shouldDestroy: function(removeAt) {
                if (block.position.z < (removeAt*-1)) return true;
                else return false;
            },

            get: function() {
                return block;
            },

        	create: function() {
                switch (position.toLowerCase()) {
                    case "top":
                        block = createBlock(trenchWidth, (trenchHeight/ratio));
                        block.position.y += trenchHeight-((trenchHeight/ratio)/2);
                        break;
                    case "bottom":
                        block = createBlock(trenchWidth, (trenchHeight/ratio));
                        block.position.y += ((trenchHeight/ratio)/2);
                        break;
                    case "left":
                        block = createBlock((trenchWidth/ratio), trenchHeight);
                        block.position.y += (trenchHeight/2);
                        block.position.x += (trenchWidth/2)-((trenchWidth/ratio)/2);
                        break;
                    case "right":
                        block = createBlock((trenchWidth/ratio), trenchHeight);
                        block.position.y += (trenchHeight/2);
                        block.position.x -= (trenchWidth/2)-((trenchWidth/ratio)/2);
                        break;
                }

                return block;
        	}
        }
    };

    if (window.TrenchRun) {
    	if (!window.TrenchRun.Block) window.TrenchRun.Block = Block;
    }
})();