var socket = io(document.location.href);
var socketRequest = "sr";
var canvas, context;
var gamesize = 25;
var tilesize = 32;
var mousex = 0;
var mousey = 0;
var strokeColor = "black";
var buildingCosts = [];
// power, crystal, scrap
buildingCosts[0] = [999, 999, 999]; // starbase
buildingCosts[1] = [0, 0, 1]; // pipe
buildingCosts[2] = [1, 1, 2]; // power facility
buildingCosts[3] = [2, 2, 2]; // human facility
buildingCosts[4] = [2, 2, 2]; // scrap facility
buildingCosts[5] = [2, 2, 2]; // crystal facility
buildingCosts[6] = [2, 2, 2]; // storage facility
var buildingCaps = [];
// power, crystal, scrap, human
buildingCaps[0] = [10, 10, 10, 10]; // starbase
buildingCaps[1] = [0, 0, 0, 0]; // pipe
buildingCaps[2] = [5, 0, 0, 0]; // power facility
buildingCaps[3] = [0, 0, 0, 5]; // human facility
buildingCaps[4] = [0, 0, 5, 0]; // scrap facility
buildingCaps[5] = [0, 5, 0, 0]; // crystal facility
buildingCaps[6] = [0, 5, 0, 0]; // storage facility
var buildingSupplies = []; // resources per second
// power, crystal, scrap, human
buildingSupplies[0] = [0, 0, 0, 0]; // starbase
buildingSupplies[1] = [0, 0, 0, 0]; // pipe
buildingSupplies[2] = [1, 0, 0, 0]; // power facility
buildingSupplies[3] = [0, 0, 0, 1]; // human facility
buildingSupplies[4] = [0, 0, 1, 0]; // scrap facility
buildingSupplies[5] = [0, 1, 0, 0]; // crystal facility
buildingSupplies[6] = [5, 5, 5, 5]; // storage facility
var buildingSizes = [];
// X,Y
buildingCosts[0] = [3,3]; // starbase
buildingCosts[1] = [1,1]; // pipe
buildingCosts[2] = [2,2]; // power facility
buildingCosts[3] = [2,2]; // human facility
buildingCosts[4] = [2,2]; // scrap facility
buildingCosts[5] = [2,2]; // crystal facility
buildingCosts[6] = [2,2]; // storage facility


//login
if (localStorage["loginID"]) {
	// success
	socket.emit(socketRequest, [localStorage["loginID"], "m"])
} else {
	socket.emit(socketRequest, "l"); // request initial login data
}

socket.on("l", function(data) {
	data = JSON.parse(data);
	localStorage["uniqueID"] = data.id;
	localStorage["loginID"] = data.login;
	localStorage["map"] = JSON.stringify(data.map);
	localStorage["people"] = data.people;
	localStorage["power"] = data.power;
	localStorage["energy"] = data.energy;
	localStorage["scrap"] = data.scrap;
	localStorage["buildings"] = data.buildings;
	localStorage["units"] = data.units;
	socket.emit(socketRequest, [localStorage["loginID"], "m"])
})

socket.on("m", function(data) {
	localStorage["map"] = data;
	gamestart();
})

function gamestart() {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	canvas.width = gamesize * tilesize;
	canvas.height = gamesize * tilesize;
	addEvent(canvas, "mousemove", moveHandler);
	addEvent(canvas, "mousedown", clickHandler);
	addEvent(canvas, "contextmenu", doNothing);
	addEvent(document.getElementById("cons"), "click", sideMenuClick);
	gameLoop();
}

function gameLoop() {
	context.clearRect(0, 0, canvas.width, canvas.height)
	drawMap();
	cursorColor();
	drawCursor();
	window.requestAnimationFrame(gameLoop);
}

function cursorColor() {
	strokeColor = "black";
	// if (canBuild() && isBuilding()) {
	// 	strokeColor = "green";
	// } else if (canBuild() === NULL) {
	// 	strokeColor = "blue";
	// } else if (!canBuild()) {
	// 	strokeColor = "red";
	// }
}

