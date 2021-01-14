return main();

async function main() {
	const colors = {
		Reset: "\x1b[0m",
		Bright: "\x1b[1m",
		Underscore: "\x1b[4m",

		FgRed: "\x1b[31m",
		FgGreen: "\x1b[32m",
		FgWhite: "\x1b[37m",

		BgRed: "\x1b[41m",
		BgGreen: "\x1b[42m",
	};
	console.log(
		colors.FgGreen,
		colors.Bright,
		"Welcome to Yahalom Testim!",
		colors.Reset
	);
	const vendor = detectExecutingVendor();
	if (vendor === "npm") {
		const version = await versionCheck(vendor);
		if (version.split(".")[0] < 7) {
			console.error(
				colors.Bright,
				colors.Underscore,
				colors.BgRed,
				"error",
				colors.Reset,
				"This package uses the npm workspaces feature, which is available starting npm v-7.\nthe installation might not work correctly.\nEither update your npm version, or use yarn."
			);
			// process.exit(1);
		}
	}
	console.log(colors.BgGreen, "We're all set, let continue!", colors.Reset);
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
