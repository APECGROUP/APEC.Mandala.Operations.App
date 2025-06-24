# Hệ thống Authentication - Smart Purchase

## Tổng quan

Hệ thống authentication đã được cập nhật để lưu trữ thông tin một cách an toàn và hiệu quả hơn:

- **Tài khoản + Mật khẩu**: Lưu trong Keychain (bảo mật cao)
- **Token**: Lưu trong MMKV (truy xuất nhanh)
- **User Info**: Lưu trong MMKV (không cần bảo mật cao)

## Cấu trúc dữ liệu

### 1. Credentials (Keychain)
```typescript
type CredentialsType = {
  username: string;
  password: string;
  hotel: {
    id: number | string | undefined;
    name: number | string | undefined;
  };
};
```

### 2. Token (MMKV)
```typescript
type TokenType = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  refreshExpiresAt: number;
};
```

## Các chức năng chính

### DataLocal.tsx

#### Lưu thông tin đăng nhập
```typescript
// Lưu credentials vào Keychain (bao gồm username, password, hotel)
await DataLocal.saveCredentials(username, password, hotel);

// Lưu token vào MMKV
await DataLocal.saveToken(accessToken, refreshToken, expiresIn, refreshExpiresIn);

// Lưu user info vào MMKV
await DataLocal.saveUser(user);
```

#### Lấy thông tin đăng nhập
```typescript
// Lấy credentials từ Keychain
const credentials = await DataLocal.getCredentials();

// Lấy token từ MMKV
const token = await DataLocal.getToken();

// Lấy user info từ MMKV
const user = await DataLocal.getUser();
```

#### Xóa thông tin
```typescript
// Xóa toàn bộ thông tin
await DataLocal.removeAll();
```

### Hook useAutoLogin

Hook này tự động load credentials và cung cấp các chức năng quản lý:

```typescript
const { credentials, loading, loadCredentials, clearCredentials } = useAutoLogin();
```

## Luồng hoạt động

### 1. Đăng nhập
1. User nhập username/password/hotel
2. Gọi API đăng nhập
3. **Luôn lưu thông tin đăng nhập vào Keychain**
4. Lưu token vào MMKV
5. Lưu user info vào MMKV
6. **Chỉ hiện thông báo "Đã lưu thông tin đăng nhập" khi user tích "Nhớ đăng nhập"**

### 2. Mở app lần sau
1. Kiểm tra trạng thái "Nhớ đăng nhập"
2. Nếu có → load credentials từ Keychain và tự động điền form
3. Load token từ MMKV
4. Kiểm tra token có hết hạn không
5. Nếu hết hạn → gọi API refresh token

### 3. Đổi mật khẩu
1. User nhập mật khẩu hiện tại và mật khẩu mới
2. Kiểm tra mật khẩu hiện tại có đúng không
3. **Cập nhật mật khẩu mới vào Keychain**
4. Hiện thông báo thành công

### 4. Refresh Token
1. Khi token hết hạn, tự động gọi API refresh
2. Lưu token mới vào MMKV
3. Tiếp tục request ban đầu

## Bảo mật

### Keychain
- Tài khoản và mật khẩu được mã hóa và lưu trong Keychain
- Chỉ có thể truy cập bởi app này
- Tự động xóa khi gỡ cài đặt app

### MMKV
- Token được lưu trong MMKV với mã hóa
- Truy xuất nhanh hơn AsyncStorage
- Tự động xóa khi logout

## Sử dụng trong components

### LoginScreen
```typescript
import { useAutoLogin } from '@/hook/useAutoLogin';

const LoginScreen = () => {
  const { credentials, loading: loadingCredentials } = useAutoLogin();
  
  // Tự động điền form nếu có credentials
  useEffect(() => {
    if (credentials && !loadingCredentials) {
      setUserName(credentials.username);
      setPassword(credentials.password);
      setIsRememberLogin(true);
    }
  }, [credentials, loadingCredentials]);
  
  // Lưu credentials khi đăng nhập thành công
  const onSubmit = async () => {
    // ... logic đăng nhập
    await DataLocal.saveLoginCredentials(userName, password);
  };
};
```

### SavedCredentialsInfo Component
Component hiển thị thông tin credentials đã lưu và cho phép xóa:

```typescript
<SavedCredentialsInfo onClearCredentials={() => {
  // Callback khi xóa credentials
}} />
```

## Cấu hình

### Cài đặt dependencies
```bash
yarn add react-native-keychain
yarn add react-native-mmkv
```

### Cấu hình Keychain (iOS)
Thêm vào `ios/YourApp/Info.plist`:
```xml
<key>NSFaceIDUsageDescription</key>
<string>This app uses Face ID to securely store your login credentials</string>
```

### Cấu hình Keychain (Android)
Thêm vào `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
```

## Troubleshooting

### Lỗi Keychain
- Kiểm tra quyền truy cập Keychain
- Đảm bảo bundle ID đúng
- Test trên thiết bị thật (không phải simulator)

### Lỗi MMKV
- Kiểm tra cấu hình MMKV
- Đảm bảo storage được khởi tạo đúng cách

### Lỗi Refresh Token
- Kiểm tra API endpoint refresh token
- Đảm bảo refresh token chưa hết hạn
- Log để debug quá trình refresh 