function drawMap() {
	var map = JSON.parse(localStorage["map"]);
	var x, y, i, e;
	for (x = 0; x < gamesize; x++) {
		for (y = 0; y < gamesize; y++) {
			context.beginPath();
			// console.log(x, y)
			if (map[x][y] === 0) {
				context.fillStyle = 'green';
			}
			if (map[x][y] === 1) {
				context.fillStyle = 'black';
			}
			if (map[x][y] === 2) {
				context.fillStyle = 'blue';
			}
			if (map[x][y] === 3) {
				context.fillStyle = 'lightblue';
			}
			if (map[x][y] === 4) {
				context.fillStyle = 'grey';
			}
			context.rect(x * tilesize, y * tilesize, tilesize, tilesize);
			context.fill();
			// context.closePath();
			// for (i = 0; i < tileFunction[LENGTH]; i++) {

			// tileFunction[i](map[x][y], obstacles[x][y]);
			// context.drawImage(tile.image, centerSymmetrical(tile.x, tileSize), centerSymmetrical(tile.y, tileSize));
			// }
		}
	}
}

function addEvent(target, handler, callback) {
	target.removeEventListener(handler, callback);
	target.addEventListener(handler, callback, true);
}

function doNothing(event) {
	event.preventDefault();
}

function modulus(num, size) {
	var mod = num % size;
	return (num - mod) / size;
};

function moveHandler(event) {
	mousex = event.pageX - canvas.offsetLeft;
	mousey = event.pageY - canvas.offsetTop;
	mousex = modulus(mousex, tilesize * (canvas.clientHeight / 800));
	mousey = modulus(mousey, tilesize * (canvas.clientHeight / 800));
}

function clickHandler(event) {
	doNothing(event);
	// selectedTower = null;
	// if (isBuilding() && canBuild()) {
	// 	if (event.which === 2) {
	// 		returnStructure();
	// 	} else {
	// 		towersBuilt++;
	// 		var tower = cloneData(building(), ["x", "y", "weapon"], [tileCloneX, tileCloneY, cloneWeapon], [mouse.x, mouse.y]);
	// 		obstacles[mouse.x][mouse.y] = tower;
	// 		selectedTower = obstacles[mouse.x][mouse.y];
	// 		bought = null;
	// 		checkAffordable();
	// 		if (onScreen.length) {
	// 			getAllPaths(onScreen);
	// 		}
	// 	}
	// }
	// if (canBuild() === null) {
	// 	//middle click sell
	// 	if (event.which === 2) {
	// 		if (base.x !== mouse.x || base.y !== mouse.y) {
	// 			sellStructure(mouse.x, mouse.y);
	// 		}
	// 	} else {
	// 		// select tower
	// 		if (obstacles[mouse.x][mouse.y] === 0) {
	// 			selectedTower = null;
	// 		} else {
	// 			selectedTower = obstacles[mouse.x][mouse.y];
	// 		}
	// 	}
	// }
}

function sideMenuClick(event) {
	doNothing(event);
	if (event.target.id === "cons") {
		event.target.classList.toggle("active");
		document.getElementById("consbar").classList.toggle("visible");
	}
}

function drawCursor() {
	var x = mousex * tilesize;
	var y = mousey * tilesize;
	context.strokeStyle = strokeColor;
	context.lineWidth = 2;
	context.strokeRect(x, y, tilesize, tilesize);
	context.strokeStyle = "#FFF";
	context.strokeRect(x - 2, y - 2, tilesize + 4, tilesize + 4);
	// if (selectedTower !== null) {
	// 	var x = selectedTower.x * tilesize;
	// 	var y = selectedTower.y * tilesize;
	// 	context.strokeStyle = "#FFF";
	// 	context.lineWidth = 2;
	// 	context.strokeRect(x, y, tilesize, tilesize);
	// 	if (typeof selectedTower.weapon !== "string") {
	// 		context.beginPath();
	// 		context.arc(centerSymmetrical(selectedTower.x, 1), centerSymmetrical(selectedTower.y, 1), selectedTower.weapon.range * tilesize, 0, 2 * Math.PI, false);
	// 		context.fillStyle = "rgba(255,255,255,0.3)";
	// 		context.fill();
	// 		var radius = (selectedTower.weapon.range * tilesize) - 1;
	// 		var startAngle = 4 * Math.PI;
	// 		var endAngle = 2 * Math.PI;

	// 		context.beginPath();
	// 		context.arc(centerSymmetrical(selectedTower.x, 1), centerSymmetrical(selectedTower.y, 1), radius, startAngle, endAngle, false);
	// 		context.lineWidth = 2;
	// 		// line color
	// 		context.strokeStyle = "rgba(0,0,0,0.3)";
	// 		context.stroke();
	// 	}
	// }
}