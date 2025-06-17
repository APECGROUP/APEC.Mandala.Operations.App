// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
// const {withNativeWind} = require('nativewind/metro');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('@react-native/metro-config').MetroConfig}
//  */
// const {
//   wrapWithReanimatedMetroConfig,
// } = require('react-native-reanimated/metro-config');

// const config = mergeConfig(getDefaultConfig(__dirname), {
//   /* your config */
// });
// module.exports = wrapWithReanimatedMetroConfig(config);

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);

// module.exports = withNativeWind(config, {input: './global.css'});
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {withNativeWind} = require('nativewind/metro');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

// Lấy config mặc định
const baseConfig = getDefaultConfig(__dirname);

// Merge thêm config riêng (nếu có)
const customConfig = {
  // Bạn có thể thêm các config tùy chỉnh ở đây nếu cần
};

const mergedConfig = mergeConfig(baseConfig, customConfig);

// Kết hợp NativeWind
const nativeWindConfig = withNativeWind(mergedConfig, {input: './global.css'});

// Kết hợp Reanimated (bọc ngoài cùng)
const finalConfig = wrapWithReanimatedMetroConfig(nativeWindConfig);

module.exports = finalConfig;
