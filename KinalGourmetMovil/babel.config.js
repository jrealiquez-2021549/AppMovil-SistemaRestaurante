module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // react-native-reanimated debe ir siempre al final
      'react-native-reanimated/plugin',
    ],
  };
};
