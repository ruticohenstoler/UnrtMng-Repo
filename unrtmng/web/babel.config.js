module.exports = function (api) {
	api.cache.forever();

	return {
		babelrcRoots: ["*"],
		presets: [
			"@nx/js/babel",
			"@nx/react/babel"
		],
		plugins: [
			["styled-components", {
				pure: true,
				ssr: true
			}]
		]
	};
};