const concurrently = require("concurrently");

const fullstack = "fullstack";
const client = "client";
const server = "server";
const commands = {
	back: {
		command: "cd server && npm start",
		name: server,
		prefixColor: "cyan.bold",
	},
	front: {
		command: "cd client && npm start",
		name: client,
		prefixColor: "yellow.bold",
	},
};
const allowedAliases = {
	all: fullstack,
	e2e: fullstack,
	fullstack: fullstack,
	client: client,
	react: client,
	front: client,
	server: server,
	back: server,
};
const requestedProject = allowedAliases[process.argv[2]] || fullstack;

if (requestedProject === fullstack) {
	console.log("Starting Yahalom-tests E2E");
	return concurrently([commands.back, commands.front]);
}
if (requestedProject === client) {
	console.log("Starting Yahalom-tests Client");
	return concurrently([commands.front]);
}
if (requestedProject === server) {
	console.log("Starting Yahalom-tests Server");
	return concurrently([commands.back]);
}
