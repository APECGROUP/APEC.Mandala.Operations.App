// views/BlockStatus.tsx

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { vs, s } from 'react-native-size-matters';
import { AppText } from '@/elements/text/AppText';
import { useTranslation } from 'react-i18next';

interface BlockStatusProps {
  code: string;
}

const BlockStatus: React.FC<BlockStatusProps> = ({ code }) => {
  const { t } = useTranslation();

  // Định nghĩa một Map để tra cứu màu sắc và text cho từng trạng thái.
  // Dữ liệu được fix cứng tại đây.
  const STATUS_COLORS = useMemo(
    () =>
      new Map([
        ['PM', { backgroundColor: '#FFFBED', textColor: '#F79009', text: t('status.pm') }], // Chờ TBP duyệt
        ['PP', { backgroundColor: '#FFE2CE', textColor: '#FF7009', text: t('status.pp') }], // Chờ gán giá
        ['PA', { backgroundColor: '#F8F5E7', textColor: '#FFD700', text: t('status.pa') }], // Chờ KTT duyệt
        ['PC', { backgroundColor: '#E9F1EA', textColor: '#1E6F2F', text: t('status.pc') }], // Chờ GM/OM duyệt
        ['PO', { backgroundColor: '#F2E7F8', textColor: '#8B00FF', text: t('status.po') }], // Chờ tạo PO
        ['AP', { backgroundColor: '#E7F8E8', textColor: '#32CD32', text: t('status.ap') }], // Đã phê duyệt
        ['CC', { backgroundColor: '#E7E7E7', textColor: '#666666', text: t('status.cc') }], // Hủy bỏ
        ['RJ', { backgroundColor: '#F8E7E7', textColor: '#FF0000', text: t('status.rj') }], // Từ chối
      ]),
    [t],
  );

  // Dùng useMemo để cache kết quả tìm kiếm, chỉ tính toán lại khi code hoặc t thay đổi
  const colors = useMemo(
    () =>
      STATUS_COLORS.get(code.toUpperCase()) || {
        // Trả về màu mặc định nếu không tìm thấy trạng thái
        backgroundColor: '#CCCCCC',
        textColor: '#000000',
        text: code.toUpperCase(), // Trả về code nếu không tìm thấy
      },
    [code, STATUS_COLORS],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundColor }]}>
      <AppText size={12} color={colors.textColor} weight="500">
        {colors.text}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: vs(2),
    paddingHorizontal: s(4),
    borderRadius: s(4),
    alignSelf: 'flex-start',
    marginTop: vs(6),
  },
});

export default BlockStatus;
