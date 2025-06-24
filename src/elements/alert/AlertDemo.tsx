import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { useAlert } from './AlertProvider';
import { AppText } from '../text/AppText';
import { Colors } from '@/theme/Config';

const AlertDemo: React.FC = React.memo(() => {
  const { showAlert, showToast, showLoading, hideLoading } = useAlert();

  const handleShowAlert = useCallback(() => {
    showAlert(
      'Thông báo quan trọng',
      'Đây là một **thông báo quan trọng** với nội dung có thể được format bằng markdown.',
      [
        {
          text: 'Hủy',
          onPress: () => console.log('Đã hủy'),
          style: 'cancel',
        },
        {
          text: 'Đồng ý',
          onPress: () => {
            console.log('Đã đồng ý');
            showToast('Bạn đã đồng ý!', 'success');
          },
        },
      ],
    );
  }, [showAlert, showToast]);

  const handleShowToast = useCallback(() => {
    showToast('Đây là một thông báo toast!', 'success');
  }, [showToast]);

  const handleShowErrorToast = useCallback(() => {
    showToast('Có lỗi xảy ra!', 'error');
  }, [showToast]);

  // Demo loading sử dụng ShowLoading component
  const handleShowLoading = useCallback(() => {
    showLoading();
    setTimeout(() => {
      hideLoading();
      showToast('Tải dữ liệu thành công!', 'success');
    }, 3000);
  }, [hideLoading, showLoading, showToast]);

  return (
    <View style={styles.container}>
      <AppText style={styles.title}>AlertProvider Demo</AppText>
      <TouchableOpacity style={styles.button} onPress={handleShowAlert}>
        <AppText style={styles.buttonText}>Show Alert Dialog</AppText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleShowToast}>
        <AppText style={styles.buttonText}>Show Success Toast</AppText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleShowErrorToast}>
        <AppText style={styles.buttonText}>Show Error Toast</AppText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleShowLoading}>
        <AppText style={styles.buttonText}>Show Loading (3s)</AppText>
      </TouchableOpacity>
    </View>
  );
});

AlertDemo.displayName = 'AlertDemo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: s(20),
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: ms(24),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: vs(30),
    color: Colors.PRIMARY,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: vs(15),
    borderRadius: s(8),
    marginBottom: vs(15),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: vs(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: s(4),
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: ms(16),
    fontWeight: '600',
  },
});

export default AlertDemo;
