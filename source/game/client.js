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
				if (g.table = a, g.thead = !1, g.options = b, a.rows && a.rows[length] > 0 && (a.tHead && a.tHead.rows[length] > 0 ? (c = a.tHead.rows[a.tHead.rows[length] - 1], g.thead = !0) : c = a.rows[0]), c) {
					var h = function() {
						g.current && g.current !== this && (g.current[classList].remove("sort-up"), g.current[classList].remove("sort-down")), g.current = this, g.sortTable(this)
					};
					for (e = 0; e < c.cells[length]; e++) f = c.cells[e], f[classList].contains("no-sort") || (f[classList].add("sort-header"), f.tabindex = 0, f.addEventListener("click", h, !1), f[classList].contains("sort-default") && (d = f));
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
				if (i.table.dispatchEvent(c("beforeSort")), g ? h = a[classList].contains("sort-up") ? "sort-up" : "sort-down" : (h = a[classList].contains("sort-up") ? "sort-down" : a[classList].contains("sort-down") ? "sort-up" : i.options.descending ? "sort-up" : "sort-down", a[classList].remove("sort-down" === h ? "sort-up" : "sort-down"), a[classList].add(h)), !(i.table.rows[length] < 2)) {
					if (!o) {
						for (; m[length] < 3 && n < i.table.tBodies[0].rows[length];) l = d(i.table.tBodies[0].rows[n].cells[j]), l = l.trim(), l[length] > 0 && m.push(l), n++;
						if (!m) return
					}
					for (n = 0; n < b[length]; n++) if (l = b[n], o) {
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
					for (n = 0; n < i.table.tBodies[length]; n++) for (p = 0; p < i.table.tBodies[n].rows[length]; p++) l = i.table.tBodies[n].rows[p], l[classList].contains("no-sort") ? r[s] = l : q.push({
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
	var sharedBuildings = buildings;
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
	// var treeIMG = new Image();
	// treeIMG.src = "tree2.png";
	// var grassIMG = new Image();
	// grassIMG.src = "grass.png";
	var storage = window.localStorage;
	var innerHTML = "innerHTML";
	var classList = "classList";
	var length = "length";
	var crystalTiles = [];
	var grassTiles = [];
	var treeTiles = [];
	var scrapTiles = [];
	var tileIMGID = 0;
	var elems = {};

	function getElements(list) {
		for (var i = 0; i < list.length; i++) {
			if (list[i].children.length > 0) {
				getElements(list[i].children);
			}
			if (list[i].id) {
				elems[list[i].id] = list[i];
			}
		}
	}



	//login
	getElements(document.body.children);
	if (storage["userKey"]) {
		// success
		socket.emit(socketRequest, [
			[storage["id"], storage["userKey"]], "m"]);
	} else {
		socket.emit(socketRequest, "l"); // request initial login data
	}

	socket.on("l", function(data) {
		data = JSON.parse(data);
		for (var attr in data) {
			storage[attr] = JSON.stringify(data[attr]);
		}
		// storage["uniqueID"] = data.id;
		// storage["loginID"] = data.login;
		// storage["map"] = JSON.stringify(data.map);
		// storage["people"] = data.people;
		// storage["power"] = data.power;
		// storage["energy"] = data.energy;
		// storage["scrap"] = data.scrap;
		// storage["buildings"] = data.buildings;
		// storage["units"] = data.units;
		socket.emit(socketRequest, [
			[storage["id"], storage["userKey"]], "m"])
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
		var thStart = "<th class='sort-header'>";
		var html = "<table id='ranked'><thead><tr>" + thStart + "Rank</th>" + thStart + "Name</th>" + thStart + "Worth</th>" + thStart + "Buildings</th></tr></thead><tbody>";
		for (var i = 0; i < data[length]; i++) {
			var isPlayer = "";
			if (data[i].name === player.name && (data[i].buildings | 0) === player.b[length]) {
				isPlayer = "player";
			}
			html += "<tr class='" + isPlayer + "'><td>" + (i + 1) + "</td><td>" + data[i].name + "</td><td>" + data[i].worth + "</td><td>" + data[i].buildings + "</td></tr>";
		}
		html += "</tbody></table>";
		elems.ranks[innerHTML] = html;
		getElements(document.body.children);
		new Tablesort(elems.ranked, {
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
			storage[attr] = JSON.stringify(data[attr]);
		}
		player = data;
		player.time = Date.now();
		elems.pn[innerHTML] = player.name;
	}

	function makeImage(quantity, w, h, targetArray, fn) {
		var tempCanvas = document.createElement("canvas");
		tempCanvas.width = w;
		tempCanvas.height = h;
		var tempContext = tempCanvas.getContext("2d");
		for (var e = 0; e < quantity; e++) {
			tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
			var img = new Image();
			var grd = tempContext.createLinearGradient(0, 0, tempCanvas.width, tempCanvas.height);
			fn(tempContext, grd, e);
			img.src = tempCanvas.toDataURL();
			targetArray.push(img);
		}
	}

	function gamestart() {
		var consbar = elems.consbar;
		canvas = elems.canvas;
		context = canvas.getContext("2d");
		canvas.width = 25 * tilesize;
		canvas.height = 25 * tilesize;
		addEvent(canvas, "mousemove", moveHandler);
		addEvent(canvas, "mousedown", clickHandler);
		addEvent(canvas, "contextmenu", clickHandler);
		addEvent(elems.sidebar, "click", sideMenuClick);
		addEvent(window, "focus", focusHandler);
		addEvent(window, "blur", stopRefresh);
		var html = '<ul>';
		for (var i = 1; i < sharedBuildings[length]; i++) {
			html += '<li  class="structure" data-building="' + i + '">' + sharedBuildings[i][4] + '</li>'; // NAME
		}
		html += "</ul>";
		consbar[innerHTML] = html + consbar[innerHTML];
		getElements(document.body.children);
		var structures = document.querySelectorAll(".structure");
		for (var i = 0; i < structures[length]; i++) {
			addEvent(structures[i], "mouseover", structureHover);
			addEvent(structures[i], "click", selectStructure);
		}

		makeImage(20, 32, 32, crystalTiles, function(tempContext, gradient) {
			gradient.addColorStop(0, '#8ED6FF');
			// dark blue
			gradient.addColorStop(1, '#004CB3');
			tempContext.fillStyle = gradient;
			tempContext.lineWidth = 1;
			var points = [random(0, 2), random(28, 32), random(0, 4), random(8, 20), random(12, 20), random(0, 8), random(28, 32), random(8, 20), random(28, 32), random(26, 32), random(12, 20), random(30, 32)];
			tempContext.beginPath();
			tempContext.moveTo(points[0], points[1]);
			for (var i = 1; i < points.length / 2; i++) {
				var xi = i * 2;
				var yi = xi + 1;
				tempContext.lineTo(points[xi], points[yi]);
			}
			tempContext.fill();
			tempContext.strokeStyle = "black";
			tempContext.stroke();
			tempContext.closePath();

			tempContext.beginPath();
			tempContext.strokeStyle = '#004CB3';
			tempContext.moveTo(points[8], points[9]);
			tempContext.lineTo(points[10], points[11]);
			tempContext.lineTo(points[0], points[1]);
			// tempContext.lineTo(points[10], points[11]);
			tempContext.lineWidth = 3;
			tempContext.stroke();
			tempContext.closePath();
		});


		makeImage(20, 32, 32, treeTiles, function(tempContext, gradient, index) {
			tempContext.drawImage(crystalTiles[index], 0, 0);

			var imageData = tempContext.getImageData(0, 0, 32, 32);
			var data = imageData.data;

			// for (var i = 0; i < data.length; i += 4) {
			// 	// red
			// 	data[i] = 255 - data[i];
			// 	// green
			// 	data[i + 1] = 255 - data[i + 1];
			// 	// blue
			// 	data[i + 2] = 255 - data[i + 2];
			// }

			for (var i = 0; i < data.length; i += 4) {
				var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
				// red
				data[i] = brightness;
				// green
				data[i + 1] = brightness;
				// blue
				data[i + 2] = brightness;
			}

			// overwrite original image
			tempContext.putImageData(imageData, 0, 0);
		});

		makeImage(20, 64, 64, scrapTiles, function(tempContext, gradient) {
			gradient.addColorStop(0, '#ddd');
			// dark blue
			gradient.addColorStop(1, '#444');
			tempContext.fillStyle = gradient;
			tempContext.strokeStyle = "black";
			for (var i = 1; i < random(3, 15); i++) {
				tempContext.save();
				var width = random(4, 12);
				var height = random(4, 12);
				tempContext.translate(width / 2 + 16 + random(2, 22), height / 2 + 16 + random(2, 22));
				tempContext.rotate(random(0, 359) * (Math.PI / 180));
				tempContext.beginPath();
				tempContext.rect(0, 0, width, height);
				tempContext.fill();
				tempContext.stroke();
				tempContext.closePath();
				tempContext.restore();
			}
		});

		makeImage(50, 8, 8, grassTiles, function(tempContext, gradient) {
			var w = tempContext.canvas.width,
				h = tempContext.canvas.height,
				idata = tempContext.createImageData(w, h),
				buffer32 = new Uint32Array(idata.data.buffer),
				len = buffer32.length,
				y = 0;

			for (; y < len; y++) {
				if (Math.random() < 0.1) {
					buffer32[y] = 0xff4e946f;
				} else if (Math.random() < 0.2) {
					buffer32[y] = 0xff449a62;
				} else if (Math.random() < 0.3) {
					buffer32[y] = 0xff3a9359;
				} else if (Math.random() < 0.4) {
					buffer32[y] = 0xff2d9a4d;
				} else if (Math.random() < 0.5) {
					buffer32[y] = 0xff58967c;
				} else if (Math.random() < 0.6) {
					buffer32[y] = 0xff3ca55e;
				}
			}

			tempContext.putImageData(idata, 0, 0);
		});
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
		drawBuildings();
		// cursor color
		strokeColor = "black";
		context.fillStyle = 'rgba(0,0,0,0.5)';
		var placeable = canPlace(player.map, player.b, tempBuilding)
		if (placeable) {
			strokeColor = "green";
			context.fillStyle = 'rgba(0,255,0,0.5)';
		} else if (placeable === null) {
			strokeColor = "blue";
			context.fillStyle = 'rgba(0,0,0,0.0)';
		} else if (placeable === false) {
			strokeColor = "red";
			context.fillStyle = 'rgba(255,0,0,0.5)';
		}

		// draw cursor
		var x = mousex * tilesize;
		var y = mousey * tilesize;
		context.strokeStyle = strokeColor;
		context.lineWidth = 2;
		context.strokeRect(x, y, tilesize, tilesize);
		context.strokeStyle = "#FFF";
		context.strokeRect(x - 2, y - 2, tilesize + 4, tilesize + 4);

		// draw temp building
		context.beginPath();
		context.rect(mousex * tilesize, mousey * tilesize, tempBuilding[2] * tilesize, tempBuilding[3] * tilesize);
		context.fill();

		// update money
		elems.pc[innerHTML] = player.power;
		elems.cc[innerHTML] = player.crystal;
		elems.sc[innerHTML] = player.scrap;
		elems.hc[innerHTML] = player.human;
		elems.pm[innerHTML] = player.caps[0];
		elems.cm[innerHTML] = player.caps[1];
		elems.sm[innerHTML] = player.caps[2];
		elems.hm[innerHTML] = player.caps[3];
		elems.pp[innerHTML] = player.plus[0];
		elems.cp[innerHTML] = player.plus[1];
		elems.sp[innerHTML] = player.plus[2];
		elems.hp[innerHTML] = player.plus[3];
		window.requestAnimationFrame(gameLoop);
	}

	function random(from, to) {
		return Math.floor(Math.random() * (to - from + 1)) + from;
	}

	function shuffle(a, b, c, d) { //array,placeholder,placeholder,placeholder
		c = a.length;
		while (c) b = Math.random() * c-- | 0, d = a[c], a[c] = a[b], a[b] = d
	}
	var map = JSON.parse(storage["map"]);
	var grassmap = [];
	for (var i = 0; i < 50; i++) {
		for (var e = 0; e < 50; e++) {
			grassmap.push([i, e]);
		}
	}
	shuffle(grassmap);

	function drawMap() {
		tileIMGID = 0;
		// context.drawImage(grassTiles[tileIMGID], 0, 0, 32, 32);
		var x, y, i, e;
		for (x = 0; x < 50 * 50; x++) {
			// for (y = 0; y < 50; y++) {
			tileIMGID = tileIMGID % 50;
			// context.drawImage(grassTiles[tileIMGID], x * tilesize, y * tilesize);
			context.drawImage(grassTiles[tileIMGID], grassmap[x][0] * 16, grassmap[x][1] * 16, 16, 16);
			tileIMGID++;
			// }
		}
		tileIMGID = 0;
		for (x = 0; x < 25; x++) {
			for (y = 0; y < 25; y++) {
				tileIMGID = tileIMGID % 20;
				if (map[x][y] === 1) {
					// context.drawImage(treeIMG, x * tilesize, y * tilesize, tilesize, tilesize);
					context.drawImage(treeTiles[tileIMGID], x * tilesize, y * tilesize);
				}
				if (map[x][y] === 2) {
					context.drawImage(crystalTiles[tileIMGID], x * tilesize, y * tilesize);
				}
				if (map[x][y] === 4) {
					context.drawImage(scrapTiles[tileIMGID], x * tilesize - 16, y * tilesize - 16);
				}
				tileIMGID++;
			}
		}

	}

	function drawBuildings() {
		var contextMap = ["strokeStyle", "lineWidth", "beginPath", "fillStyle"];
		for (var i = 0; i < player.b[length]; i++) {
			var building = player.b[i];
			if ((building.id | 0) === 1) {
				var nearbyBuildings = findNearBuildings(player.b, building);
				var buildingCenterX = (building.x + (building.w / 2)) * tilesize;
				var buildingCenterY = (building.y + (building.h / 2)) * tilesize;
				for (var e = 0; e < nearbyBuildings[length]; e++) {
					var nearBuildingCenterX = (nearbyBuildings[e].x + (nearbyBuildings[e].w / 2)) * tilesize;
					var nearBuildingCenterY = (nearbyBuildings[e].y + (nearbyBuildings[e].h / 2)) * tilesize;
					context[contextMap[2]]();
					context[contextMap[0]] = "black";
					context.lineCap = 'square';
					context[contextMap[1]] = 5;
					context.moveTo(buildingCenterX, buildingCenterY);
					context.lineTo(nearBuildingCenterX, nearBuildingCenterY);
					context.stroke();
					context.closePath();
				}
			}
		}
		for (var i = 0; i < player.b[length]; i++) {
			var building = player.b[i];
			if ((building.id | 0) !== 1) {
				context[contextMap[2]]();
				context.strokeWidth = 4;
				context[contextMap[1]] = 4;
				context[contextMap[3]] = sharedBuildings[building.id][7]; // COLOR
				if (building.power) {
					context[contextMap[0]] = "black";
				} else {
					context[contextMap[0]] = "red";
				}
				context.rect(building.x * tilesize, building.y * tilesize, building.w * tilesize, building.h * tilesize);
				context.fill();
				context.stroke();
				context.textAlign = 'center';
				context.textBaseline = 'middle';
				context.font = 'bold ' + sharedBuildings[building.id][8] + 'pt Calibri';
				context[contextMap[3]] = 'black';
				context.fillText(sharedBuildings[building.id][4], building.x * tilesize + building.h / 2 * tilesize, building.y * tilesize + building.h / 2 * tilesize);
				context[contextMap[1]] = 1;
				// stroke color
				context[contextMap[0]] = 'white';
				context.strokeText(sharedBuildings[building.id][4], building.x * tilesize + building.h / 2 * tilesize, building.y * tilesize + building.h / 2 * tilesize);
				// context.webkitImageSmoothingEnabled = false;
				// context.mozImageSmoothingEnabled = false;
				context.imageSmoothingEnabled = false; /// future
				if (!building.power && frame > 29) {
					context.drawImage(powerIMG, (building.x + (building.w / 2)) * tilesize - 8, (building.y + (building.h / 2)) * tilesize - 8, 16, 16);
				}
			}
		}
	}

	function addEvent(target, handler, callback) {
		target.removeEventListener(handler, callback);
		target.addEventListener(handler, callback, true);
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
		if (mousex < 0) {
			mousex = 0;
		}
		if (mousey < 0) {
			mousey = 0;
		}
		if (mousex > 25) {
			mousex = 25;
		}
		if (mousey > 25) {
			mousey = 25;
		}
		tempBuilding[0] = mousex;
		tempBuilding[1] = mousey;
		if (continueReloading === false) {
			continueReloading = true;
			refresh();
		}
	}

	function clickHandler(event) {
		event.preventDefault();
		if (event.button === 1 && tempBuilding.length <= 2) {
			for (var i = 0; i < player.b.length; i++) {
				var building = player.b[i];
				if (isOverlapping(mousex, mousey, 1, 1, building.x, building.y, building.w, building.h)) {
					socket.emit(socketRequest, [
						[storage["id"], storage["userKey"]], "s", [building.x, building.y]
					]);
				}
			}
			return true;
		}
		if (event.button === 2 || (event.button === 1 && tempBuilding.length > 2)) {
			tempBuilding[length] = 0;
			return false;
		}
		if (tempBuilding[length] > 2) {
			socket.emit(socketRequest, [
				[storage["id"], storage["userKey"]], "p", tempBuilding]);
			tempBuilding[length] = 0;
			return false;
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
		// 		if (onScreen[length]) {
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
		event.preventDefault();
		if (event.target.id === "cons") {
			elems.score[classList].remove("active");
			elems.ranks[classList].remove("visible");
			event.target[classList].toggle("active");
			elems.consbar[classList].toggle("visible");
		}
		if (event.target.id === "score") {
			elems.cons[classList].remove("active");
			elems.consbar[classList].remove("visible");
			event.target[classList].toggle("active");
			elems.ranks[classList].toggle("visible");
			if (elems.ranks[classList].contains("visible")) {
				socket.emit(socketRequest, [
					[storage["id"], storage["userKey"]], "$"]);
				elems.ranks[innerHTML] = "Loading...";
			}
		}
	}

	function structureHover(event) {
		event.preventDefault();
		if (event.target.dataset.building /* && lastTarget !== event.target.dataset.building*/ ) {
			lastTarget = event.target.dataset.building;
			var buildingID = event.target.dataset.building;
			wallet = getWallet(player);
			var purchaseable = canBuy(wallet, sharedBuildings[buildingID][0]); // COST
			elems.desc[innerHTML] = sharedBuildings[buildingID][5]; // DESC
			var expensive = false;
			event.target[classList].remove("disabled");
			for (var i = 0; i < costNames[length]; i++) {
				var costElement = elems[costNames[i] + "-cost"];
				var capElement = elems[costNames[i] + "-cap"];
				var plusElement = elems[costNames[i] + "-plus"];
				costElement[innerHTML] = sharedBuildings[buildingID][0][i]; // COST
				capElement[innerHTML] = sharedBuildings[buildingID][1][i]; // CAP
				plusElement[innerHTML] = sharedBuildings[buildingID][2][i]; // PLUS
				costElement[classList].remove("nobuy");
				if (sharedBuildings[buildingID][0][i] > wallet[i]) { // COST
					expensive = true;
					costElement[classList].add("nobuy");
				}
			}
			if (expensive) {
				event.target[classList].add("disabled");
			}
		}
	}

	function selectStructure(event) {
		event.preventDefault();
		if (event.target.dataset.building) {
			if (event.target[classList].contains("disabled") === false) {
				var buildingID = (event.target.dataset.building | 0);
				if (canBuy(wallet, sharedBuildings[buildingID][0])) { // COST
					tempBuilding = [mousex, mousey, sharedBuildings[buildingID][3][0], sharedBuildings[buildingID][3][1], sharedBuildings[buildingID][6], buildingID]; // SIZE
					elems.cons[classList].remove("active");
					elems.consbar[classList].remove("visible");
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
		if (continueReloading && storage["userKey"]) {
			socket.emit(socketRequest, [
				[storage["id"], storage["userKey"]], "u"]);
		}
	}
}(window, document));