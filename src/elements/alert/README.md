# AlertProvider - Hướng dẫn sử dụng

## 🚀 Tính năng

AlertProvider cung cấp các tính năng với hiệu năng tối ưu:
- **Alert Dialog**: Hiển thị dialog với title, content, buttons
- **Toast Message**: Hiển thị thông báo ngắn
- **Loading Indicator**: Hiển thị/ẩn loading spinner với animation mượt mà

## ⚡ Tối ưu hiệu năng

- **React.memo**: Tất cả components được memoized để tránh re-render không cần thiết
- **useCallback**: Tất cả functions được memoized
- **useMemo**: Context value được memoized để tránh re-render children
- **Reanimated 3**: Animation chạy trên UI thread, không block JS thread
- **Conditional rendering**: Loading component chỉ render khi cần thiết
- **Optimized animations**: Sử dụng spring và timing animations tối ưu

## 📱 Responsive Design

Sử dụng `react-native-size-matters` để đảm bảo UI responsive trên mọi thiết bị:
- `s()`: Scale theo width
- `vs()`: Scale theo height  
- `ms()`: Scale theo font size

## Cách sử dụng

### 1. Setup Provider

```tsx
import { AlertProvider } from '@/elements/alert/AlertProvider';

const App = () => {
  return (
    <AlertProvider>
      {/* Your app content */}
    </App>
  );
};
```

### 2. Sử dụng trong component

```tsx
import { useAlert } from '@/elements/alert/AlertProvider';

const MyComponent = () => {
  const { showAlert, showToast, showLoading, hideLoading } = useAlert();

  const handleShowAlert = useCallback(() => {
    showAlert(
      'Thông báo',
      'Đây là nội dung thông báo',
      [
        {
          text: 'Hủy',
          onPress: () => console.log('Hủy'),
          style: 'cancel'
        },
        {
          text: 'Đồng ý',
          onPress: () => console.log('Đồng ý')
        }
      ]
    );
  }, [showAlert]);

  const handleShowToast = useCallback(() => {
    showToast('Thông báo thành công!', 'success');
  }, [showToast]);

  const handleShowLoading = useCallback(() => {
    showLoading('Đang tải dữ liệu...');
    
    // Simulate API call
    setTimeout(() => {
      hideLoading();
    }, 3000);
  }, [showLoading, hideLoading]);

  return (
    <View>
      <Button onPress={handleShowAlert} title="Show Alert" />
      <Button onPress={handleShowToast} title="Show Toast" />
      <Button onPress={handleShowLoading} title="Show Loading" />
    </View>
  );
};
```

## API Reference

### showAlert(title, content, buttons, icon?, animated?)
Hiển thị alert dialog

- `title`: Tiêu đề alert
- `content`: Nội dung alert (hỗ trợ markdown **bold**)
- `buttons`: Mảng các button
- `icon`: Icon tùy chọn
- `animated`: Animation tùy chọn

### showToast(message, type)
Hiển thị toast message

- `message`: Nội dung thông báo
- `type`: Loại toast ('success', 'error', 'warning', 'info')

### showLoading(message?)
Hiển thị loading indicator với animation mượt mà

- `message`: Thông báo tùy chọn (mặc định: "Đang tải...")

### hideLoading()
Ẩn loading indicator với animation fade out

## 🎨 Animation Features

### Loading Animation
- **Fade in/out**: Overlay và container
- **Scale animation**: Container scale từ 0.8 đến 1.0
- **Slide animation**: Container slide từ bottom
- **Rotation**: Spinner có rotation animation
- **Message animation**: Text slide và fade in/out

### Performance Optimizations
- **UI Thread**: Tất cả animations chạy trên UI thread
- **Spring physics**: Sử dụng spring animation cho natural feel
- **Timing control**: Precise timing với `ms()` function
- **Memory efficient**: Shared values được cleanup tự động

## Ví dụ thực tế

### Loading khi gọi API

```tsx
const handleLogin = useCallback(async () => {
  showLoading('Đang đăng nhập...');
  
  try {
    const result = await loginAPI(username, password);
    hideLoading();
    showToast('Đăng nhập thành công!', 'success');
  } catch (error) {
    hideLoading();
    showAlert(
      'Lỗi',
      'Đăng nhập thất bại. Vui lòng thử lại.',
      [
        {
          text: 'Đóng',
          onPress: () => console.log('Đóng')
        }
      ]
    );
  }
}, [showLoading, hideLoading, showToast, showAlert]);
```

### Loading với multiple steps

```tsx
const handleComplexOperation = useCallback(() => {
  showLoading('Đang khởi tạo...');
  
  setTimeout(() => {
    showLoading('Đang tải dữ liệu...');
  }, 1000);
  
  setTimeout(() => {
    showLoading('Đang xử lý...');
  }, 2000);
  
  setTimeout(() => {
    hideLoading();
    showToast('Hoàn thành!', 'success');
  }, 3000);
}, [showLoading, hideLoading, showToast]);
```

### Loading với timeout

```tsx
const handleLoadData = useCallback(async () => {
  showLoading('Đang tải dữ liệu...');
  
  // Set timeout để tránh loading vô hạn
  const timeout = setTimeout(() => {
    hideLoading();
    showToast('Tải dữ liệu quá lâu, vui lòng thử lại', 'warning');
  }, 10000);
  
  try {
    const data = await fetchData();
    clearTimeout(timeout);
    hideLoading();
    // Xử lý data
  } catch (error) {
    clearTimeout(timeout);
    hideLoading();
    showToast('Có lỗi xảy ra', 'error');
  }
}, [showLoading, hideLoading, showToast]);
```

## 🔧 Technical Details

### Performance Optimizations
- **React.memo**: Prevents unnecessary re-renders
- **useCallback**: Memoizes functions
- **useMemo**: Memoizes context value
- **Conditional rendering**: Only renders when needed
- **Reanimated 3**: UI thread animations

### Memory Management
- **Shared values cleanup**: Automatic cleanup on unmount
- **Animation callbacks**: Proper cleanup with runOnJS
- **State management**: Efficient state updates

### Responsive Design
- **react-native-size-matters**: Consistent scaling across devices
- **Flexible layouts**: Adapts to different screen sizes
- **Touch targets**: Proper sizing for touch interactions 