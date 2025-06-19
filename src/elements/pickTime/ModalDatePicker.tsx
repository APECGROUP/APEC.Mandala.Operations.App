import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {PropsPickTime} from './InputPickTime';

export type ModalPickTimeRef = {
  onShowModal: () => void;
  onCloseModal: () => void;
};

function parseDateStringToDate(dateString: string): Date {
  if (!dateString) {
    return new Date();
  }
  const parts = dateString.split('/').map(part => parseInt(part, 10));
  // parts[0] is day, parts[1] is month, parts[2] is year
  // Note: months are 0-based in JavaScript Date, so subtract 1
  return new Date(parts[2], parts[1] - 1, parts[0]);
}

const ModalDatePicker = forwardRef(({data}: {data: PropsPickTime}, ref) => {
  const {
    value,
    onChangeText,
    mode = 'date',
    minimumDate = undefined, // Mặc định không giới hạn thời gian tối thiểu
    maximumDate = undefined, // Mặc định ngày hôm nay
  } = data;
  const [open, setOpen] = useState(false);

  const onOpen = () => {
    // console.log('onOpen', open);
    setOpen(true);
  };

  const onClose = () => {
    // console.log('onClose', open);
    if (open) {
      setOpen(false);
    }
  };

  useImperativeHandle(ref, () => ({
    onShowModal: onOpen,
    onCloseModal: onClose,
  }));

  useEffect(() => () => {
      setOpen(false); // Đảm bảo đóng modal khi component bị unmount
    }, []);

  return (
    <DatePicker
      modal
      mode={mode}
      open={open}
      locale="vi"
      date={parseDateStringToDate(value)}
      onConfirm={date => {
        // console.log('onConfirm', date, moment(date).format('DD/MM/YYYY'));
        onClose();
        onChangeText(moment(date).format('DD/MM/YYYY'));
      }}
      title={null}
      confirmText="Lưu"
      cancelText="Hủy"
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      onCancel={onClose}
    />
  );
});

export default ModalDatePicker;
