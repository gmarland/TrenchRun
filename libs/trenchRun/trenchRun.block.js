(function () {
    var Block = function (startZ, trenchWidth, trenchHeight, backgroundColor, position, ratio) {
        var block = null;

        var blockDepth = 20;

        function createBlock(blockWidth, blockHeight) {
            var blockObject = new THREE.Object3D();

            var geometry = new THREE.BoxGeometry( blockWidth, blockHeight, blockDepth),
                material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(backgroundColor)
                });
            
            blockObject.add(new THREE.Mesh( geometry, material ));

            var wireGeometry = new THREE.BoxGeometry((blockWidth + 0.2), (blockHeight + 0.2), (blockDepth+0.2)),
                wireMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    wireframe: true
                });

            blockObject.add(new THREE.Mesh( wireGeometry, wireMaterial ));

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
                    case "topleft": {
                        block = new THREE.Object3D();

                        var bottomBlock = createBlock(trenchWidth, (trenchHeight/ratio));
                        bottomBlock.position.y += ((trenchHeight/ratio)/2);

                        var rightblock = createBlock((trenchWidth/ratio), trenchHeight);
                        rightblock.position.y += (trenchHeight/2);
                        rightblock.position.x -= (trenchWidth/2)-((trenchWidth/ratio)/2);
                        rightblock.position.z += blockDepth+1;

                        block.add(bottomBlock);
                        block.add(rightblock);
                        break;
                    }
                    case "topright": {
                        block = new THREE.Object3D();

                        var bottomBlock = createBlock(trenchWidth, (trenchHeight/ratio));
                        bottomBlock.position.y += ((trenchHeight/ratio)/2);

                        var leftBlock = createBlock((trenchWidth/ratio), trenchHeight);
                        leftBlock.position.y += (trenchHeight/2);
                        leftBlock.position.x += (trenchWidth/2)-((trenchWidth/ratio)/2);
                        leftBlock.position.z += blockDepth+1;

                        block.add(bottomBlock);
                        block.add(leftBlock);
                        break;
                    }
                    case "bottomleft": {
                        block = new THREE.Object3D();

                        var topBlock = createBlock(trenchWidth, (trenchHeight/ratio));
                        topBlock.position.y += trenchHeight-((trenchHeight/ratio)/2);

                        var rightblock = createBlock((trenchWidth/ratio), trenchHeight);
                        rightblock.position.y += (trenchHeight/2);
                        rightblock.position.x -= (trenchWidth/2)-((trenchWidth/ratio)/2);
                        rightblock.position.z += blockDepth+1;

                        block.add(topBlock);
                        block.add(rightblock);
                        break;
                    }
                    case "bottomright": {
                        block = new THREE.Object3D();

                        var topBlock = createBlock(trenchWidth, (trenchHeight/ratio));
                        topBlock.position.y += trenchHeight-((trenchHeight/ratio)/2);

                        var leftBlock = createBlock((trenchWidth/ratio), trenchHeight);
                        leftBlock.position.y += (trenchHeight/2);
                        leftBlock.position.x += (trenchWidth/2)-((trenchWidth/ratio)/2);
                        leftBlock.position.z += blockDepth+1;

                        block.add(topBlock);
                        block.add(leftBlock);
                        break;
                    }
                    case "center": {
                        block = new THREE.Object3D();

                        var bottomBlock = createBlock(trenchWidth, (trenchHeight/ratio));
                        bottomBlock.position.y += ((trenchHeight/ratio)/2);

                        var leftBlock = createBlock((trenchWidth/ratio), trenchHeight);
                        leftBlock.position.y += (trenchHeight/2);
                        leftBlock.position.x += (trenchWidth/2)-((trenchWidth/ratio)/2);
                        leftBlock.position.z += blockDepth+1;

                        var topBlock = createBlock(trenchWidth, (trenchHeight/ratio));
                        topBlock.position.y += trenchHeight-((trenchHeight/ratio)/2);
                        topBlock.position.z += (blockDepth*2)+2;

                        var rightblock = createBlock((trenchWidth/ratio), trenchHeight);
                        rightblock.position.y += (trenchHeight/2);
                        rightblock.position.x -= (trenchWidth/2)-((trenchWidth/ratio)/2);
                        rightblock.position.z += (blockDepth*3)+3;

                        block.add(bottomBlock);
                        block.add(leftBlock);
                        block.add(topBlock);
                        block.add(rightblock);
                        break;
                    }
                }

                block.position.z = startZ;

                return block;
        	}
        }
    };

    if (window.TrenchRun) {
    	if (!window.TrenchRun.Block) window.TrenchRun.Block = Block;
    }
})();