import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Message from './Message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { vs } from 'react-native-size-matters';

export type ToastAction = {
  show: (msg: string, type: string) => any;
};

const ToastContainer = forwardRef<ToastAction>(({}, ref) => {
  const { top } = useSafeAreaInsets();
  const [messages, setMessages] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  const show = useCallback((msg: string, types: string) => {
    setMessages(msg);
    setType(types);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  }, []);

  useImperativeHandle(ref, () => ({
    show,
  }));

  const onHide = useCallback(() => {
    setOpen(false);
    setMessages('');
  }, []);

  return (
    <>
      {open && (
        <View style={[styles.container, { top: top + vs(10) }]}>
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
