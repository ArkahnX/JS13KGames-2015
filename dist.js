var fs = require("fs");
var exists = fs.existsSync("D:/GitHub/JS13KGames-2015/dist/archive.zip");
if (exists) {
	// fs.truncateSync(rootDir + endFile+".temp");
	fs.unlinkSync("D:/GitHub/JS13KGames-2015/dist/archive.zip");
}
// var AdmZip = require('adm-zip');
// var zip = new AdmZip();
// zip.addLocalFile("D:/GitHub/JS13KGames-2015/build/game.json","game.json");
// zip.addLocalFile("D:/GitHub/JS13KGames-2015/build/preview.svg","preview.svg");
// zip.addLocalFile("D:/GitHub/JS13KGames-2015/build/game/server.js","game/server.js");
// zip.addLocalFile("D:/GitHub/JS13KGames-2015/build/game/shared.js","game/shared.js");
// zip.addLocalFile("D:/GitHub/JS13KGames-2015/build/game/client.js","game/client.js");
// zip.addLocalFile("D:/GitHub/JS13KGames-2015/build/game/index.html","game/index.html");
// zip.addLocalFile("D:/GitHub/JS13KGames-2015/build/game/package.json","game/package.json");
// zip.addLocalFile("D:/GitHub/JS13KGames-2015/build/game/power.gif","game/power.gif");
// zip.addLocalFile("D:/GitHub/JS13KGames-2015/build/game/g.css","game/g.css");
// zip.writeZip("D:/GitHub/JS13KGames-2015/dist/archive.zip","game.json");

var archiver = require('archiver');
var output = fs.createWriteStream("D:/GitHub/JS13KGames-2015/dist/archive.zip");
output.on('close', function() {
	console.log(archive.pointer() + ' total bytes');
	console.log('archiver has been finalized and the output file descriptor has closed.');
});
var archive = archiver('zip'); // or archiver('zip', {});
archive.on('error', function(err) {
	throw err;
});
archive.pipe(output);

archive.append(fs.createReadStream("D:/GitHub/JS13KGames-2015/build/game.json"), {
	name: "game.json"
});
archive.append(fs.createReadStream("D:/GitHub/JS13KGames-2015/build/preview.svg"), {
	name: "preview.svg"
});
archive.append(fs.createReadStream("D:/GitHub/JS13KGames-2015/build/game/server.js"), {
	name: "game/server.js"
});
archive.append(fs.createReadStream("D:/GitHub/JS13KGames-2015/build/game/client.js"), {
	name: "game/client.js"
});
archive.append(fs.createReadStream("D:/GitHub/JS13KGames-2015/build/game/shared.js"), {
	name: "game/shared.js"
});
archive.append(fs.createReadStream("D:/GitHub/JS13KGames-2015/build/game/index.html"), {
	name: "game/index.html"
});
archive.append(fs.createReadStream("D:/GitHub/JS13KGames-2015/build/game/package.json"), {
	name: "game/package.json"
});
archive.append(fs.createReadStream("D:/GitHub/JS13KGames-2015/build/game/power.gif"), {
	name: "game/power.gif"
});
archive.append(fs.createReadStream("D:/GitHub/JS13KGames-2015/build/game/tree.gif"), {
	name: "game/tree.gif"
});
archive.append(fs.createReadStream("D:/GitHub/JS13KGames-2015/build/game/g.css"), {
	name: "game/g.css"
});
archive.finalize();