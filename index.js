/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';
if (__DEV__) {
  require('./ReactotronConfig');
}
AppRegistry.registerComponent(appName, () => App);
