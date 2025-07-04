import React, { useState, useCallback } from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';

import { Colors } from '@/theme/Config';
import { PaddingHorizontal } from '@/utils/Constans';
import { useAlert } from '@/elements/alert/AlertProvider';
import { AppButton } from '@/elements/button/AppButton';
import { AppText } from '@/elements/text/AppText';
import FastImage from 'react-native-fast-image';
import Images from '@assets/image/Images';

// --- Type Definition for Props ---
type FooterProps = {
  /**
   * Callback for the left (secondary) action button.
   * Can be an async function. Defaults to showing a rejection success alert.
   */
  onLeftAction?: () => Promise<void> | void;
  /**
   * Callback for the right (primary) action button.
   * Can be an async function. Defaults to showing an approval success alert.
   */
  onRightAction?: () => Promise<void> | void;
  /**
   * Title text for the left action button.
   * Defaults to 'filter.reset' (translated).
   */
  leftButtonTitle?: string;
  /**
   * Title text for the right action button.
   * Defaults to 'filter.confirm' (translated).
   */
  rightButtonTitle?: string;
  /**
   * Boolean to control the visibility of the left button.
   * Defaults to true.
   */
  showLeftButton?: boolean;
  /**
   * Boolean to control the visibility of the right button.
   * Defaults to true.
   */
  showRightButton?: boolean;
  leftButtonStyle?: StyleProp<ViewStyle>;
  rightButtonStyle?: StyleProp<ViewStyle>;
  leftTextStyle?: StyleProp<TextStyle>;
  rightTextStyle?: StyleProp<TextStyle>;
  customBottom?: number;
};

// --- ScreenActionFooter Component ---
const Footer = ({
  onLeftAction,
  onRightAction,
  leftButtonTitle, // New prop for left button title
  rightButtonTitle, // New prop for right button title
  showLeftButton = true, // New prop to control left button visibility
  showRightButton = true, // New prop to control right button visibility
  leftButtonStyle, // New prop for left button style
  rightButtonStyle, // New prop for right button style
  leftTextStyle, // New prop for left text style
  rightTextStyle, // New prop for right text style
  customBottom,
}: FooterProps) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const { showAlert } = useAlert();

  const [isLeftActionLoading, setIsLeftActionLoading] = useState(false);
  const [isRightActionLoading, setIsRightActionLoading] = useState(false);

  // Default alert handlers, now more generic
  const showDefaultRejectedAlert = useCallback(async () => {
    await new Promise<void>(resolve => setTimeout(resolve, 2000));
    showAlert(
      t('Bạn đã từ chối đơn thành công'),
      '',
      [
        {
          text: t('Trở về'),
          onPress: () => {},
        },
      ],
      <FastImage source={Images.ModalApprovedError} style={styles.modalImage} />,
    );
  }, [showAlert, t]);

  const showDefaultApprovedAlert = useCallback(async () => {
    await new Promise<void>(resolve => setTimeout(resolve, 2000));

    showAlert(
      t('Bạn đã duyệt đơn thành công'),
      '',
      [
        {
          text: t('Trở về'),
          onPress: () => {},
        },
      ],
      <FastImage source={Images.ModalApprovedSuccess} style={styles.modalImage} />,
    );
  }, [showAlert, t]);

  // Unified action handlers
  const handleLeftAction = useCallback(async () => {
    setIsLeftActionLoading(true);
    try {
      if (onLeftAction) {
        await onLeftAction();
      } else {
        await showDefaultRejectedAlert();
      }
    } catch (error) {
      console.error('Error during left action:', error);
      // TODO: Add error toast/alert if needed
    } finally {
      setIsLeftActionLoading(false);
    }
  }, [onLeftAction, showDefaultRejectedAlert]);

  const handleRightAction = useCallback(async () => {
    setIsRightActionLoading(true);
    try {
      if (onRightAction) {
        await onRightAction();
      } else {
        await showDefaultApprovedAlert();
      }
    } catch (error) {
      console.error('Error during right action:', error);
      // TODO: Add error toast/alert if needed
    } finally {
      setIsRightActionLoading(false);
    }
  }, [onRightAction, showDefaultApprovedAlert]);

  return (
    <View
      style={[styles.container, { paddingBottom: customBottom ? customBottom : bottom + vs(8) }]}>
      <View style={styles.buttonGroup}>
        {showLeftButton && (
          <View style={{ width: s(162) }}>
            <AppButton
              width={s(162)} // Consider making button width configurable if needed
              onPress={handleLeftAction}
              processing={isLeftActionLoading}
              style={[styles.leftButton, leftButtonStyle]}>
              <AppText size={14} weight="700" style={leftTextStyle}>
                {leftButtonTitle || t('filter.reset')} {/* Use prop title or default */}
              </AppText>
            </AppButton>
          </View>
        )}
        {showRightButton && (
          <View style={{ width: s(162) }}>
            <AppButton
              width={s(162)} // Consider making button width configurable if needed
              onPress={handleRightAction}
              processing={isRightActionLoading}
              style={[styles.rightButton, rightButtonStyle]}>
              <AppText size={14} weight="700" color={Colors.WHITE} style={rightTextStyle}>
                {rightButtonTitle || t('filter.confirm')} {/* Use prop title or default */}
              </AppText>
            </AppButton>
          </View>
        )}
      </View>
    </View>
  );
};

export default Footer;

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.WHITE,
    paddingTop: vs(8),
    paddingHorizontal: PaddingHorizontal,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(12),
  },
  leftButton: {
    width: s(162),
    height: vs(45),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY_600, // Typically a secondary action color
    borderRadius: s(8),
  },
  rightButton: {
    width: s(162),
    height: vs(45),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY, // Typically a primary action color
    borderRadius: s(8),
  },
  modalImage: {
    width: s(285),
    aspectRatio: 285 / 187,
  },
});
