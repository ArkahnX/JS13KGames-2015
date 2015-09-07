'use strict';
var shared = {
	costNames: ["power", "crystal", "scrap", "human"],
	// var 25 = 25;
	// var COST = 0;
	// var CAP = 1;
	// var PLUS = 2;
	// var SIZE = 3;
	// var NAME = 4;
	// var DESC = 5;
	// var REQUIRED_TILE = 6;
	// var COLOR = 7;
	buildings: [ // ground, obstacle, crystal, stream, scrap
	[ // starbase
	[43200, 57600, 86400, 0], // cost power, crystal, scrap
	[300, 300, 300, 300], // cap power, crystal, scrap, human
	[10, 10, 10, 10], // resources per second power, crystal, scrap, human
	[3, 3], // size width, height
	"Starbase", "Your main base of operations.", 0, "gold"],
		[ // pipe
		[0, 0, 10, 0], // cost power, crystal, scrap
		[0, 0, 0, 0], // cap power, crystal, scrap, human
		[0, 0, 0, 0], // resources per second power, crystal, scrap, human
		[1, 1], // size width, height
		"Pipe", "Used to connect buildings.", 0, "orange"],
		[ // power facility
		[60, 60, 120, 0], // cost power, crystal, scrap
		[30, 0, 0, 0], // cap power, crystal, scrap, human
		[1, 0, 0, 0], // resources per second power, crystal, scrap, human
		[2, 2], // size width, height
		"Power", "Increase the maximum power capacity.", 0, "yellow"],
		[ // human facility
		[120, 120, 120, 0], // cost power, crystal, scrap
		[0, 0, 0, 30], // cap power, crystal, scrap, human
		[0, 0, 0, 1], // resources per second power, crystal, scrap, human
		[2, 2], // size width, height
		"Human", "Create more humans.", 0, "white"],
		[ // scrap facility
		[120, 120, 120, 0], // cost power, crystal, scrap
		[0, 0, 30, 0], // cap power, crystal, scrap, human
		[0, 0, 1, 0], // resources per second power, crystal, scrap, human
		[2, 2], // size width, height
		"Scrap", "Used to mine scrap.", 4, "silver"],
		[ // crystal facility
		[120, 120, 120, 0], // cost power, crystal, scrap
		[0, 30, 0, 0], // cap power, crystal, scrap, human
		[0, 1, 0, 0], // resources per second power, crystal, scrap, human
		[2, 2], // size width, height
		"Crystal", "Used to mine crystal.", 2, "lightblue"],
		[ // storage facility
		[240, 240, 240, 0], // cost power, crystal, scrap
		[100, 100, 100, 100], // cap power, crystal, scrap, human
		[0, 0, 0, 0], // resources per second power, crystal, scrap, human
		[2, 2], // size width, height
		"Storage", "Increase all storage capacity.", 0, "#444"]
	],

	purchase: function(player, buildingID) {
		var costNames = ["power", "crystal", "scrap", "human"];
		for (var i = 0; i < costNames.length; i++) {
			player[costNames[i]] -= shared.buildings[buildingID][0][i];
		}
	},

	getWallet: function(player, calculateCash) {
		var costNames = ["power", "crystal", "scrap", "human"];
		player.caps = [];
		player.plus = [];
		for (var e = 0; e < costNames.length; e++) {
			player.caps.push(10);
			player.plus.push(0);
		}
		for (var i = 0; i < player.buildings.length; i++) {
			var building = player.buildings[i];
			var buildingDetails = shared.buildings[parseInt(building.id)];
			for (var e = 0; e < costNames.length; e++) {
				if (building.power) {
					player.caps[e] += buildingDetails[1][e];
					player.plus[e] += buildingDetails[2][e];
				}
				if (calculateCash && building.power) {
					player[costNames[e]] += Math.floor(((Date.now() - building.time) / 1000) * buildingDetails[2][e]);
				}
			}
			building.time = Date.now();
		}
		for (var e = 0; e < costNames.length; e++) {
			if (!calculateCash) {
				player[costNames[e]] += Math.floor(((Date.now() - player.time) / 1000) * player.plus[e]);
			}
			if (player[costNames[e]] > player.caps[e]) {
				player[costNames[e]] = player.caps[e];
			}
		}
		player.time = Date.now();
		return [player.power, player.crystal, player.scrap, player.human];
	},

	up: function(map, x, y) {
		if (y - 1 < 0) {
			return -1;
		}
		return map[x][y - 1];
	},

	down: function(map, x, y) {
		if (y + 1 > 25) {
			return -1;
		}
		return map[x][y + 1];
	},

	left: function(map, x, y) {
		if (x - 1 < 0) {
			return -1;
		}
		return map[x - 1][y];
	},

	right: function(map, x, y) {
		if (x + 1 > 25) {
			return -1;
		}
		return map[x + 1][y];
	},

	isOverlapping: function(x1, y1, w1, h1, x2, y2, w2, h2) {
		if (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2) {
			return true;
		}
		return false;
	},



	canPlace: function(playerMap, structureList, structure) {
		var currentStructure;
		if (structure.length < 5) {
			return null;
		}
		if (playerMap[structure[0]][structure[1]] > 0) {
			return false;
		}
		for (var i = 0; i < structureList.length; i++) {
			currentStructure = structureList[i];
			if ((parseInt(currentStructure.id) !== 1 && parseInt(structure[5]) !== 1) || parseInt(structure[5]) === 1) {
				if (shared.isOverlapping(structure[0], structure[1], structure[2], structure[3], currentStructure.x, currentStructure.y, currentStructure.w, currentStructure.h)) {
					return false;
				}
			}
		}
		var foundRequiredTile = false;
		for (var mapx = 0; mapx < structure[2]; mapx++) {
			for (var mapy = 0; mapy < structure[3]; mapy++) {
				var coordx = mapx + structure[0];
				var coordy = mapy + structure[1];
				if (playerMap[coordx][coordy] !== 0) {
					return false;
				}
				if (structure[4] > 0) {
					if (mapx === 0) {
						if (shared.left(playerMap, coordx, coordy) === structure[4]) {
							foundRequiredTile = true;
						}
					}
					if (mapx === structure[2] - 1) {
						if (shared.right(playerMap, coordx, coordy) === structure[4]) {
							foundRequiredTile = true;
						}
					}
					if (mapy === 0) {
						if (shared.up(playerMap, coordx, coordy) === structure[4]) {
							foundRequiredTile = true;
						}
					}
					if (mapy === structure[3] - 1) {
						if (shared.down(playerMap, coordx, coordy) === structure[4]) {
							foundRequiredTile = true;
						}
					}
				}
			}
		}
		if (foundRequiredTile || structure[4] < 1) {
			return true;
		}
		return false;
	},

	canBuy: function(wallet, cost) { // accepts two arrays of numbers
		for (var i = 0; i < wallet.length; i++) {
			if (cost[i] && cost[i] > wallet[i]) {
				return false;
			}
		}
		return true;
	},

	isPowered: function(player, buildingList) {
		// var noPower = [];
		for (var i = 0; i < buildingList.length; i++) {
			var building = buildingList[i];
			var nearbyBuildings = shared.findNearBuildings(player.buildings, building);
			if (building.power === false) {}
			for (var e = 0; e < nearbyBuildings.length; e++) {
				if ((nearbyBuildings[e].power || parseInt(building.id) === 2) && building.power === false) {
					building.power = true;
					shared.isPowered(player, nearbyBuildings)
				}
			}
			if (!nearbyBuildings.length && parseInt(building.id) === 2 && building.power === false) {
				building.power = true;
			}
		}
	},

	handleOverlap: function(player) {
		var keepList = [];
		for (var i = 0; i < player.buildings.length; i++) {
			var primaryBuilding = player.buildings[i];
			var overlapping = false;
			for (var e = 0; e < player.buildings.length; e++) {
				if (i !== e) {
					var nextBuilding = player.buildings[e];
					if (shared.isOverlapping(primaryBuilding.x, primaryBuilding.y, primaryBuilding.w, primaryBuilding.h, nextBuilding.x, nextBuilding.y, nextBuilding.w, nextBuilding.h)) {
						if (parseInt(primaryBuilding.id) === 1) {
							overlapping = true;
						}
					}
				}
			}
			if (overlapping === false) {
				keepList.push(primaryBuilding);
			}
		}
		player.buildings = keepList;
	},

	getCoords: function(building) {
		var coords = [];
		for (var x = 0; x < building.w; x++) {
			coords.push({
				x: building.x + x,
				y: building.y - 1
			});
			coords.push({
				x: building.x + x,
				y: building.y + building.h
			});
		}
		for (var y = 0; y < building.h; y++) {
			coords.push({
				x: building.x - 1,
				y: building.y + y
			});
			coords.push({
				x: building.x + building.w,
				y: building.y + y
			});
		}
		return coords;
	},

	findNearBuildings: function(buildingList, building) {
		var result = [];
		for (var i = 0; i < buildingList.length; i++) {
			if (shared.matchCoords(shared.getCoords(building), buildingList[i]) || shared.matchCoords(shared.getCoords(buildingList[i]), building)) {
				result.push(buildingList[i])
			}
		}
		return result;
	},

	matchCoords: function(coords, building) {
		for (var i = 0; i < coords.length; i++) {
			// if (coords[i].x === building.x && coords[i].y === building.y) {
			// 	return true;
			// }
			if (shared.isOverlapping(coords[i].x, coords[i].y, 1, 1, building.x, building.y, building.w, building.h)) {
				return true;
			}
		}
		return false;
	}
};

if (typeof module === "object" && module.exports) {
	module.exports = shared;
} else {
	window.shared = shared;
}