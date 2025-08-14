import React from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import styles from './styles';
import ErrorBoundaryAnimation from '@/views/animation/ErrorBoundaryAnimation';
import { AppButton } from '@/elements/button/AppButton';

export type Props = {
  resetError: () => void;
  buttonText?: string;
  goBack?: boolean;
};

const FallbackComponent = (props: Props) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const onError = React.useCallback(() => {
    setIsLoading(true);

    if (props.goBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      props.resetError();
    }

    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, [props, navigation]);

  // eslint-disable-next-line arrow-body-style
  React.useEffect(() => {
    return () => {
      // cleanup khi unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <ErrorBoundaryAnimation style={styles.imageError} />
        <View style={styles.textView}>
          <Text style={styles.title}>{t('error.title')}</Text>
          <Text style={styles.subtitle}>{t('error.subtitle')}</Text>
        </View>

        <AppButton processing={isLoading} style={styles.button} onPress={onError}>
          <Text style={styles.buttonText}>
            {props.goBack ? t('error.goBack') : t('error.tryAgain')}
          </Text>
        </AppButton>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(FallbackComponent);
