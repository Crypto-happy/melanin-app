module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
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
          api: './src/api',
          assets: './src/assets',
          components: './src/components',
          constants: './src/constants',
          features: './src/features',
          localization: './src/localization',
          navigators: './src/navigators',
          reducers: './src/reducers',
          sagas: './src/sagas',
          schemas: './src/schemas',
          selectors: './src/selectors',
          store: './src/store',
          'ts-types': './src/ts-types',
          types: './src/types',
          utils: './src/utils',
        },
      },
    ],
  ],
}
