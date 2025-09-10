import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from 'react';
import { StyleSheet, View } from 'react-native';
import Message from './Message'; // Đảm bảo đường dẫn này đúng
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { vs } from 'react-native-size-matters';

export type ToastAction = {
  show: (msg: string, type: string, positionDown?: boolean) => void; // Đổi any thành void cho kiểu trả về
};

const ToastContainer = forwardRef<ToastAction>(({}, ref) => {
  const { bottom, top } = useSafeAreaInsets();
  const [messages, setMessages] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [isDown, setIsDown] = useState<boolean>(false); // Thêm state để kiểm soát hướng thông báo

  // useRef để lưu trữ ID của setTimeout, không gây re-render khi thay đổi
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Hàm show thông báo
  const show = useCallback((msg: string, types: string, positionDown?: boolean) => {
    // 1. Xóa bỏ bất kỳ bộ đếm thời gian hiện có nào
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 2. Cập nhật nội dung và kiểu thông báo
    setMessages(msg);
    setType(types);
    setOpen(true); // Đảm bảo thông báo hiển thị
    if (positionDown) {
      setIsDown(positionDown); // Cập nhật hướng thông báo nếu cần
    } else {
      setIsDown(false); // Đặt lại hướng thông báo nếu không có positionDown
    }

    // 3. Thiết lập bộ đếm thời gian mới
    timerRef.current = setTimeout(() => {
      setOpen(false);
      setMessages(''); // Xóa nội dung khi ẩn
      timerRef.current = null; // Đặt lại ref
    }, 3000);
  }, []); // Không có dependencies vì các hàm setMessages, setType, setOpen là stable

  // Gán hàm show vào ref để component cha có thể gọi
  useImperativeHandle(ref, () => ({
    show,
  }));

  // Hàm ẩn thông báo thủ công (nếu có nút đóng)
  const onHide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current); // Hủy bộ đếm thời gian nếu ẩn thủ công
      timerRef.current = null;
    }
    setOpen(false);
    setMessages(''); // Xóa nội dung khi ẩn
  }, []);

  // useEffect để dọn dẹp bộ đếm thời gian khi component bị unmount
  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  ); // Chỉ chạy một lần khi mount và dọn dẹp khi unmount

  return (
    <>
      {open && (
        <View
          style={[styles.container, isDown ? { bottom: bottom + vs(50) } : { top: top + vs(10) }]}>
          <Message message={messages} type={type} onHide={onHide} />
        </View>
      )}
    </>
  );
});

export default ToastContainer;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
