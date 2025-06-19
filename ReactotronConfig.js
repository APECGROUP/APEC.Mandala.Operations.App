import Reactotron from 'reactotron-react-native';

const reactotron = Reactotron.configure({
  name: 'Smart Purchase',
  enabled: __DEV__, // Chỉ bật Reactotron trong môi trường dev
})
  .useReactNative({
    networking: {
      ignoreUrls: /symbolicate|localhost:\d+\/logs|logging|__.*__/,
      // Bạn có thể thêm các API endpoint không quan trọng của mình vào đây.
    },
    asyncStorage: {
      // Cần import AsyncStorage từ '@react-native-async-storage/async-storage'
      // ignore: ['some-key-you-dont-care-about'],
    },
    state: {
      // track: true,
      // ignore: ['reduxPersist'],
    },
    // ... các plugins khác nếu cần
  })
  .connect();

// console.tron = reactotron;
export default reactotron;
