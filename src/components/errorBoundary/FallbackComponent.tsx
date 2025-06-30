import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import ErrorBoundaryAnimation from '@/views/animation/ErrorBoundaryAnimation';
import { useTranslation } from 'react-i18next';

export type Props = { resetError: () => void; buttonText?: string; goBack?: boolean };

const FallbackComponent = (props: Props) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const onError = () => {
    props.goBack && navigation.canGoBack() ? navigation.goBack() : props.resetError();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ErrorBoundaryAnimation style={styles.imageError} />
        <View style={styles.textView}>
          <Text style={styles.title}>{t('error.title')}</Text>
          <Text style={styles.subtitle}>{t('error.subtitle')}</Text>
        </View>
        {/* <Text style={styles.error}>{props.error.toString()}</Text> */}
        <TouchableOpacity style={styles.button} onPress={onError}>
          <Text style={styles.buttonText}>
            {props.goBack ? t('error.goBack') : t('error.tryAgain')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FallbackComponent;
