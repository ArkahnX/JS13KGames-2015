var socket = io(document.location.href);
var socketRequest = "sr";
var canvas, context;
var gamesize = 50;
var tilesize = 16;


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
	localStorage["energy"] = data.energy;
	localStorage["scrap"] = data.scrap;
	socket.emit(socketRequest, [localStorage["loginID"], "m"])
})

socket.on("m", function(data) {
	localStorage["map"] = data;
	gamestart();
})

function gamestart() {
	var map = JSON.parse(localStorage["map"]);
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	canvas.width = gamesize * tilesize;
	canvas.height = gamesize * tilesize;
	console.log(JSON.parse(localStorage["map"]));
	context.beginPath();
	context.rect(188, 50, 200, 100);
	context.fillStyle = 'yellow';
	context.fill();
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