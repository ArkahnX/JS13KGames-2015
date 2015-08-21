'use strict';

var gamesize = 25;

function up(map, x, y) {
	if (y - 1 < 0) {
		return -1;
	}
	return map[x][y - 1];
}

function down(map, x, y) {
	if (y + 1 > gamesize) {
		return -1;
	}
	return map[x][y + 1];
}

function left(map, x, y) {
	if (x - 1 < 0) {
		return -1;
	}
	return map[x - 1][y];
}

function right(map, x, y) {
	if (x + 1 > gamesize) {
		return -1;
	}
	return map[x + 1][y];
}


function canPlace(map, buildings, requiredTile, x, y, w, h) {

}

function canBuy(wallet, cost) { // accepts two arrays of numbers
	for (var i = 0; i < wallet.length; i++) {
		if (cost[i] && cost[i] > wallet[i]) {
			return false;
		}
	}
	return true;
}

var shared = {
	canBuy: canBuy,
	canPlace: canPlace,
	up: up,
	down: down,
	left: left,
	right: right,
	gamesize: gamesize
};

if (module && module.exports) {
	module.exports = function(io) {
		return shared;
	};
}