import { StyleSheet, TextInput, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { getFontSize } from '../../../constants';
import { AppBlock } from '../../../elements/block/Block';
import AppTextInput from '../../../elements/textInput/AppTextInput';
import light from '../../../theme/light';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { navigate } from '@/navigation/RootNavigation';
import FooterDefault from './component/FooterFilter';
import { PaddingHorizontal } from '@/utils/Constans';
import { ResponseNcc } from '@/views/modal/modalPickNcc/modal/PickNccModal';
import { TypePickDepartment } from '@/views/modal/modalPickDepartment/modal/PickDepartmentModal';
import IconArrowRight from '@assets/icon/IconArrowRight';
import IconCalendar from '@assets/icon/IconCalendar';
import { vs } from 'react-native-size-matters';

const FilterScreen = () => {
  //  const { listDepartment, listRequester } = useFilterViewModel();
  const { t } = useTranslation();

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

  return (
    <AppBlock style={styles.container}>
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
        <AppTextInput
          onPress={onPressFromDate}
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
        <AppTextInput
          onPress={onPressToDate}
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
        <AppTextInput
          onPress={onPressDepartment}
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
        <AppTextInput
          onPress={onPressRequester}
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
      </View>
      <FooterDefault />
    </AppBlock>
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
