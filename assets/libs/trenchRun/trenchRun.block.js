(function () {
    var Block = function (startZ, trenchWidth, trenchHeight, backgroundColor, position, ratio) {
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
        	create: function() {
                switch (position.toLowerCase()) {
                    case "top":
                        var topBlock = createBlock(trenchWidth, (trenchHeight/ratio));
                        topBlock.position.y += trenchHeight-((trenchHeight/ratio)/2);

                        return topBlock;
                    case "bottom":
                        var bottomBlock = createBlock(trenchWidth, (trenchHeight/ratio));
                        bottomBlock.position.y += ((trenchHeight/ratio)/2);

                        return bottomBlock;
                    case "left":
                        var leftBlock = createBlock((trenchWidth/ratio), trenchHeight);
                        leftBlock.position.y += (trenchHeight/2);
                        leftBlock.position.x += (trenchWidth/2)-((trenchWidth/ratio)/2);

                        return leftBlock;
                    case "right":
                        var rightBlock = createBlock((trenchWidth/ratio), trenchHeight);
                        rightBlock.position.y += (trenchHeight/2);
                        rightBlock.position.x -= (trenchWidth/2)-((trenchWidth/ratio)/2);

                        return rightBlock;
                }
        	}
        }
    };

    if (window.TrenchRun) {
    	if (!window.TrenchRun.Block) window.TrenchRun.Block = Block;
    }
})();