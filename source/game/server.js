var io = require('sandbox-io');
var path = require("path");
var shared = require("./shared.js");
if (!load("userID")) {
	save("userID", 0);
}
var batchedWrites = [];
var firstNames = "Andrew,Ivan,Benjamin,Bernard,Julian,Hilda,Cordelia,Martha,Amy,Emilie".split(",");
var lastNames = "Copeland,Burgess,Mendez,Davidson,Barnes,Williamson,Watts,Gregory,Young,Freeman".split(",");
// var 25 = 25;
var userID = load("userID");
var tilePriorities = [0.94 * 25 * 25, 0.03 * 25 * 25, 0.01 * 25 * 25, 0.00 * 25 * 25, 0.02 * 25 * 25]; // ground, obstacle, crystal, stream, scrap
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

function isSame(oldUser, newUser) {
	if (!oldUser) {
		return false;
	}
	for (var attr in newUser) {
		if (oldUser[attr] === undefined) {
			return false;
		}
		if (["map", "units", "buildings", "time", "caps", "plus"].indexOf(attr) === -1) {
			if (oldUser[attr] !== newUser[attr]) {
				return false;
			}
		}
	}
	if (oldUser.buildings.length !== newUser.buildings.length) {
		return false;
	}
	if (oldUser.map.length !== newUser.map.length) {
		return false;
	}
	if (oldUser.units.length !== newUser.units.length) {
		return false;
	}
	return true;
}

function save(name, value) {
	// var oldValue = JSON.stringify(load(name));
	var newValue = JSON.stringify(value);
	if (name === "userID") {
		db(name, newValue);
	}
	if (name !== "userID" && !isSame(load(name), value)) {
		db(name, newValue);
	}
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

function calculateWorth(buildingID) {
	if (buildingID === 0) {
		return 0;
	}
	var building = shared.buildings[buildingID];
	var value = 0;
	for (var i = 0; i < building[0].length; i++) {
		value += Math.floor(building[0][i] * 0.5);
	}
	return value;
}

io.on('connection', function(socket) {
	var address = socket.request.connection.remoteAddress.split(":");
	socket.emit('srv-msg', {
		msg: address[address.length - 1]
	});
	socket.on('sr', function(data) {
		// send initial login information
		if (data === "l") {
			createUser(socket);
		}
		if (typeof data === "object") {
			var userIndex = parseInt(data[0][0]);
			var userKey = JSON.parse(data[0][1]);
			var user = load(userIndex);
			if (!user || user.userKey !== userKey) {
				send(socket, "e", "Unable to login with user data.");
				// return false;
				return createUser(socket);
			}
			if (data[1] === "m") {
				var map = user.map;
				if (map.length > 0) {
					shared.getWallet(user, true);
					return send(socket, "m", user);
					save(userIndex, user);
				}
				for (var x = 0; x < 25; x++) {
					map[x] = map[x] || [];
					for (var y = 0; y < 25; y++) {
						// if (map[x][y] === undefined) {
						var priorities = tilePriorities;
						if (x === 0 || y === 0 || x === 25 - 1 || y === 25 - 1) {
							priorities = [tilePriorities[0], 0.07 * 25 * 25, tilePriorities[2], tilePriorities[3], tilePriorities[4]];
						}
						var tile = getWeightedRandom(priorities);
						map = tileFunctions[tile](map, x, y);
						// }
					}
				}
				save(userIndex, user);
				send(socket, "m", user);
			}
			if (data[1] === "$") {
				var datalist = [];
				for (var i = 0; i < userID; i++) {
					var user = load(i);
					user.worth = 0;
					if (user.buildings) {
						shared.getWallet(user, true);
						for (var e = 0; e < user.buildings.length; e++) {
							user.worth += calculateWorth(user.buildings[e].id);
						}
						user.worth += Math.floor(user.power * 0.5);
						user.worth += Math.floor(user.crystal * 0.5);
						user.worth += Math.floor(user.scrap * 0.5);
						user.worth += Math.floor(user.human * 0.5);
						datalist.push({
							name: user.name || user.id,
							worth: user.worth,
							buildings: user.buildings.length
						});
						save(i, user);
					}
				}
				send(socket, "$", datalist);
			}
			if (data[1] === "u") {
				// console.log("received update request")
				// save(userIndex, user);
				shared.getWallet(user, true);
				send(socket, "u", user);
				save(userIndex, user);
			}
			if (data[1] === "p") {
				var placeable = shared.canPlace(user.map, user.buildings, data[2]);
				var buyable = shared.canBuy(shared.getWallet(user, true), shared.buildings[data[2][5]][0]);
				if (placeable && buyable) {
					user.buildings.push({
						x: parseInt(data[2][0]),
						y: parseInt(data[2][1]),
						w: parseInt(data[2][2]),
						h: parseInt(data[2][3]),
						id: parseInt(data[2][5]),
						power: false,
						time: Date.now()
					});
					shared.handleOverlap(user);
					shared.isPowered(user, user.buildings);
					shared.purchase(user, data[2][5]);
					send(socket, "u", user);
				}
				save(userIndex, user);
				if (placeable === false) {
					send(socket, "e", "Unable to place structure.");
				}
				if (buyable === false) {
					send(socket, "e", "Unable to purchase structure.");
				}
			}
		}
	});
});

function createUser(socket) {
	var user = {
		userKey: socket.id,
		id: userID,
		map: [],
		name: firstNames[random(0, 9)] + " " + lastNames[random(0, 9)],
		caps: [0, 0, 0, 0],
		plus: [0, 0, 0, 0],
		human: 0,
		power: 0,
		crystal: 0,
		scrap: 0,
		worth: 0,
		buildings: [{
			x: random(0, 25 - shared.buildings[0][3][0]),
			y: random(0, 25 - shared.buildings[0][3][1]),
			w: shared.buildings[0][3][0],
			h: shared.buildings[0][3][1],
			id: 0,
			power: true,
			time: Date.now()
		}],
		maxed: 0,
		units: [],
		time: Date.now()
	};
	send(socket, "l", user);
	save(userID, user);
	save("userID", ++userID);
}

// setInterval(function() {
// 	if (batchedWrites.length) {
// 		for (var i = 0; i < batchedWrites.length; i++) {
// 			var user =
// 		}
// 		batchedWrites.length = 0;
// 	}
// }, 1000 * 30);