return main();

async function main() {
	console.log("Welcome to Yahalom Testim!");
	const vendor = detectExecutingVendor();
	if (vendor === "npm") {
		console.log("");
		const version = await versionCheck(vendor);
		if (version.split(".")[0] < 7) {
			console.warn(
				`This package uses the npm workspaces feature, which is available starting npm v-7.\nthe installation might not work correctly.\nEither update your npm version, or use yarn.`
			);
		}
	} else {
		console.log("We're all set, let continue!");
	}
}
function detectExecutingVendor() {
	const { basename } = require("path");
	const base = basename(process.env.npm_execpath);
	return /yarn/.test(base) ? "yarn" : "npm";
}
async function versionCheck(vendor) {
	const { exec } = require("child_process");
	let vendorVersion = "";
	const child = exec(`${vendor} -v`, (_, out) => (vendorVersion = out));
	const exitCode = await new Promise((resolve, _) => {
		child.on("exit", resolve);
	});

	if (exitCode) {
		throw new Error(`exited with code: ${exitCode}`);
	}
	return vendorVersion;
}
