// Karma configuration

module.exports = config => {
	config.set({
		files: [
			"es5/test.js"
		],

		frameworks: ["mocha"],
		reporters: ["mocha"],
		browsers: ["Chrome"],

		port: 9876,
		colors: true,

		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		autoWatch: true,
		singleRun: true,
		concurrency: Infinity
	});
};