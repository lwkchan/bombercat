(function (tiles, tileSheet, player, playerSheet, addPlayer, whichRow, whichColumn, movePlayer) {
  'use strict';
  var $container, canvas, stage, canvasW, canvasH,
      manifest, totalLoaded, queue,
      level, mapTiles, game, mapWidth, mapHeight, board, firstKey,
      keysPressed = {
        38: false,
        40: false,
        37: false,
        39: false,
        32: true
      };

  $container = document.getElementById("container");

  level = levels;

  canvasW = level[0].length * 48;
  canvasH = level.length * 48;
  mapTiles = {};

    function buildMap(map) {
        var row, col, tileClone, tileIndex, defineTile;
        if (!board) {
            board = new createjs.Container();
            board.x = 0;
            board.y = 0;
            stage.addChild(board);
        }
        mapWidth = map[0].length;
        mapHeight = map.length;
        defineTile = {
            walkable: function (row, col) {
                if (map[row][col] === 0 || map[row][col] === 2 || map[row][col] === 3 ) {
                    return false;
                } else {
                    return true;
                }
            }
        };
        tileIndex = 0;
        for (row = 0; row < mapHeight; row++) {
            for (col = 0; col < mapWidth; col++) {
                tileClone = tiles.clone();
                tileClone.name = "t_" + row + "_" + col;
                tileClone.gotoAndStop(map[row][col]);
                tileClone.x = col * tileSheet._frameWidth;
                tileClone.y = row * tileSheet._frameHeight;
                mapTiles["t_" + row + "_" + col] = {
                    index: tileIndex,
                    walkable: defineTile.walkable(row, col)
                };
                tileIndex++;
                board.addChild(tileClone);
            }
        }
    }

    function refreshLocation(event) {
      buildMap(level);
      addPlayer(board, player, whichColumn(player), whichRow(player))
    }

        function detectKeys() {
          // press space to drop bomb
          if (keysPressed[32] === 1) {

            var currentRow = whichRow(player);
            var currentColumn = whichColumn(player);
            refreshLocation(event)
            // wait 1 second

            var delayInMilliseconds = 1000; //1 second
            level[currentRow][currentColumn] = 3;

            setTimeout(function() {
              //your code to be executed after 1 second
              level[currentRow][currentColumn] = 4;
              if (level[currentRow + 1][currentColumn] === 1 || level[currentRow + 1][currentColumn] === 2) {
                level[currentRow + 1][currentColumn] = 4
              }
              if (level[currentRow - 1][currentColumn] === 1 || level[currentRow - 1][currentColumn] === 2) {
                level[currentRow - 1][currentColumn] = 4
              }
              if (level[currentRow][currentColumn + 1] === 1 || level[currentRow][currentColumn + 1] === 2) {
                level[currentRow][currentColumn + 1] = 4
              }
              if (level[currentRow][currentColumn - 1] === 1 || level[currentRow][currentColumn - 1] === 2) {
                level[currentRow][currentColumn - 1] = 4
              }
              refreshLocation(event)
            }, delayInMilliseconds);



            // wait 1 second
            var delayInMilliseconds2 = 2000; //1 second
            setTimeout(function() {
              for (var i = 0; i < level.length; i++) {
                level[i]
                var line = level[i]
                for (var x = 0; x < line.length; x++) {
                  if (line[x] === 4) {
                    line[x] = 1;
                    refreshLocation(event)
                  }
                }
              }
            }, delayInMilliseconds2);
            // loop over array, change any 4 back to 1
            // refresh again
          }
            if (keysPressed[38] === 1) { // up
                if (player.currentAnimation !== "walk") { player.gotoAndPlay("walk"); }
                movePlayer(player, 0, -1, mapTiles);
            }
            if (keysPressed[40] === 1) { // down
                if (player.currentAnimation !== "walk") { player.gotoAndPlay("walk"); }
                movePlayer(player, 0, 1, mapTiles);
            }
            if (keysPressed[37] === 1) { // left
                if (player.currentAnimation !== "walk") { player.gotoAndPlay("walk"); }
                movePlayer(player, -1, 0, mapTiles);
            }
            if (keysPressed[39] === 1) { // right
                if (player.currentAnimation !== "walk") { player.gotoAndPlay("walk"); }
                movePlayer(player, 1, 0, mapTiles);
            }
            if (firstKey) {
                switch (firstKey) {
                case 38:
                    player.rotation = 270;
                    player.scaleX = 1;
                    break;
                case 40:
                    player.rotation = 90;
                    player.scaleX = 1;
                    break;
                case 37:
                    player.rotation = 0;
                    player.scaleX = -1;
                    break;
                case 39:
                    player.rotation = 0;
                    player.scaleX = 1;
                    break;
                }
              }
        }


        function handleTick() {
          detectKeys();
          stage.update();
        }

    document.addEventListener("keydown", function (e) {
      e.preventDefault();
      keysPressed[e.keyCode] = 1;
      if (!firstKey) { firstKey = e.keyCode; }
    });
    document.addEventListener("keyup", function (e) {
      keysPressed[e.keyCode] = 0;
      if (firstKey === e.keyCode) { firstKey = null; }
      if (player) { player.gotoAndStop("stand"); }
    });

    function init() {

        manifest = [
            {src: "images/tiles.png", id: "tiles"}
        ];

        function handleFileLoad(event) {
          if (event.item.type === "image") {
            var img = new Image();
            img.src = event.item.src;
          } else if (event.item.type === "sound") {
            var audio = new Audio();
            audio.src = event.item.src;
            }
          }

        function handleComplete(event) {
          buildMap(level);
          console.log("player")
          console.log(player)
          addPlayer(board, player, 3, 2, 0);
        }

        queue = new createjs.LoadQueue(false);
        queue.addEventListener("fileload", handleFileLoad);
        queue.addEventListener("complete", handleComplete);
        queue.loadManifest(manifest);

        canvas = document.getElementById("canvas");
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(30);
        createjs.Ticker.setFPS(10);
        createjs.Ticker.useRAF = true;
        createjs.Ticker.addEventListener("tick", handleTick);

    }

  init();

}(tiles, tileSheet, player, playerSheet, addPlayer, whichRow, whichColumn, movePlayer));
