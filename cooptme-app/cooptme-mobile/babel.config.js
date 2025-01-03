module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'react-native-reanimated/plugin',
            ["module:react-native-dotenv", {
                "envName": "APP_ENV",
                "moduleName": "@env",
                "path": ".env",
                "safe": false,
                "allowUndefined": true,
                "verbose": false
            }],
            [
                'module-resolver',
                {
                    root: ['./src'],
                    extensions: [
                        '.ios.ts',
                        '.android.ts',
                        '.ts',
                        '.ios.tsx',
                        '.android.tsx',
                        '.tsx',
                        '.jsx',
                        '.js',
                        '.json',
                    ],
                    alias: {
                        '@screens': './src/screens',
                        '@services': './src/services'
                    },
                },
            ],
        ],
    };
};