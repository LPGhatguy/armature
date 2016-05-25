"use strict";

const pack = require("./package.json");

// Load TypeScript from our dependencies
try {
	var typescript = require("typescript");
} catch(e) {
	console.error("Couldn't load some dependencies; try running 'npm install'");
	process.exit(1);
}

// Compiler options on the server
// typescript goes to gulp-typescript
const server = {
	typescript: {
		module: "commonjs",
		target: "ES5",
		moduleResolution: "node",
		typescript: typescript,
		noEmitOnError: true,
		experimentalDecorators: true,
		noLib: true
	},
	browserify: {
		standalone: "armature",
		bare: true
	}
};

const tests = {
	tyepscript: Object.assign({}, server.typescript, {
		allowJs: true
	})
}

const config = {
	browsersync: false,

	// Default preset
	preset: "default",

	// Collection of presets
	presets: {
		default: {
			watch: true,
			sourcemaps: true,
			minify: false,
			out: "es5"
		}
	},

	// List of pipelines to build and use
	pipelines: [
		{
			id: "lib",
			name: "Library (CommonJS)",
			config: server,
			type: "server",

			input: "src/**/*.ts",
			output: "",

			extraEntries: ["node_modules/typescript/lib/lib.es6.d.ts"],

			typingsOutput: "",
			typingsOutputType: "module",
			moduleName: pack.name,
			moduleEntryPoint: "index.ts"
		},
		{
			id: "bundle",
			name: "Browser (Browserify)",
			config: server,
			type: "browser",

			input: "src/index.ts",
			output: "bundle.js",

			extraEntries: ["node_modules/typescript/lib/lib.es6.d.ts"]
		},
		{
			id: "tests",
			name: "Tests (Bundle)",
			config: tests,
			type: "browser",

			input: "tests/main.js",
			output: "test.js",

			extraEntries: ["node_modules/typescript/lib/lib.es6.d.ts", "typings/index.d.ts"]
		},
	]
};

module.exports = config;