const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// Lấy config mặc định
const baseConfig = getDefaultConfig(__dirname);

// Merge thêm config riêng (nếu có)
const customConfig = {
  // Bạn có thể thêm các config tùy chỉnh ở đây nếu cần
};

const mergedConfig = mergeConfig(baseConfig, customConfig);

module.exports = mergedConfig;
