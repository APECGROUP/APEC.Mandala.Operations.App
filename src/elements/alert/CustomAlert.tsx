import React, { useEffect, useState, memo, useCallback } from 'react';
import { View, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { s, vs } from 'react-native-size-matters';
import light from '../../theme/light';
import { getFontSize, SCREEN_WIDTH } from '../../constants';
import { PaddingHorizontal } from '@/utils/Constans';
import { AppText } from '../text/AppText';
import { Colors } from '@/theme/Config';
import { AnimatedButton } from '@/screens/approvePrScreen/view/ApprovePrScreen';

interface ButtonType {
  text: string;
  onPress: () => void;
  style?: 'cancel' | 'default';
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  content: string;
  icon?: React.ReactNode;
  animated?: React.ReactNode;
  buttons: ButtonType[];
  onClose: () => void;
  cancelButton?: boolean;
}

const parseText = (text: string) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, index) => {
    const isBold = index % 2 === 1;
    return (
      <AppText key={index} style={[styles.content, isBold && styles.bold]}>
        {part}
      </AppText>
    );
  });
};

const CustomAlert: React.FC<CustomAlertProps> = memo(
  ({ visible, title, content, buttons, onClose, icon, animated, cancelButton }) => {
    const [shouldRender, setShouldRender] = useState(false);
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(300);

    // Fade & Slide style
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    const animatedModalStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    // Open & Close animation handler
    useEffect(() => {
      if (visible) {
        setShouldRender(true);
        opacity.value = withTiming(1, { duration: 200 });
        translateY.value = withSpring(0, {
          damping: 12,
          stiffness: 120,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    const handlePress = useCallback(
      (button: ButtonType) => {
        button.onPress?.();
        opacity.value = withTiming(0, { duration: 150 });
        translateY.value = withTiming(300, { duration: 150 }, finished => {
          if (finished) {
            runOnJS(onClose)();
          }
        });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [onClose],
    );

    if (!shouldRender) return null;
    return (
      <>
        <StatusBar barStyle="light-content" translucent backgroundColor="rgba(0, 0, 0, 0.3)" />
        <AnimatedButton
          activeOpacity={1}
          disabled={!cancelButton}
          style={[styles.backdrop, animatedStyle]}
          onPress={onClose}>
          <Animated.View style={[styles.modalView, !icon && animatedModalStyle]}>
            <View style={styles.body}>
              {icon}
              <AppText style={styles.title}>{title}</AppText>
              <View style={styles.blockTextContent}>{parseText(content)}</View>
            </View>
            <View style={[styles.footer, buttons.length === 1 && styles.justifyCenter]}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePress(button)}
                  style={[
                    styles.button,
                    index !== buttons.length - 1 && {
                      marginRight: PaddingHorizontal,
                    },
                    button.style === 'cancel' && {
                      backgroundColor: light.selected,
                    },
                  ]}>
                  <AppText
                    style={[styles.buttonText, button.style === 'cancel' && styles.cancelButton]}>
                    {button.text}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
            {animated}
          </Animated.View>
        </AnimatedButton>
      </>
    );
  },
);

export default CustomAlert;

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
    color: '#141414',
  },
  blockTextContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: SCREEN_WIDTH - PaddingHorizontal * 2,
    alignItems: 'center',
    overflow: 'hidden',
  },
  body: {
    paddingTop: vs(24),
    alignItems: 'center',
    paddingHorizontal: s(12),
  },
  footer: {
    width: '100%',
    paddingHorizontal: PaddingHorizontal,
    paddingBottom: vs(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  title: {
    fontSize: getFontSize(18),
    marginBottom: vs(4),
    fontWeight: '700',
    color: light.text,
    textAlign: 'center',
  },
  content: {
    fontWeight: '500',
    textAlign: 'center',
    fontSize: getFontSize(14),
    color: Colors.TEXT_SECONDARY,
    marginBottom: vs(10),
  },
  button: {
    backgroundColor: light.primary,
    borderRadius: s(8),
    paddingVertical: vs(12),
    maxWidth: s(175),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonText: {
    color: light.white,
    fontSize: getFontSize(14),
    textAlign: 'center',
    fontWeight: '700',
  },
  cancelButton: {
    color: light.text,
  },
});
