import {type StyleProp, type ViewStyle} from 'react-native';

import {type ElementProps} from '../element.props';

export interface AppBlockProps extends ElementProps {
  center?: boolean;
  size?: number;
  row?: boolean;
  column?: boolean;
  primary?: boolean;
  position?: 'absolute' | 'relative' | undefined;
  style?: StyleProp<ViewStyle>;
}
