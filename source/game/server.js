var io = require('sandbox-io');
if (!load("userID")) {
	save("userID", 0);
}
var gamesize = 25;
var userID = load("userID");
var tilePriorities = [0.94 * gamesize * gamesize, 0.03 * gamesize * gamesize, 0.01 * gamesize * gamesize, 0.00 * gamesize * gamesize, 0.02 * gamesize * gamesize]; // ground, obstacle, crystal, stream, scrap
var tileFunctions = [function(map, x, y) {
	map[x][y] = 0;
	return map;
}, function(map, x, y) {
	map[x][y] = 1;
	return map;
},
crystal, stream, scrap];

function send(target, name, data) {
	target.emit(name, JSON.stringify(data));
}

function save(name, value) {
	db(name, JSON.stringify(value));
}

function load(name) {
	var result = db(name);
	if (typeof result === "string") {
		return JSON.parse(db(name));
	}
	return result;
}

function random(from, to) {
	return Math.floor(Math.random() * (to - from + 1)) + from;
}

function getWeightedRandom(priorities) {
	var sum_of_weight = 0;
	for (var i = 0; i < priorities.length; i++) {
		sum_of_weight += priorities[i];
	}
	var num = random(0, sum_of_weight - 1);
	for (var i = 0; i < priorities.length; i++) {
		if (num < priorities[i]) {
			return i;
		}
		num -= priorities[i];
	}
	// shouldnt arrive here
	return false;
}

function crystal(map, x, y) {
	var crystalWidth = random(1, 3);
	var crystalHeight = random(1, 3);
	for (var i = 0; i < crystalWidth; i++) {
		map[x + i] = map[x + i] || [];
		for (var e = 0; e < crystalHeight; e++) {
			if (x - i > -1 && y - e > -1) {
				var tile = getWeightedRandom([3, 0, 7, 0, 0]);
				if (tile !== 0) {
					map[x - i][y - e] = tile;
				}
				if (!map[x - i][y - e]) {
					map[x - i][y - e] = 0;
				}
			}
		}
	}
	return map;
}

function stream(map, x, y) {
	map[x][y] = 3;
	return map;
}

function scrap(map, x, y) {
	var crystalWidth = random(2, 3);
	var crystalHeight = random(2, 3);
	for (var i = 0; i < crystalWidth; i++) {
		map[x + i] = map[x + i] || [];
		for (var e = 0; e < crystalHeight; e++) {
			if (x - i > -1 && y - e > -1) {
				var tile = getWeightedRandom([4, 0, 0, 0, 6]);
				if (tile !== 0) {
					map[x - i][y - e] = tile;
				}
				if (!map[x - i][y - e]) {
					map[x - i][y - e] = 0;
				}
			}
		}
	}
	return map;
}

io.on('connection', function(socket) {
	var address = socket.request.connection.remoteAddress.split(":");
	socket.emit('srv-msg', {
		msg: address[address.length - 1]
	});
	socket.on('sr', function(data) {
		// send initial login information
		if (data === "l") {
			var user = {
				id: socket.id,
				login: userID,
				map: [],
				people: 0,
				energy: 0,
				scrap: 0
			};
			send(socket, "l", user);
			save(userID, user);
			save("userID", ++userID);
		}
		if (typeof data === "object") {
			if (data[1] === "m") {
				var user = load(data[0]);
				var map = user.map;
				if (map.length > 0) {
					return send(socket, "m", map);
				}
				for (var x = 0; x < gamesize; x++) {
					map[x] = map[x] || [];
					for (var y = 0; y < gamesize; y++) {
						// if (map[x][y] === undefined) {
						var priorities = tilePriorities;
						if (x === 0 || y === 0 || x === gamesize - 1 || y === gamesize - 1) {
							priorities = [tilePriorities[0], 0.07 * gamesize * gamesize, tilePriorities[2], tilePriorities[3], tilePriorities[4]];
						}
						var tile = getWeightedRandom(priorities);
						map = tileFunctions[tile](map, x, y);
						// }
					}
				}
				save(data[0], user);
				send(socket, "m", map);
			}
		}
	});
});