module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:@tanstack/eslint-plugin-query/recommended', 'prettier'],
  plugins: ['unused-imports'],
  rules: {
    // Tắt yêu cầu dấu chấm phẩy cuối dòng
    semi: 'off',

    // Tắt yêu cầu dấu phẩy cuối cùng trong object/array
    'comma-dangle': 'off',

    // Tắt cảnh báo về biến bị che khuất (shadow)
    'no-shadow': 'off',

    // Tắt cảnh báo về biến không được định nghĩa
    'no-undef': 'off',

    // Cảnh báo về import cycle (import vòng tròn)
    'import/no-cycle': 'warn',

    // Báo lỗi nếu import không ở đầu file
    'import/first': 'error',

    // Báo lỗi nếu có import trùng lặp
    'import/no-duplicates': 'error',

    // Báo lỗi nếu có import không được sử dụng
    'unused-imports/no-unused-imports': 'error',

    // Yêu cầu arrow function phải có body ngắn gọn khi có thể
    'arrow-body-style': ['error', 'as-needed'],

    // Báo lỗi về biến bị che khuất trong TypeScript
    '@typescript-eslint/no-shadow': ['error'],

    // Cảnh báo về interface rỗng trong TypeScript
    '@typescript-eslint/no-empty-interface': 'warn',

    // Báo lỗi nếu có style không được sử dụng trong React Native
    'react-native/no-unused-styles': 'error',

    // Cảnh báo về inline styles trong React Native
    'react-native/no-inline-styles': 'warn',

    'react/react-in-jsx-scope': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-unused-vars': ['warn'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
