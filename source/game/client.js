(function(window, document) {
	/*!
	 * tablesort v3.1.0 (2015-07-03)
	 * http://tristen.ca/tablesort/demo/
	 * Copyright (c) 2015 ; Licensed MIT
	 */
	! function() {
		function a(b, c) {
			if (!(this instanceof a)) return new a(b, c);
			if (!b || "TABLE" !== b.tagName) throw new Error("Element must be a table");
			this.init(b, c || {})
		}
		var b = [],
			c = function(a) {
				var b;
				return window.CustomEvent && "function" == typeof window.CustomEvent ? b = new CustomEvent(a) : (b = document.createEvent("CustomEvent"), b.initCustomEvent(a, !1, !1, void 0)), b
			}, d = function(a) {
				return a.getAttribute("data-sort") || a.textContent || a.innerText || ""
			}, e = function(a, b) {
				return a = a.toLowerCase(), b = b.toLowerCase(), a === b ? 0 : b > a ? 1 : -1
			}, f = function(a, b) {
				return function(c, d) {
					var e = a(c.td, d.td);
					return 0 === e ? b ? d.index - c.index : c.index - d.index : e
				}
			};
		a.extend = function(a, c, d) {
			if ("function" != typeof c || "function" != typeof d) throw new Error("Pattern and sort must be a function");
			b.push({
				name: a,
				pattern: c,
				sort: d
			})
		}, a.prototype = {
			init: function(a, b) {
				var c, d, e, f, g = this;
				if (g.table = a, g.thead = !1, g.options = b, a.rows && a.rows.length > 0 && (a.tHead && a.tHead.rows.length > 0 ? (c = a.tHead.rows[a.tHead.rows.length - 1], g.thead = !0) : c = a.rows[0]), c) {
					var h = function() {
						g.current && g.current !== this && (g.current.classList.remove("sort-up"), g.current.classList.remove("sort-down")), g.current = this, g.sortTable(this)
					};
					for (e = 0; e < c.cells.length; e++) f = c.cells[e], f.classList.contains("no-sort") || (f.classList.add("sort-header"), f.tabindex = 0, f.addEventListener("click", h, !1), f.classList.contains("sort-default") && (d = f));
					d && (g.current = d, g.sortTable(d))
				}
			},
			sortTable: function(a, g) {
				var h, i = this,
					j = a.cellIndex,
					k = e,
					l = "",
					m = [],
					n = i.thead ? 0 : 1,
					o = a.getAttribute("data-sort-method");
				if (i.table.dispatchEvent(c("beforeSort")), g ? h = a.classList.contains("sort-up") ? "sort-up" : "sort-down" : (h = a.classList.contains("sort-up") ? "sort-down" : a.classList.contains("sort-down") ? "sort-up" : i.options.descending ? "sort-up" : "sort-down", a.classList.remove("sort-down" === h ? "sort-up" : "sort-down"), a.classList.add(h)), !(i.table.rows.length < 2)) {
					if (!o) {
						for (; m.length < 3 && n < i.table.tBodies[0].rows.length;) l = d(i.table.tBodies[0].rows[n].cells[j]), l = l.trim(), l.length > 0 && m.push(l), n++;
						if (!m) return
					}
					for (n = 0; n < b.length; n++) if (l = b[n], o) {
						if (l.name === o) {
							k = l.sort;
							break
						}
					} else if (m.every(l.pattern)) {
						k = l.sort;
						break
					}
					i.col = j;
					var p, q = [],
						r = {}, s = 0,
						t = 0;
					for (n = 0; n < i.table.tBodies.length; n++) for (p = 0; p < i.table.tBodies[n].rows.length; p++) l = i.table.tBodies[n].rows[p], l.classList.contains("no-sort") ? r[s] = l : q.push({
						tr: l,
						td: d(l.cells[i.col]),
						index: s
					}), s++;
					for ("sort-down" === h ? (q.sort(f(k, !0)), q.reverse()) : q.sort(f(k, !1)), n = 0; s > n; n++) r[n] ? (l = r[n], t++) : l = q[n - t].tr, i.table.tBodies[0].appendChild(l);
					i.table.dispatchEvent(c("afterSort"))
				}
			},
			refresh: function() {
				void 0 !== this.current && this.sortTable(this.current, !0)
			}
		}, "undefined" != typeof module && module.exports ? module.exports = a : window.Tablesort = a
	}();
	(function() {
		var cleanNumber = function(i) {
			return i.replace(/[^\-?0-9.]/g, '');
		},

		compareNumber = function(a, b) {
			a = parseFloat(a);
			b = parseFloat(b);

			a = isNaN(a) ? 0 : a;
			b = isNaN(b) ? 0 : b;

			return a - b;
		};

		Tablesort.extend('number', function(item) {
			return item.match(/^-?[£\x24Û¢´€]?\d+\s*([,\.]\d{0,2})/) || // Prefixed currency
			item.match(/^-?\d+\s*([,\.]\d{0,2})?[£\x24Û¢´€]/) || // Suffixed currency
			item.match(/^-?(\d)*-?([,\.]){0,1}-?(\d)+([E,e][\-+][\d]+)?%?$/); // Number
		}, function(a, b) {
			a = cleanNumber(a);
			b = cleanNumber(b);

			return compareNumber(b, a);
		});
	}());
	for (var attr in shared) {
		window[attr] = shared[attr];
	}
	var socket = io(document.location.href);
	var socketRequest = "sr";
	var canvas, context;
	// var 25 = 25;
	var tilesize = 32;
	// var 25 = 25;
	var mousex = 0;
	var mousey = 0;
	var strokeColor = "black";
	var wallet = [];
	var player = null;
	var tempBuilding = []; // x, y, w, h, r
	var continueReloading = true;
	var lastTarget = null;
	var frame = 0;
	var powerIMG = new Image();
	powerIMG.src = "power.gif";
	var treeIMG = new Image();
	treeIMG.src = "tree.gif";

	//login
	if (localStorage["userKey"]) {
		// success
		socket.emit(socketRequest, [
			[localStorage["id"], localStorage["userKey"]], "m"]);
	} else {
		socket.emit(socketRequest, "l"); // request initial login data
	}

	socket.on("l", function(data) {
		data = JSON.parse(data);
		for (var attr in data) {
			localStorage[attr] = JSON.stringify(data[attr]);
		}
		// localStorage["uniqueID"] = data.id;
		// localStorage["loginID"] = data.login;
		// localStorage["map"] = JSON.stringify(data.map);
		// localStorage["people"] = data.people;
		// localStorage["power"] = data.power;
		// localStorage["energy"] = data.energy;
		// localStorage["scrap"] = data.scrap;
		// localStorage["buildings"] = data.buildings;
		// localStorage["units"] = data.units;
		socket.emit(socketRequest, [
			[localStorage["id"], localStorage["userKey"]], "m"])
	})

	socket.on("m", function(data) {
		receiveUpdate(data);
		gamestart();
	});

	socket.on("disconnect", function() {
		window.location.reload();
	});

	socket.on("$", function(data) {
		data = JSON.parse(data);
		var html = "<table id='ranked'><thead><tr><th class='sort-header'>Name</th><th class='sort-header'>Worth</th><th class='sort-header'>Buildings</th></tr></thead><tbody>";
		for (var i = 0; i < data.length; i++) {
			var isPlayer = "";
			if (data[i].name === player.name && parseInt(data[i].buildings) === player.buildings.length) {
				isPlayer = "player";
			}
			html += "<tr class='" + isPlayer + "'><td>" + data[i].name + "</td><td>" + data[i].worth + "</td><td>" + data[i].buildings + "</td></tr>";
		}
		html += "</tbody></table>";
		document.getElementById("ranks").innerHTML = html;
		new Tablesort(document.getElementById('ranked'), {
			descending: true
		});
	});

	socket.on("e", function(data) {
		console.error(data);
	});

	socket.on("u", receiveUpdate);

	function receiveUpdate(data) {
		console.info("Synced with server at " + new Date());
		data = JSON.parse(data);
		for (var attr in data) {
			localStorage[attr] = JSON.stringify(data[attr]);
		}
		player = data;
		player.time = Date.now();
		document.getElementById("pn").innerHTML = player.name;
	}

	function gamestart() {
		var consbar = document.getElementById("consbar");
		canvas = document.getElementById("canvas");
		context = canvas.getContext("2d");
		canvas.width = 25 * tilesize;
		canvas.height = 25 * tilesize;
		addEvent(canvas, "mousemove", moveHandler);
		addEvent(canvas, "mousedown", clickHandler);
		addEvent(canvas, "contextmenu", doNothing);
		addEvent(document.getElementById("sidebar"), "click", sideMenuClick);
		addEvent(window, "focus", focusHandler);
		addEvent(window, "blur", stopRefresh);
		var html = '<ul>';
		for (var i = 1; i < buildings.length; i++) {
			html += '<li  class="structure" data-building="' + i + '">' + buildings[i][4] + '</li>'; // NAME
		}
		html += "</ul>";
		consbar.innerHTML = html + consbar.innerHTML;
		var structures = document.querySelectorAll(".structure");
		for (var i = 0; i < structures.length; i++) {
			addEvent(structures[i], "mouseover", structureHover);
			addEvent(structures[i], "click", selectStructure);
		}
		gameLoop();
	}

	function focusHandler(event) {
		continueReloading = true;
		refresh();
	}

	function gameLoop() {
		frame++;
		if (frame > 59) {
			frame = 0;
		}
		context.clearRect(0, 0, canvas.width, canvas.height)
		drawMap();
		cursorColor();
		drawCursor();
		drawTempBuilding();
		updateMoney();
		window.requestAnimationFrame(gameLoop);
	}

	function updateMoney() {
		document.getElementById("pc").innerHTML = player.power;
		document.getElementById("cc").innerHTML = player.crystal;
		document.getElementById("sc").innerHTML = player.scrap;
		document.getElementById("hc").innerHTML = player.human;
		document.getElementById("pm").innerHTML = player.caps[0];
		document.getElementById("cm").innerHTML = player.caps[1];
		document.getElementById("sm").innerHTML = player.caps[2];
		document.getElementById("hm").innerHTML = player.caps[3];
		document.getElementById("pp").innerHTML = player.plus[0];
		document.getElementById("cp").innerHTML = player.plus[1];
		document.getElementById("sp").innerHTML = player.plus[2];
		document.getElementById("hp").innerHTML = player.plus[3];
	}

	function cursorColor() { // ground, obstacle, crystal, stream, scrap
		strokeColor = "black";
		var placeable = canPlace(player.map, player.buildings, tempBuilding)
		if (placeable) {
			strokeColor = "green";
		} else if (placeable === null) {
			strokeColor = "blue";
		} else if (placeable === false) {
			strokeColor = "red";
		}
	}

	function drawMap() {
		var map = JSON.parse(localStorage["map"]);
		var x, y, i, e;
		for (x = 0; x < 25; x++) {
			for (y = 0; y < 25; y++) {
				if (map[x][y] === 1) {
					context.drawImage(treeIMG, x * tilesize, y * tilesize);
				} else {
					context.beginPath();
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
				}
				// context.closePath();
				// for (i = 0; i < tileFunction[LENGTH]; i++) {

				// tileFunction[i](map[x][y], obstacles[x][y]);
				// context.drawImage(tile.image, centerSymmetrical(tile.x, tileSize), centerSymmetrical(tile.y, tileSize));
				// }
			}
		}
		for (var i = 0; i < player.buildings.length; i++) {
			var building = player.buildings[i];
			if (parseInt(building.id) === 1) {
				var nearbyBuildings = findNearBuildings(player.buildings, building);
				var buildingCenterX = (building.x + (building.w / 2)) * tilesize;
				var buildingCenterY = (building.y + (building.h / 2)) * tilesize;
				for (var e = 0; e < nearbyBuildings.length; e++) {
					var nearBuildingCenterX = (nearbyBuildings[e].x + (nearbyBuildings[e].w / 2)) * tilesize;
					var nearBuildingCenterY = (nearbyBuildings[e].y + (nearbyBuildings[e].h / 2)) * tilesize;
					context.beginPath();
					context.strokeStyle = "black";
					context.lineCap = 'square';
					context.lineWidth = 5;
					context.moveTo(buildingCenterX, buildingCenterY);
					context.lineTo(nearBuildingCenterX, nearBuildingCenterY);
					context.stroke();
					context.closePath();
				}
			}
		}
		for (var i = 0; i < player.buildings.length; i++) {
			var building = player.buildings[i];
			if (parseInt(building.id) !== 1) {
				context.beginPath();
				context.strokeWidth = 4;
				context.fillStyle = buildings[building.id][7]; // COLOR
				if (building.power) {
					context.strokeStyle = "black";
				} else {
					context.strokeStyle = "red";
				}
				context.rect(building.x * tilesize, building.y * tilesize, building.w * tilesize, building.h * tilesize);
				context.fill();
				context.stroke();
				// context.webkitImageSmoothingEnabled = false;
				// context.mozImageSmoothingEnabled = false;
				context.imageSmoothingEnabled = false; /// future
				if (!building.power && frame > 29) {
					context.drawImage(powerIMG, (building.x + (building.w / 2)) * tilesize - 8, (building.y + (building.h / 2)) * tilesize - 8, 16, 16);
				}
			}
		}
	}

	function drawTempBuilding() {
		context.beginPath();
		context.fillStyle = 'rgba(0,0,0,0.5)';
		context.rect(mousex * tilesize, mousey * tilesize, tempBuilding[2] * tilesize, tempBuilding[3] * tilesize);
		context.fill();
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
		tempBuilding[0] = mousex;
		tempBuilding[1] = mousey;
		if (continueReloading === false) {
			continueReloading = true;
			refresh();
		}
	}

	function clickHandler(event) {
		doNothing(event);
		if (event.button === 2) {
			tempBuilding.length = 0;
		}
		if (tempBuilding.length > 0) {
			socket.emit(socketRequest, [
				[localStorage["id"], localStorage["userKey"]], "p", tempBuilding]);
			tempBuilding.length = 0;
		}
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
			document.getElementById("score").classList.remove("active");
			document.getElementById("ranks").classList.remove("visible");
			event.target.classList.toggle("active");
			document.getElementById("consbar").classList.toggle("visible");
		}
		if (event.target.id === "score") {
			document.getElementById("cons").classList.remove("active");
			document.getElementById("consbar").classList.remove("visible");
			event.target.classList.toggle("active");
			document.getElementById("ranks").classList.toggle("visible");
			if (document.getElementById("ranks").classList.contains("visible")) {
				socket.emit(socketRequest, [
					[localStorage["id"], localStorage["userKey"]], "$"]);
				document.getElementById("ranks").innerHTML = "Loading...";
			}
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

	function structureHover(event) {
		doNothing(event);
		if (event.target.dataset.building /* && lastTarget !== event.target.dataset.building*/ ) {
			lastTarget = event.target.dataset.building;
			var buildingID = event.target.dataset.building;
			wallet = getWallet(player);
			var purchaseable = canBuy(wallet, buildings[buildingID][0]); // COST
			document.getElementById("desc").innerHTML = buildings[buildingID][4]; // DESC
			var expensive = false;
			event.target.classList.remove("disabled");
			for (var i = 0; i < costNames.length; i++) {
				var costElement = document.getElementById(costNames[i] + "-cost");
				var capElement = document.getElementById(costNames[i] + "-cap");
				var plusElement = document.getElementById(costNames[i] + "-plus");
				costElement.innerHTML = buildings[buildingID][0][i]; // COST
				capElement.innerHTML = buildings[buildingID][1][i]; // CAP
				plusElement.innerHTML = buildings[buildingID][2][i]; // PLUS
				costElement.classList.remove("expensive");
				if (buildings[buildingID][0][i] > wallet[i]) { // COST
					expensive = true;
					costElement.classList.add("expensive");
				}
			}
			if (expensive) {
				event.target.classList.add("disabled");
			}
		}
	}

	function selectStructure(event) {
		doNothing(event);
		if (event.target.dataset.building) {
			if (event.target.classList.contains("disabled") === false) {
				var buildingID = parseInt(event.target.dataset.building);
				if (canBuy(wallet, buildings[buildingID][0])) { // COST
					tempBuilding = [mousex, mousey, buildings[buildingID][3][0], buildings[buildingID][3][1], buildings[buildingID][6], buildingID]; // SIZE
				}
			}
		}
	}


	setInterval(refresh, 1000 * 60);

	setInterval(function() {
		wallet = getWallet(player);
	}, 1000);

	setInterval(stopRefresh, 1000 * 60 * 10);

	function stopRefresh() {
		if (continueReloading) {
			continueReloading = false;
			console.info("%c Stopping refresh ", "background:#AAA; color:#AA0000;font-weight:bolder", "" + new Date());
		}
	}

	function refresh() {
		if (continueReloading && localStorage["userKey"]) {
			socket.emit(socketRequest, [
				[localStorage["id"], localStorage["userKey"]], "u"]);
		}
	}
}(window, document));