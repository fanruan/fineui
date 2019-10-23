module.exports = function (api) {
    api.cache(true);
    const presets = [
        [
            "@babel/preset-env",
            {
                targets: {
                    ie: 9,
                    chrome: 47,
                },
            },
        ],
        "@babel/preset-typescript",
    ];
    const plugins = [
        [
            "@babel/plugin-proposal-decorators",
            {
                legacy: true,
            },
        ],
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-block-scoping",
        ["@babel/plugin-transform-classes", {
            loose: true,
        }],
        "@babel/plugin-transform-proto-to-assign",
    ];

    return {
        presets,
        plugins,
    };
};
