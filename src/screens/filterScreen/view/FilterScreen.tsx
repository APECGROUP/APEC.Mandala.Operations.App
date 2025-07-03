import { StatusBar, StyleSheet, TextInput, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { getFontSize } from '../../../constants';
import { AppBlock } from '../../../elements/block/Block';
import AppTextInput from '../../../elements/textInput/AppTextInput';
import light from '../../../theme/light';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { navigate } from '@/navigation/RootNavigation';
import { PaddingHorizontal } from '@/utils/Constans';
import { ResponseNcc } from '@/views/modal/modalPickNcc/modal/PickNccModal';
import { TypePickDepartment } from '@/views/modal/modalPickDepartment/modal/PickDepartmentModal';
import IconArrowRight from '@assets/icon/IconArrowRight';
import IconCalendar from '@assets/icon/IconCalendar';
import { vs } from 'react-native-size-matters';
import Footer from './component/Footer';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type FilterScreenParams = {
  onApplyFilters?: (filters: any) => void;
};

const FilterScreen = () => {
  //  const { listDepartment, listRequester } = useFilterViewModel();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute() as RouteProp<Record<string, FilterScreenParams>, string>;

  const [prNo, setPrNo] = useState('');
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [department, setDepartment] = useState<TypePickDepartment>({
    id: '',
    name: '',
  });
  const [requester, setRequester] = useState<ResponseNcc>({
    id: '',
    name: '',
  });

  const refFromDate = useRef<TextInput>(null);
  const refToDate = useRef<TextInput>(null);

  const onPressFromDate = () => {
    navigate('ModalPickCalendar', {
      isSingleMode: true,
      onSelectDate: setFromDate,
    });
  };

  const onPressToDate = () => {
    navigate('ModalPickCalendar', {
      isSingleMode: true,
      onSelectDate: setToDate,
    });
  };

  const onPressDepartment = () => {
    navigate('PickDepartmentScreen', {
      setDepartment: setDepartment,
      department: department,
    });
  };

  const onPressRequester = () => {
    navigate('PickRequesterScreen', {
      setRequester: setRequester,
      requester: requester,
    });
  };

  const onConfirm = React.useCallback(() => {
    if (typeof route.params?.onApplyFilters === 'function') {
      route.params.onApplyFilters({
        prNo,
        fromDate,
        toDate,
        department,
        requester,
      });
    }
    navigation.goBack();
  }, [prNo, fromDate, toDate, department, requester, navigation, route.params]);

  return (
    <ViewContainer>
      <AppBlock style={styles.container}>
        <StatusBar barStyle={'dark-content'} />

        <View style={styles.form}>
          <AppTextInput
            required
            labelStyle={styles.label}
            label={t('filter.prNo')}
            placeholder={t('filter.prNo')}
            placeholderTextColor={light.placeholderTextColor}
            maxLength={10}
            value={prNo}
            onChangeText={setPrNo}
            inputStyle={styles.input}
          />
          <AppBlockButton onPress={onPressFromDate}>
            <AppTextInput
              editable={false}
              refName={refFromDate}
              required
              labelStyle={styles.label}
              label={t('filter.fromDate')}
              placeholder={t('filter.fromDate')}
              placeholderTextColor={light.placeholderTextColor}
              value={fromDate ? moment(fromDate).format('DD/MM/YYYY') : ''}
              inputStyle={styles.input}
              rightIcon={<IconCalendar fill={'#BABABA'} />}
            />
          </AppBlockButton>
          <AppBlockButton onPress={onPressToDate}>
            <AppTextInput
              editable={false}
              refName={refToDate}
              required
              labelStyle={styles.label}
              label={t('filter.toDate')}
              placeholder={t('filter.toDate')}
              placeholderTextColor={light.placeholderTextColor}
              value={toDate ? moment(toDate).format('DD/MM/YYYY') : ''}
              inputStyle={styles.input}
              rightIcon={<IconCalendar fill={'#BABABA'} />}
            />
          </AppBlockButton>
          <AppBlockButton onPress={onPressDepartment}>
            <AppTextInput
              editable={false}
              refName={refToDate}
              required
              labelStyle={styles.label}
              label={t('filter.department')}
              placeholder={t('filter.department')}
              placeholderTextColor={light.placeholderTextColor}
              value={department?.name}
              inputStyle={styles.input}
              rightIcon={<IconArrowRight style={{ transform: [{ rotate: '90deg' }] }} />}
            />
          </AppBlockButton>
          <AppBlockButton onPress={onPressRequester}>
            <AppTextInput
              editable={false}
              refName={refToDate}
              required
              labelStyle={styles.label}
              label={t('filter.requester')}
              placeholder={t('filter.requester')}
              placeholderTextColor={light.placeholderTextColor}
              value={requester?.name}
              inputStyle={styles.input}
              rightIcon={<IconArrowRight style={{ transform: [{ rotate: '90deg' }] }} />}
            />
          </AppBlockButton>
        </View>
        <Footer onRightAction={onConfirm} />
      </AppBlock>
    </ViewContainer>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  form: {
    alignItems: 'center',
    paddingHorizontal: PaddingHorizontal,
    width: '100%',
  },
  label: {
    fontSize: getFontSize(14),
    fontWeight: '700',
  },
  input: {
    fontSize: getFontSize(14),
    fontWeight: '500',
    borderWidth: 0,
    width: '100%',
    height: vs(40),
    borderRadius: vs(6),
    backgroundColor: light.backgroundTextInput,
    marginBottom: vs(16),
  },
});
